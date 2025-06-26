
// export interface ModificationPoint {position: google.maps.LatLngLiteral, type: string}
// export interface Point extends ModificationPoint {id: string}

import type {User} from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export interface UserData {
    currentUser: User | null,
    loading: boolean,
    // error: string | null,
    role: number
}

export interface UserInfo {
    userID: string,
    role: number
}

export interface ViewPoint {
    position: google.maps.LatLngLiteral,
    type: string,
    id: string,
    lastModified: Timestamp,
    deleted: boolean
}

export interface ServerModificationPoint {
    position: google.maps.LatLngLiteral,
    type: string,
    id: string | null,
    deleted: boolean
}

export interface ModificationPoint extends ServerModificationPoint {
    modified: boolean,
    localID: string | null
}


export type OverlayGeometry =
    | google.maps.marker.AdvancedMarkerElement
    | google.maps.Polygon
    | google.maps.Polyline
    | google.maps.Rectangle
    | google.maps.Circle;

export interface DrawResult {
    type: google.maps.drawing.OverlayType;
    overlay: OverlayGeometry;
}
