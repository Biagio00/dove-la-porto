
// export interface ModificationPoint {position: google.maps.LatLngLiteral, type: string}
// export interface Point extends ModificationPoint {id: string}

import type {User} from "firebase/auth";

export interface UserData {
    currentUser: User | null,
    loading: boolean,
    // error: string | null,
    role: number
}


export interface ViewPoint {
    position: google.maps.LatLngLiteral,
    type: string,
    uuid: string,
}

export interface ModificationPoint extends ViewPoint {
    modified: boolean
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
