import {AdvancedMarker, ControlPosition, InfoWindow, Map, MapControl} from "@vis.gl/react-google-maps";
import {Col, Container, Row, Image} from "react-bootstrap";
import {useCallback, useState} from "react";
import type {ModificationPoint} from "../Types.ts";
import {useDrawingManager} from "../hooks/useDrawingManager.tsx";
import {ModifiableAdvancedMarker} from "../components/ModifiableAdvancedMarker.tsx";
import {MapLegend} from "../components/MapLegend.tsx";

const MapPos = () => {
    const [points, setPoints] = useState<ModificationPoint[]>([
        //test data
        {uuid: "1", position: {lat: 43.166221, lng: 10.567741}, modified: false, type: "glass-only"},
        {uuid: "2", position: {lat: 43.167438, lng: 10.579719}, modified: false, type: "station"},
        {uuid: "3", position: {lat: 43.170405, lng: 10.574837}, modified: false, type: "all"}
    ]);

    const [toDeletePoints, setToDeletePoints] = useState<ModificationPoint[]>([]);

    const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);

    // const drawingManager = useDrawingManager();

    const onMarkerChanged = useCallback((updatedPoint: ModificationPoint) => {
        //update data
        setPoints( (oldPoints: ModificationPoint[]) => {
            const newPoints = oldPoints.map((p) => {
                if (p.uuid === updatedPoint.uuid) {
                    return updatedPoint;
                } else {
                    return p;
                }
            })
            return newPoints;
        })
    }, [setPoints])

    const onMarkerDeleted = useCallback((deletedPoint: ModificationPoint) => {
        //update data
        setPoints( (oldPoints: ModificationPoint[]) => {
            const newPoints = oldPoints.filter((p) => {
                if (p.uuid !== deletedPoint.uuid) {
                    return true;
                } else {
                    return false;
                }
            })
            return newPoints;
        })
        setToDeletePoints((oldPoints: ModificationPoint[]) => {
            return [...oldPoints, deletedPoint];
        })
    }, [setPoints, setToDeletePoints])

    return (
        <>

            <Container>
                <Row>
                    <Col md={9}>
                        <>
                            <MapLegend />
                            <Map
                                mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
                                // className={"vh-100 vw-100 position-fixed"}
                                className={"vh-100"}
                                defaultCenter={{lat: 43.1710196, lng: 10.569224}}
                                defaultZoom={14}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}>

                                {points.map(point => (

                                    <ModifiableAdvancedMarker key={point.uuid} point={point}
                                                              onChanged={onMarkerChanged}
                                                              onDeleted={onMarkerDeleted}/>

                                    // <AdvancedMarker key={point.uuid} position={point.position} clickable={true}
                                    //                 draggable={true} onDragEnd={(e) => {
                                    //     console.log(e)
                                    //     if (e.latLng == null) {
                                    //         return
                                    //     }
                                    //
                                    //
                                    // }}>
                                    //     <Image width={"40px"} height={"40px"} style={{fontSize: "xx-large"}}
                                    //            src={"/types/" + point.type + ".svg"} alt={"🗑️"}/>
                                    //
                                    // </AdvancedMarker>

                                ))}

                                {/*<MapControl position={ControlPosition.TOP_CENTER}>*/}
                                {/*    {drawingManager}*/}
                                {/*</MapControl>*/}

                            </Map>
                        </>
                    </Col>
                    <Col>
                        {points.map(point => (
                            <p key={point.uuid + "test"}>{point.uuid}: <br/>{point.position.lat},<br/>{point.position.lng}<br/>,{point.type},{point.modified ? "modified" : "not modified"}
                            </p>
                        ))}
                    </Col>
                </Row>

            </Container>


        </>
    )
}

export {MapPos};
