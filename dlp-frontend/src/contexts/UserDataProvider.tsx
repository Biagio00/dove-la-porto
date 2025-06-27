import {type ReactNode, useEffect, useState} from "react";
import {onAuthStateChanged, type User} from "firebase/auth";
import {fireAuth} from "../utils/Firebase.ts";
import {UserDataContext} from "./UserDataContext.tsx";
import {useFetchUserRole} from "../hooks/useFetchUserRole.tsx";

export const UserDataProvider = ({children}: { children: ReactNode })  => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingAuthLib, setLoadingAuthLib] = useState<boolean>(true);
    const [role, setRole] = useState<number>(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, user => {
            setCurrentUser(user);
            setLoadingAuthLib(false);
        })

        return unsubscribe
    }, []);

    useFetchUserRole({userID: currentUser?.uid, setRole: setRole})

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





