import {fireDB} from './firebase';
import express from 'express';
import cors from 'cors';
import {authMiddleware, AuthRequest, roleMiddleware} from "./middlewares";
import {trashTypesStr} from "./Constants";
import {Timestamp, GeoPoint} from "firebase-admin/firestore";


const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use(authMiddleware);

app.post("/api/userSet", roleMiddleware(5), async (req: AuthRequest, res) => {
    if (!req.body) {
        res.status(400).json({
            error: "Parametri mancanti o errati"
        })
        return
    }
    let {uid, role} = req.body
    if (!uid || !role || uid.length < 1) {
        res.status(400).json({
            error: "Parametri mancanti o errati"
        })
        return
    }
    role = parseInt(role)
    if (isNaN(role) || role < 0 || role > 5) {
        res.status(400).json({
            error: "Parametri mancanti o errati"
        })
        return
    }
    if (req.userToken && uid == req.userToken.uid) {
        res.status(400).json({
            error: "Non puoi modificare il tuo ruolo"
        })
        return
    }

    try {
        const fireDoc = fireDB.collection("users-info").doc(uid)
        await fireDoc.set({
            role: role
        })
        res.status(200).json({
            message: "Ruolo impostato"
        })
    } catch (error: any) {
        res.status(500).json({
            error: "Non è stato possibile impostare il ruolo: " + error.toString()
        })
    }
})

app.post("/api/userDelete", roleMiddleware(5), async (req: AuthRequest, res) => {
    if (!req.body) {
        res.status(400).json({
            error: "Parametri mancanti o errati"
        })
        return
    }
    const {uid} = req.body
    if (!uid || uid.length < 1) {
        res.status(400).json({
            error: "Parametri mancanti o errati"
        })
        return
    }
    if (req.userToken && uid == req.userToken.uid) {
        res.status(400).json({
            error: "Non puoi modificare il tuo ruolo"
        })
        return
    }

    try {
        const fireDoc = fireDB.collection("users-info").doc(uid)
        await fireDoc.delete()
        res.status(200).json({
            message: "Ruolo eliminato"
        })
    } catch (error: any) {
        res.status(500).json({
            error: "Non è stato possibile eliminare il ruolo: " + error.toString()
        })
    }
})

app.post("/api/positionsSet", roleMiddleware(2), async (req: AuthRequest, res) => {
    if (!req.body) {
        res.status(400).json({
            error: "Parametri mancanti o errati"
        })
        return
    }
    let {points} = req.body
    if (!points || points.length < 1) {
        res.status(400).json({
            error: "Parametri mancanti o errati"
        })
        return
    }
    const toElaboratePoints = []
    let timestamp: Timestamp = Timestamp.now()
    for (const modificationPoint of points) {

        if (!modificationPoint.position || !modificationPoint.position.lat || !modificationPoint.position.lng ||
            typeof modificationPoint.position.lat != "number" || typeof modificationPoint.position.lng != "number" ||
            isNaN(modificationPoint.position.lat) || isNaN(modificationPoint.position.lng)) {
            res.status(400).json({
                error: "Parametro position mancanti o errato"
            })
            return
        }
        const position = new GeoPoint(modificationPoint.position.lat, modificationPoint.position.lng)
        if (!modificationPoint.type || modificationPoint.type.length < 1 || !(trashTypesStr.indexOf(modificationPoint.type) >= 0)) {
            res.status(400).json({
                error: "Parametro type mancante o errato"
            })
            return
        }
        const type: string = modificationPoint.type
        let id: string | null = null
        if (modificationPoint.id) {
            if (typeof modificationPoint.id == "string" && modificationPoint.id.length > 0) {
                id = modificationPoint.id
            } else if ((typeof modificationPoint.id != "string" || modificationPoint.id.length < 1)) {
                res.status(400).json({
                    error: "Parametro id mancante o errato"
                })
                return
            }
        }
        if (typeof modificationPoint.deleted != "boolean") {
            res.status(400).json({
                error: "Parametro deleted mancante o errato"
            })
            return
        }
        const deleted = modificationPoint.deleted

        toElaboratePoints.push( {
            position: position,
            type: type,
            id: id,
            deleted: deleted,
            lastModified: timestamp
        })
    }

    try {
        // effettuo una batch write per atomicizzare il processo e per renderlo più veloce
        //   atomicizzando la procedura posso restituire un unico risultato al client (riuscito o fallito),
        //   altrimenti ne dovrei inviare uno per ogni punto
        const batch = fireDB.batch();
        const positionsCollection = fireDB.collection('positions');

        for (const point of toElaboratePoints) {
            if (point.id) {
                // se ho l'id si tratta per forza di un aggiornamento
                const docRef = positionsCollection.doc(point.id);
                batch.set(docRef, {
                    position: point.position,
                    type: point.type,
                    lastModified: point.lastModified,
                    deleted: point.deleted
                });
            } else {
                // se non ho l'id devo creare un nuovo documento (con id automatico)
                const docRef = positionsCollection.doc();
                batch.set(docRef, {
                    position: point.position,
                    type: point.type,
                    lastModified: point.lastModified,
                    deleted: point.deleted
                });
            }
        }
        await batch.commit();
        res.status(200).json({
            message: "Punti aggiornati con successo"
        });
    } catch (error: any) {
        res.status(500).json({
            error: "Errore durante l'aggiornamento dei punti: " + error.toString()
        });
    }
})



app.listen(3000, () => {
    console.log('Server in esecuzione sulla porta 3000');
});



