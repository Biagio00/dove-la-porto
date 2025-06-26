import {collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import type {ViewPoint} from "../utils/Types.ts";
import {useEffect, useState} from 'react';
import {fireDB} from "../utils/Firebase.ts";


export const useFetchViewPoints = (
    {intervalTime, doSendNotification, triggerUpdate}: {intervalTime: number, doSendNotification: boolean, triggerUpdate: boolean}
) => {
    const [viewPoints, setViewPoints] = useState<ViewPoint[]>([]);

    useEffect(() => {
        let lastModified: Timestamp | null = null;

        const fetchPoints = async () => {
            const pointsQuery = query(collection(fireDB, "positions"))
            try {
                const querySnapshot = await getDocs(pointsQuery);
                const newViewPoints: ViewPoint[] = []
                for (const pointDoc of querySnapshot.docs) {
                    const point: ViewPoint = {
                        id: pointDoc.id,
                        type: pointDoc.data().type,
                        position: {
                            lat: pointDoc.data().position.latitude,
                            lng: pointDoc.data().position.longitude
                        },
                        lastModified: pointDoc.data().lastModified,
                        deleted: pointDoc.data().deleted
                    }
                    if (lastModified == null) {
                        lastModified = point.lastModified;
                    }
                    if (lastModified < point.lastModified) {
                        lastModified = point.lastModified;
                    }
                    if (!point.deleted) {
                        newViewPoints.push(point)
                    }
                }

                setViewPoints(newViewPoints);
            } catch (error) {
                console.error("Error getting view points:", error);
            }

        };
        fetchPoints()

        const checkLastModified = async () => {
            if (lastModified == null) {
                await fetchPoints()
                return;
            }
            const lastPointsQuery = query(
                collection(fireDB, "positions"),
                where("lastModified", ">", lastModified)
            )
            try {
                const querySnapshot = await getDocs(lastPointsQuery);
                if (querySnapshot.docs.length > 0) {
                    console.log("New points found");
                    await fetchPoints()
                    if (doSendNotification) {
                        //TODO: send notification
                    }
                }
            } catch (error) {
                console.error("Error checking updated points:", error);
            }
        }

        const interval = setInterval(checkLastModified, intervalTime);

        return () => {
            clearInterval(interval);
        };
    }, [intervalTime, doSendNotification, triggerUpdate]);

    return {viewPoints}
}


