import {collection, getDocs, query } from "firebase/firestore";
import type {ViewPoint} from "../utils/Types.ts";
import {useEffect, useState} from 'react';
import {fireDB} from "../utils/Firebase.ts";

export const useFetchViewPoints = (
    {intervalTime}: {intervalTime: number}
) => {
    const [viewPoints, setViewPoints] = useState<ViewPoint[]>([]);

    useEffect(() => {
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
                        }
                    }
                    newViewPoints.push(point)
                }

                setViewPoints(newViewPoints);
            } catch (error) {
                console.error("Error getting view points:", error);
            }

        };
        fetchPoints()
        const interval = setInterval(fetchPoints, intervalTime);

        return () => {
            clearInterval(interval);
        };
    }, [intervalTime]);

    return {viewPoints}
}


