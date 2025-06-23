import {AdvancedMarker, ControlPosition, InfoWindow, Map, MapControl} from "@vis.gl/react-google-maps";
import {Col, Container, Row, Image, Button, ListGroup, Form} from "react-bootstrap";
import {useCallback, useMemo, useRef, useState} from "react";
import type {ModificationPoint} from "../Types.ts";
import {useDrawingManager} from "../hooks/useDrawingManager.tsx";
import {ModifiableAdvancedMarker} from "../components/ModifiableAdvancedMarker.tsx";
import {MapLegend} from "../components/MapLegend.tsx";
import {AddNewMarker} from "../components/AddNewMarker.tsx";
import {trashTypesStr} from "../Constants.ts";
import {v4 as uuidv4} from 'uuid';

const MapPos = () => {
    const [points, setPoints] = useState<ModificationPoint[]>([
        //test data
        {uuid: uuidv4(), position: {lat: 43.166221, lng: 10.567741}, modified: false, type: "solo-vetro"},
        {uuid: uuidv4(), position: {lat: 43.167438, lng: 10.579719}, modified: false, type: "discarica"},
        {uuid: uuidv4(), position: {lat: 43.170405, lng: 10.574837}, modified: false, type: "completa"}
    ]);

    const [toDeletePoints, setToDeletePoints] = useState<ModificationPoint[]>([]);

    const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);

    // const drawingManager = useDrawingManager();

    const onMarkerChanged = useCallback((updatedPoint: ModificationPoint) => {
        //update data
        setPoints((oldPoints: ModificationPoint[]) => {
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
        setPoints((oldPoints: ModificationPoint[]) => {
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

    const onAdd = useCallback((newPoint: ModificationPoint) => {
        //update data
        setPoints((oldPoints: ModificationPoint[]) => {
            return [...oldPoints, newPoint];
        })
        setInfoWindowPosition(null)
    }, [setPoints, setInfoWindowPosition])

    const onMarkerRecalled = useCallback((recalledPoint: ModificationPoint) => {
        onAdd(recalledPoint);
        setToDeletePoints((oldPoints: ModificationPoint[]) => {
            const newDeletedPoints = oldPoints.filter((p) => {
                if (p.uuid !== recalledPoint.uuid) {
                    return true;
                } else {
                    return false;
                }
            })
            return newDeletedPoints;
        })
    }, [onAdd, setToDeletePoints])

    const draggingRef = useRef<boolean>(false);

    const memoModifications = useMemo<boolean>(() => {
        if (toDeletePoints.length > 0) {
            return true;
        }
        for (const point of points) {
            if (point.modified) {
                return true;
            }
        }
        return false;
    }, [points, toDeletePoints]);


    return (
        <>

            <Container>
                <Row>
                    <Col md={9}>
                        <>
                            <MapLegend/>
                            <Map
                                mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
                                // className={"vh-100 vw-100 position-fixed"}
                                className={"vh-100"}
                                defaultCenter={{lat: 43.1710196, lng: 10.569224}}
                                defaultZoom={14}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                                // onDragstart={(e) => {
                                //     console.log(e)
                                //     draggning = true;
                                // }}
                                onClick={(e) => {
                                    // console.log(e)
                                    if (draggingRef.current) {
                                        draggingRef.current = false
                                        return;
                                    }
                                    draggingRef.current = false;
                                    if (e.detail.latLng == null) {
                                        return
                                    }
                                    const latLngLit = {
                                        lat: e.detail.latLng.lat,
                                        lng: e.detail.latLng.lng
                                    }
                                    setInfoWindowPosition(latLngLit);
                                }}
                            >

                                {points.map(point => (

                                    <ModifiableAdvancedMarker key={point.uuid} point={point} draggingRef={draggingRef}
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
                            {infoWindowPosition && (
                                <InfoWindow position={infoWindowPosition} maxWidth={200}
                                            onClose={() => setInfoWindowPosition(null)}
                                            onCloseClick={() => setInfoWindowPosition(null)}>
                                    <AddNewMarker position={infoWindowPosition} onAdd={onAdd} />
                                </InfoWindow>

                            )}
                        </>
                    </Col>
                    <Col md={3}>
                        <Container className={"text-center mt-2"}>
                        <Button disabled={!memoModifications} variant={memoModifications ? "primary": "outline-secondary"}>
                            {memoModifications ? "Salva modifiche" : "Non ci sono modifiche da salvare"}
                        </Button>
                        </Container>

                        <ListGroup className={"overflow-y-scroll mt-2"} style={{maxHeight: "85vh"}} variant={"flush"}>
                        {points.map(point => (
                            <ListGroup.Item key={point.uuid + "test"} variant={point.modified ? "warning" : ""}>
                                <Container>
                                    <Row>
                                        <Col>
                                            ID: {point.uuid}
                                        </Col>
                                    </Row>
                                    <Row className={"mt-1"}>
                                        <Col>
                                            <Form.Select size={"sm"} value={point.type} onChange={
                                                (e) => {
                                                    onMarkerChanged({...point, type: e.target.value, modified: true})
                                                }
                                            }>
                                                {trashTypesStr.map(typeStr => (
                                                    <option key={typeStr} value={typeStr}>{typeStr}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className={"mt-1"}>
                                        <Col>
                                            Latitudine: {point.position.lat.toFixed(6)}
                                        </Col>
                                    </Row>
                                    <Row className={"mt-1"}>
                                        <Col>
                                            Longitudine: {point.position.lng.toFixed(6)}
                                        </Col>
                                    </Row>
                                    <Row className={"mt-1"}>
                                        <Col className={"text-center"}>
                                            <Button size={"sm"} variant="danger" onClick={
                                                () => {
                                                    onMarkerDeleted({...point, modified: true})
                                                }
                                            }>
                                                ✖ Elimina
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </ListGroup.Item>


                            // <p key={point.uuid + "test"}>{point.uuid}: <br/>{point.position.lat},<br/>{point.position.lng}<br/>,{point.type},{point.modified ? "modified" : "not modified"}
                            // </p>
                        ))}

                            {toDeletePoints.map(deletedPoint => (
                                <ListGroup.Item key={deletedPoint.uuid + "test"} variant={"danger"}>
                                    <Container>
                                        <Row>
                                            <Col>
                                                [DELETED] ID: {deletedPoint.uuid}
                                            </Col>
                                        </Row>
                                        <Row className={"mt-1"}>
                                            <Col>
                                                point.type
                                            </Col>
                                        </Row>
                                        <Row className={"mt-1"}>
                                            <Col>
                                                Latitudine: {deletedPoint.position.lat.toFixed(6)}
                                            </Col>
                                        </Row>
                                        <Row className={"mt-1"}>
                                            <Col>
                                                Longitudine: {deletedPoint.position.lng.toFixed(6)}
                                            </Col>
                                        </Row>
                                        <Row className={"mt-1"}>
                                            <Col className={"text-center"}>
                                                <Button size={"sm"} variant="primary" onClick={() => onMarkerRecalled(deletedPoint)}>
                                                    🔃 Riprendi
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </ListGroup.Item>


                                // <p key={point.uuid + "test"}>{point.uuid}: <br/>{point.position.lat},<br/>{point.position.lng}<br/>,{point.type},{point.modified ? "modified" : "not modified"}
                                // </p>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>

            </Container>


        </>
    )
}

export {MapPos};
