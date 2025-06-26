import {fireDB} from './firebase';
import express from 'express';
import cors from 'cors';
import {authMiddleware, AuthRequest, roleMiddleware} from "./middlewares";


const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use(authMiddleware);

app.post("/api/userSet", roleMiddleware(5), async (req: AuthRequest, res) => {
    console.log(req.body)
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



app.listen(3000, () => {
    console.log('Server in esecuzione sulla porta 3000');
});



