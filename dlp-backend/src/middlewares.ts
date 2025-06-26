import {NextFunction, Request, RequestHandler, Response} from "express";
import {fireAdmin, fireDB} from "./firebase";



export interface AuthRequest extends Request {
    userToken?: fireAdmin.auth.DecodedIdToken;
}

export const authMiddleware: RequestHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        // Authorization: Bearer <token-firebase>
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Non autorizzato - Token mancante'
            });
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        try {
            req.userToken = await fireAdmin.auth().verifyIdToken(token);
            next();
        } catch (error) {
            res.status(401).json({
                error: 'Non autorizzato - Token non valido'
            });
        }

    } catch (error) {
        res.status(500).json({
            error: 'Errore interno del server'
        });
    }
};


const getUserRole = async (uid: string): Promise<number> => {
    try {
        const fireDoc = fireDB.collection("users-info").doc(uid);
        const userInfoDoc = await fireDoc.get();
        if (!userInfoDoc.exists) {
            console.log("User role not found");
            return 0;
        }
        const userInfoData = userInfoDoc.data();
        if (userInfoData == null) {
            return 0;
        }

        return userInfoData.role;

    } catch (error) {
        console.error("Error getting user role:", error);
        return 0;
    }

}

export const roleMiddleware = (minimumRole: number): RequestHandler => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.userToken) {
                res.status(401).json({
                    error: 'Non autorizzato - Token mancante'
                });
                return
            }
            const uid = req.userToken.uid;
            const userRole = await getUserRole(uid);
            if (userRole < minimumRole) {
                res.status(401).json({
                    error: 'Non autorizzato - Ruolo insufficiente'
                });
                return;
            }
            next()
        } catch (error) {
            res.status(500).json({
                error: 'Errore interno del server'
            });
        }
    }
};




