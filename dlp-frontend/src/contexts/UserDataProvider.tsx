import {useEffect, useState} from "react";
import {onAuthStateChanged, type User} from "firebase/auth";
import {fireAuth} from "../utils/Firebase.ts";
import {UserDataContext} from "./UserDataContext.tsx";

export function UserDataProvider({children}: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingAuthLib, setLoadingAuthLib] = useState<boolean>(true);
    const [role, setRole] = useState<number>(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, user => {
            setCurrentUser(user);
            setLoadingAuthLib(false);
            //TODO: setRole on firestore meglio fare un altro useEffect in modo da non incombere in errori
        })

        return unsubscribe
    }, []);

    return (
        <UserDataContext.Provider value={{
            currentUser: currentUser,
            loading: loadingAuthLib,
            role: role
        }}>
            {!loadingAuthLib && children}
        </UserDataContext.Provider>
    );

}





