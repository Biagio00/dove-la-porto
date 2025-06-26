import {InfoWindow, Map as Maps} from "@vis.gl/react-google-maps";
import {Col, Container, Row, Button, ListGroup, Form} from "react-bootstrap";
import {useCallback, useMemo, useRef, useState} from "react";
import type {ModificationPoint} from "../utils/Types.ts";
import {ModifiableAdvancedMarker} from "../components/ModifiableAdvancedMarker.tsx";
import {MapLegend} from "../components/MapLegend.tsx";
import {AddNewMarker} from "../components/AddNewMarker.tsx";
import {trashTypesStr} from "../utils/Constants.ts";
import {useFetchViewPoints} from "../hooks/useFetchViewPoints.tsx";

const MapPos = () => {
    const {viewPoints} = useFetchViewPoints({intervalTime: 3000, doSendNotification: false})
    const [toChangePoints, setToChangePoints] = useState<ModificationPoint[]>([]);
    // const [toAddPoints, setToAddPoints] = useState<ModificationPoint[]>([]);
    // const [toDeletePoints, setToDeletePoints] = useState<ModificationPoint[]>([]);

    const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);

    const onAdd = useCallback((newPoint: ModificationPoint) => {
        //update data
        setToChangePoints((oldPoints: ModificationPoint[]) => {
            return [...oldPoints, newPoint];
        })
        setInfoWindowPosition(null)
    }, [setToChangePoints, setInfoWindowPosition])

    const onMarkerChanged = useCallback((updatedPoint: ModificationPoint) => {
        //update data
        setToChangePoints((oldPoints: ModificationPoint[]) => {
            let found = false;
            const newPoints = oldPoints.map((p) => {
                if (p.id === updatedPoint.id) {
                    found = true;
                    return updatedPoint;
                } else {
                    return p;
                }
            })
            if (!found) {
                newPoints.push(updatedPoint);
            }
            return newPoints;
        })
    }, [setToChangePoints])

    const onMarkerRestored = useCallback((restoredPoint: ModificationPoint) => {
        //update data
        setToChangePoints((oldPoints: ModificationPoint[]) => {
            const newPoints = oldPoints.filter((p) => {
                if (p.id === restoredPoint.id) {
                    return false;
                } else {
                    return true;
                }
            })
            return newPoints;
        })
    }, [setToChangePoints])

    // const onMarkerDeleted = useCallback((deletedPoint: ModificationPoint) => {
    //     //update data
    //     setToChangePoints((oldPoints: ModificationPoint[]) => {
    //         const newToChangePoints = oldPoints.map((p) => {
    //             if (p.id != null && deletedPoint.id != null && p.id === deletedPoint.id) {
    //                 return deletedPoint;
    //             } else if (p.localID != null && deletedPoint.localID != null && p.localID === deletedPoint.localID) {
    //                 return deletedPoint;
    //             } else {
    //                 return p;
    //             }
    //         })
    //         return newToChangePoints;
    //     })
    // }, [setToChangePoints])

    // const onMarkerRecalled = useCallback((recalledPoint: ModificationPoint) => {
    //     //update data
    //     setToChangePoints((oldPoints: ModificationPoint[]) => {
    //         const newPoints = oldPoints.map((p) => {
    //             if (p.id === recalledPoint.id) {
    //                 return recalledPoint;
    //             } else {
    //                 return p;
    //             }
    //         })
    //         return newPoints;
    //     })
    // }, [setToChangePoints])

    //
    // const onAdd = useCallback((newPoint: ModificationPoint) => {
    //     //update data
    //     setToAddPoints((oldPoints: ModificationPoint[]) => {
    //         return [...oldPoints, newPoint];
    //     })
    //     setInfoWindowPosition(null)
    // }, [setToAddPoints, setInfoWindowPosition])

    // const onMarkerChanged = useCallback((updatedPoint: ModificationPoint) => {
    //     //update data
    //     if (updatedPoint.localID != null) {
    //         setToAddPoints((oldPoints: ModificationPoint[]) => {
    //             const newPoints = oldPoints.map((p) => {
    //                 if (p.localID === updatedPoint.localID) {
    //                     return updatedPoint;
    //                 } else {
    //                     return p;
    //                 }
    //             })
    //             return newPoints;
    //         })
    //     }
    //     if (updatedPoint.id != null) {
    //         setToChangePoints((oldPoints: ModificationPoint[]) => {
    //             const newPoints = oldPoints.map((p) => {
    //                 if (p.id === updatedPoint.id) {
    //                     return updatedPoint;
    //                 } else {
    //                     return p;
    //                 }
    //             })
    //             return newPoints;
    //         })
    //     }
    // }, [setToChangePoints, setToAddPoints])

    // const onMarkerDeleted = useCallback((deletedPoint: ModificationPoint) => {
    //     //update data
    //     if (deletedPoint.localID != null) {
    //         setToAddPoints((oldPoints: ModificationPoint[]) => {
    //             const newPoints = oldPoints.filter((p) => {
    //                 if (p.localID !== deletedPoint.localID) {
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             })
    //             return newPoints;
    //         })
    //     }
    //     if (deletedPoint.id != null) {
    //         setToChangePoints((oldPoints: ModificationPoint[]) => {
    //             const newPoints = oldPoints.filter((p) => {
    //                 if (p.id !== deletedPoint.id) {
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             })
    //             return newPoints;
    //         })
    //     }
    //     setToDeletePoints((oldPoints: ModificationPoint[]) => {
    //         return [...oldPoints, deletedPoint];
    //     })
    // }, [setToChangePoints, setToAddPoints, setToDeletePoints])

    // const onMarkerRecalled = useCallback((recalledPoint: ModificationPoint) => {
    //     if (recalledPoint.id != null) {
    //         setToChangePoints((oldPoints: ModificationPoint[]) => {
    //             return [...oldPoints, recalledPoint];
    //         })
    //     }
    //     if (recalledPoint.localID != null) {
    //         setToAddPoints((oldPoints: ModificationPoint[]) => {
    //             return [...oldPoints, recalledPoint];
    //         })
    //     }
    //     setToDeletePoints((oldPoints: ModificationPoint[]) => {
    //         const newDeletedPoints = oldPoints.filter((p) => {
    //             if (p.id != null && recalledPoint.id != null && p.id === recalledPoint.id) {
    //                 return false;
    //             } else if (p.localID != null && recalledPoint.localID != null && p.localID === recalledPoint.localID) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         })
    //         return newDeletedPoints;
    //     })
    // }, [setToChangePoints, setToDeletePoints])

    const draggingRef = useRef<boolean>(false);

    const memoModifications = useMemo<boolean>(() => {
        if (toChangePoints.length > 0) {
            return true;
        }
        return false;
    }, [toChangePoints]);

    const memoPoints = useMemo<Map<string, ModificationPoint>>(() => {
        const combinedModificationPoints: Map<string, ModificationPoint> = new Map()
        for (const viewPoint of viewPoints) {
            combinedModificationPoints.set(viewPoint.id, {
                localID: null,
                id: viewPoint.id,
                type: viewPoint.type,
                position: viewPoint.position,
                modified: false,
                deleted: false
            })
        }
        for (const toChangePoint of toChangePoints) {
            let key: string | null = null;
            if (toChangePoint.id != null) {
                key = toChangePoint.id
            } else if (toChangePoint.localID != null) {
                key = toChangePoint.localID
            }
            if (key == null) {
                continue
            }
            combinedModificationPoints.set(key, {
                localID: toChangePoint.localID,
                id: toChangePoint.id,
                type: toChangePoint.type,
                position: toChangePoint.position,
                modified: toChangePoint.modified,
                deleted: toChangePoint.deleted
            })
        }
        return combinedModificationPoints;
    }, [viewPoints, toChangePoints]);

    // const memoPoints = useMemo<ModificationPoint[]>(() => {
    //     const combinedModificationPoints: Map<string, ModificationPoint> = new Map()
    //     for (const viewPoint of viewPoints) {
    //         combinedModificationPoints.set(viewPoint.id, {
    //             localID: null,
    //             id: viewPoint.id,
    //             type: viewPoint.type,
    //             position: viewPoint.position,
    //             modified: false
    //         })
    //     }
    //     for (const toChangePoint of toChangePoints) {
    //         if (!toChangePoint.id) {
    //             continue;
    //         }
    //         combinedModificationPoints.set(toChangePoint.id, {
    //             localID: null,
    //             id: toChangePoint.id,
    //             type: toChangePoint.type,
    //             position: toChangePoint.position,
    //             modified: true
    //         })
    //     }
    //     for (const toAddPoint of toAddPoints) {
    //         if (!toAddPoint.localID) {
    //             continue;
    //         }
    //         combinedModificationPoints.set(toAddPoint.localID, {
    //             localID: toAddPoint.localID,
    //             id: null,
    //             type: toAddPoint.type,
    //             position: toAddPoint.position,
    //             modified: true
    //         })
    //     }
    //     for (const toDeletePoint of toDeletePoints) {
    //
    //     }
    // }, [viewPoints, toDeletePoints, toAddPoints, toChangePoints]);


    return (
        <>

            <Container>
                <Row>
                    <Col md={9}>
                        <>
                            <MapLegend/>
                            <Maps
                                mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
                                clickableIcons={false}
                                // className={"vh-100 vw-100 position-fixed"}
                                //className={"vh-100"}
                                style={{maxHeight: "90vh", height: "90vh"}}
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

                                {Array.from(memoPoints).map(([k, point]) => (

                                    <ModifiableAdvancedMarker key={k} point={point} draggingRef={draggingRef}
                                                              onChanged={onMarkerChanged}/>

                                ))}


                            </Maps>
                            {infoWindowPosition && (
                                <InfoWindow position={infoWindowPosition} maxWidth={200}
                                            onClose={() => setInfoWindowPosition(null)}
                                            onCloseClick={() => setInfoWindowPosition(null)}>
                                    <AddNewMarker position={infoWindowPosition} onAdd={onAdd}/>
                                </InfoWindow>

                            )}
                        </>
                    </Col>
                    <Col md={3}>
                        <Container className={"text-center mt-2"}>
                            <Button disabled={!memoModifications}
                                    variant={memoModifications ? "primary" : "outline-secondary"}>
                                {memoModifications ? "Salva modifiche" : "Non ci sono modifiche da salvare"}
                            </Button>
                        </Container>

                        <ListGroup className={"overflow-y-scroll mt-2"} style={{maxHeight: "85vh", height: "85vh"}}
                                   variant={"flush"}>
                            {Array.from(memoPoints).map(([k, point]) => (
                                <ListGroup.Item key={k + "rightsideList"} variant={
                                    point.deleted ? "danger" : (point.modified ? "warning" : "")
                                }>
                                    <Container>
                                        <Row>
                                            <Col>
                                                {point.deleted && "[DELETED] " }ID: {point.id != null ? point.id : "-nuovo-"}
                                            </Col>
                                        </Row>
                                        <Row className={"mt-1"}>
                                            <Col>
                                                {point.deleted ?
                                                    "" + point.type
                                                :
                                                    <Form.Select size={"sm"} value={point.type} onChange={
                                                        (e) => {
                                                            onMarkerChanged({
                                                                ...point,
                                                                type: e.target.value,
                                                                modified: true
                                                            })
                                                        }
                                                    }>
                                                        {trashTypesStr.map(typeStr => (
                                                            <option key={typeStr} value={typeStr}>{typeStr}</option>
                                                        ))}
                                                    </Form.Select>
                                                }
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
                                                {point.deleted ?
                                                    <Button size={"sm"} variant="primary"
                                                            onClick={() => {
                                                                onMarkerChanged({...point, modified: true, deleted: false})
                                                            }
                                                    }>
                                                        🔃 Riprendi
                                                    </Button>
                                                :
                                                    <>
                                                    <Button size={"sm"} variant="danger" onClick={
                                                        () => {
                                                            onMarkerChanged({...point, modified: true, deleted: true})
                                                        }
                                                    }>
                                                        ✖ Elimina
                                                    </Button>
                                                    {(point.id != null && point.modified) &&
                                                        <Button className={"ms-1"} size={"sm"} variant="primary" onClick={
                                                            () => {
                                                                onMarkerRestored(point)
                                                            }
                                                        }>
                                                            ↩️ Ripristina
                                                        </Button>
                                                    }
                                                    </>

                                                }

                                            </Col>
                                        </Row>
                                    </Container>
                                </ListGroup.Item>


                                // <p key={point.uuid + "test"}>{point.uuid}: <br/>{point.position.lat},<br/>{point.position.lng}<br/>,{point.type},{point.modified ? "modified" : "not modified"}
                                // </p>
                            ))}

                            {/*{toDeletePoints.map(deletedPoint => (*/}
                            {/*    <ListGroup.Item key={deletedPoint.id + "test"} variant={"danger"}>*/}
                            {/*        <Container>*/}
                            {/*            <Row>*/}
                            {/*                <Col>*/}
                            {/*                    [DELETED] ID: {deletedPoint.id}*/}
                            {/*                </Col>*/}
                            {/*            </Row>*/}
                            {/*            <Row className={"mt-1"}>*/}
                            {/*                <Col>*/}
                            {/*                    point.type*/}
                            {/*                </Col>*/}
                            {/*            </Row>*/}
                            {/*            <Row className={"mt-1"}>*/}
                            {/*                <Col>*/}
                            {/*                    Latitudine: {deletedPoint.position.lat.toFixed(6)}*/}
                            {/*                </Col>*/}
                            {/*            </Row>*/}
                            {/*            <Row className={"mt-1"}>*/}
                            {/*                <Col>*/}
                            {/*                    Longitudine: {deletedPoint.position.lng.toFixed(6)}*/}
                            {/*                </Col>*/}
                            {/*            </Row>*/}
                            {/*            <Row className={"mt-1"}>*/}
                            {/*                <Col className={"text-center"}>*/}
                            {/*                    <Button size={"sm"} variant="primary"*/}
                            {/*                            onClick={() => onMarkerRecalled(deletedPoint)}>*/}
                            {/*                        🔃 Riprendi*/}
                            {/*                    </Button>*/}
                            {/*                </Col>*/}
                            {/*            </Row>*/}
                            {/*        </Container>*/}
                            {/*    </ListGroup.Item>*/}


                            {/*    // <p key={point.uuid + "test"}>{point.uuid}: <br/>{point.position.lat},<br/>{point.position.lng}<br/>,{point.type},{point.modified ? "modified" : "not modified"}*/}
                            {/*    // </p>*/}
                            {/*))}*/}
                        </ListGroup>
                    </Col>
                </Row>

            </Container>


        </>
    )
}

export {MapPos};
