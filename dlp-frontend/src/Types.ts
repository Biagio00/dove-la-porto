
// export interface ModificationPoint {position: google.maps.LatLngLiteral, type: string}
// export interface Point extends ModificationPoint {id: string}

export interface ModificationPoint {
    position: google.maps.LatLngLiteral,
    type: string,
    uuid: string,
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
