
/* eslint-disable  @typescript-eslint/no-explicit-any */
import {serverApiAddr} from "./Constants.ts";
import type {User} from "firebase/auth";

export const doApiFetchPostJson = async (path: string, user: User | null, body: any) => {
    const res: {
        data: string | null,
        error: string | null
    } = {
        data: null,
        error: null
    }
    if (!user) {
        res.error = "Non sei autenticato"
        return res
    }
    let token = null;
    try {
        token = await user.getIdToken();
    } catch {
        res.error = "Token non presente"
        return res
    }

    try {
        const response = await fetch(serverApiAddr + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            res.error = "" + response.status + " "
            let err: { error: string } | null = null
            try {
                err = await response.json()
            } catch {
                err = null;
            }
            if (err == null || err.error == null) {
                res.error += "" + response.statusText
                return res;
            }
            res.error += err.error
            return res;
        }
        const data: {message: string} = await response.json()
        if (data == null || data.message == null) {
            res.data = "" + response.status + " " + response.statusText
            return res;
        }
        res.data = data.message
        return res;
    } catch (error: any) {
        res.error = error.toString()
    }
    return res;
}

