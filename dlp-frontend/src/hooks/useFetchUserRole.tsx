import {doc, getDoc } from "firebase/firestore";
import {useEffect} from 'react';
import {fireDB} from "../utils/Firebase.ts";

export const useFetchUserRole = (
    {userID, setRole}: {userID: string | undefined, setRole: (role: number) => void},
) => {
    useEffect(() => {
        if (userID == null) {
            setRole(0);
            return;
        }
        const fetchUserRole = async () => {
            try {
                const fireDoc = doc(fireDB, "users-info", userID);
                const userInfoDoc = await getDoc(fireDoc);
                if (!userInfoDoc.exists()) {
                    console.log("User role not found");
                    setRole(0);
                    return;
                }

                const userInfoData = userInfoDoc.data();
                if (userInfoData == null) {
                    setRole(0);
                    return;
                }

                setRole(userInfoData.role);

            } catch (error) {
                console.error("Error getting user role:", error);
            }

        };
        fetchUserRole()

    }, [userID, setRole]);

    return {}
}


