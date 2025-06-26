// import {collection, getDocs, query } from "firebase/firestore";
// import type {ModificationPoint} from "../utils/Types.ts";
// import {useEffect, useState} from 'react';
// import {fireDB} from "../utils/Firebase.ts";
//
// export const useFetchModificationPoints = () => {
//     const [modificationPoints, setModificationPoints] = useState<ModificationPoint[]>([]);
//
//     useEffect(() => {
//         const fetchPoints = async () => {
//             const pointsQuery = query(collection(fireDB, "positions"))
//             try {
//                 const querySnapshot = await getDocs(pointsQuery);
//                 const newModificationPoints: ModificationPoint[] = []
//                 for (const pointDoc of querySnapshot.docs) {
//                     const point: ModificationPoint = {
//                         modified: false,
//                         id: pointDoc.id,
//                         type: pointDoc.data().type,
//                         position: {
//                             lat: pointDoc.data().position.latitude,
//                             lng: pointDoc.data().position.longitude
//                         }
//                     }
//                     newModificationPoints.push(point)
//                 }
//
//                 setModificationPoints(newModificationPoints);
//             } catch (error) {
//                 console.error("Error getting modification points:", error);
//             }
//
//         };
//         fetchPoints()
//
//     }, []);
//
//     return {modificationPoints: modificationPoints}
// }
//
//
