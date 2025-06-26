import {collection, getDocs, query } from "firebase/firestore";
import type {UserInfo} from "../utils/Types.ts";
import {useEffect, useState} from 'react';
import {fireDB} from "../utils/Firebase.ts";

export const useFetchUsersInfo = ({triggerUpdate}: {triggerUpdate: boolean}) => {
    const [usersInfo, setUsersInfo] = useState<UserInfo[]>([]);

    useEffect(() => {
        const fetchUsersInfo = async () => {
            const usersInfoQuery = query(collection(fireDB, "users-info"))
            try {
                const querySnapshot = await getDocs(usersInfoQuery);
                const newUsersInfo: UserInfo[] = []
                for (const userInfoDoc of querySnapshot.docs) {
                    const userInfo: UserInfo = {
                        userID: userInfoDoc.id,
                        role: userInfoDoc.data().role,
                    }
                    newUsersInfo.push(userInfo)
                }

                setUsersInfo(newUsersInfo);
            } catch (error) {
                console.error("Error getting users:", error);
            }

        };
        fetchUsersInfo()


    }, [setUsersInfo, triggerUpdate]);

    return {usersInfo}
}


