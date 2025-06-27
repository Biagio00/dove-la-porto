import {InfoWindow, Map as Maps} from "@vis.gl/react-google-maps";
import {Col, Container, Row, Button, ListGroup, Form, Alert, Modal} from "react-bootstrap";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {ModificationPoint, ServerModificationPoint} from "../utils/Types.ts";
import {ModifiableAdvancedMarker} from "../components/ModifiableAdvancedMarker.tsx";
import {MapLegend} from "../components/MapLegend.tsx";
import {AddNewMarker} from "../components/AddNewMarker.tsx";
import {trashTypesStr} from "../utils/Constants.ts";
import {useFetchViewPoints} from "../hooks/useFetchViewPoints.tsx";
import {doApiFetchPostJson} from "../utils/DoFetch.ts";
import {useUserDataContext} from "../hooks/useUserDataContext.tsx";
import {useOnlineOfflineContext} from "../hooks/useOnlineOfflineContext.tsx";

const MapPos = () => {

    const [toChangePoints, setToChangePoints] = useState<ModificationPoint[]>([]);

    const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [triggerViewPointsUpdate, setTriggerViewPointsUpdate] = useState(false);
    const clearModifications = useRef<boolean>(false);
    const {viewPoints} = useFetchViewPoints({
        intervalTime: 3000,
        doSendNotification: false,
        triggerUpdate: triggerViewPointsUpdate
    });

    const {online} = useOnlineOfflineContext()

    useEffect(() => {
        if (clearModifications.current) {
            setToChangePoints([])
            clearModifications.current = false
        }
    }, [viewPoints, setToChangePoints]);

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
                if (p.id != null && updatedPoint.id != null && p.id === updatedPoint.id) {
                    found = true;
                    return updatedPoint;
                } else if (p.localID != null && updatedPoint.localID != null && p.localID === updatedPoint.localID) {
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
                if (p.id != null && restoredPoint.id != null && p.id === restoredPoint.id) {
                    return false;
                } else {
                    return true;
                }
            })
            return newPoints;
        })
    }, [setToChangePoints])

    const userData = useUserDataContext();

    const saveModifications = useCallback(async () => {
        setMessage(null)
        setError(null)
        const toSendPoints: ServerModificationPoint[] = toChangePoints.filter(
            (p) => {
                if (p.id == null && p.localID != null && p.deleted) {
                    return false;
                } else {
                    return true;
                }
            }).map((mp) => {
            return {
                deleted: mp.deleted,
                id: mp.id,
                position: {
                    lat: mp.position.lat,
                    lng: mp.position.lng
                },
                type: mp.type
            }
        })
        if (toSendPoints.length === 0) {
            setMessage("Nessuna modifica da salvare")
            return;
        }
        const {data, error} = await doApiFetchPostJson("/api/positionsSet", userData.currentUser, {
            points: toSendPoints
        })
        if (error) {
            setError(error)
            return
        }
        if (data) {
            setMessage(data)
            clearModifications.current = true
            setTriggerViewPointsUpdate(!triggerViewPointsUpdate)
        }
    }, [toChangePoints, triggerViewPointsUpdate, userData.currentUser])

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


    return (
        <>

            <Container>
                <Row>
                    <Col md={9}>
                        {online ?
                            <>
                                <MapLegend/>
                                <Maps
                                    mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
                                    clickableIcons={false}
                                    style={{maxHeight: "90vh", height: "90vh"}}
                                    defaultCenter={{lat: 43.1710196, lng: 10.569224}}
                                    defaultZoom={14}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}

                                    onClick={(e) => {
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
                                                                  onChanged={onMarkerChanged}
                                                                  onRestored={onMarkerRestored}/>
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
                            :
                            <h2 style={{maxHeight: "90vh", height: "90vh"}} className={"text-center mt-5"}>
                                Sei offline. Mappa non disponibile.
                            </h2>
                        }

                    </Col>
                    <Col md={3}>
                        <Container className={"text-center mt-2"}>
                            <Button disabled={!memoModifications || !online}
                                    variant={memoModifications ? "primary" : "outline-secondary"}
                                    onClick={saveModifications}>
                                {memoModifications ? "Salva modifiche" : "Non ci sono modifiche da salvare"}
                            </Button>
                        </Container>
                        <Container className={"text-center mt-2 me-4"}>
                            {error && <Row>
                                <Alert variant={"danger"} className={"p-1"}>{error}</Alert>
                            </Row>}
                            {message && <Row>
                                <Alert variant={"success"} className={"p-1"}>{message}</Alert>
                            </Row>}
                            {(!message && !error) && <Row>
                                <Alert variant={"info"} className={"p-0"}>
                                    <Button variant={"link"} onClick={() => setShowInfoModal(true)}>
                                        Più info
                                    </Button>
                                </Alert>
                            </Row>}
                        </Container>

                        <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
                            <Modal.Header closeButton={true}>
                                <Modal.Title>Modificare le posizioni</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                In questa sezione puoi modificare le posizioni di tutte le posizioni presenti nella
                                mappa. Puoi anche crearne di nuove o eliminarle.<br/>
                                <ul>
                                    <li>Per creare una nuova posizione clicca sulla mappa e premi Aggiungi.</li>

                                    <li>Per modificare il tipo o eliminare una postazione è possibile cliccare
                                        direttamente sul
                                        punto oppure si può agire dalla lista sulla destra.
                                    </li>
                                    <li>Per modificare la posizione di un punto basta trascinarlo sulla mappa.</li>
                                    <li>Se si è modificato un punto per errore è possibile ripristinarlo facendo clic
                                        sul
                                        pulsante Ripristina (tale funzione è disponibile anche nel menu che compare
                                        cliccando
                                        sul punto.
                                    </li>
                                    <li>Infine se si elimina un punto per errore lo si può riprendere dal menù a destra
                                        premendo Riprendi.
                                    </li>
                                </ul>
                            </Modal.Body>
                        </Modal>

                        <ListGroup className={"overflow-y-scroll overflow-x-hidden mt-2"}
                                   style={{maxHeight: "68vh", height: "68vh"}}
                                   variant={"flush"}>
                            {Array.from(memoPoints).map(([k, point]) => (
                                <ListGroup.Item key={k + "rightsideList"} variant={
                                    point.deleted ? "danger" : (point.modified ? "warning" : "")
                                }>
                                    <Container>
                                        <Row>
                                            <Col>
                                                {point.deleted && "[DELETED] "}ID: {point.id != null ? point.id : "-nuovo-"}
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
                                                                onMarkerChanged({
                                                                    ...point,
                                                                    modified: true,
                                                                    deleted: false
                                                                })
                                                            }
                                                            }>
                                                        🔃 Riprendi
                                                    </Button>
                                                    :
                                                    <>
                                                        <Button size={"sm"} variant="danger" onClick={
                                                            () => {
                                                                onMarkerChanged({
                                                                    ...point,
                                                                    modified: true,
                                                                    deleted: true
                                                                })
                                                            }
                                                        }>
                                                            ✖ Elimina
                                                        </Button>
                                                        {(point.id != null && point.modified) &&
                                                            <Button className={"ms-1"} size={"sm"} variant="primary"
                                                                    onClick={
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

                            ))}

                        </ListGroup>
                    </Col>
                </Row>

            </Container>


        </>
    )
}

export {MapPos};
