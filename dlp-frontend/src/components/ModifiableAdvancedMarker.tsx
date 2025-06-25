import type {ModificationPoint} from "../utils/Types.ts";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AdvancedMarker, InfoWindow, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import {type RefObject, useState} from "react";
import {trashTypesStr} from "../utils/Constants.ts";
import {TrashTypeImage} from "./TrashTypeImage.tsx";

export const ModifiableAdvancedMarker = (
    {point, draggingRef, onChanged, onDeleted}: {
        point: ModificationPoint,
        draggingRef: RefObject<boolean>,
        onChanged: (modificationPoint: ModificationPoint) => void,
        onDeleted: (modificationPoint: ModificationPoint) => void
    }) => {

    const [infowindowOpen, setInfowindowOpen] = useState<boolean>(false);
    const [advMarkerRef, advMarker] = useAdvancedMarkerRef();

    // <AdvancedMarker key={point.uuid} position={point.position} clickable={true}
    //                 draggable={true} onDragEnd={(e) => {
    //     console.log(e)
    //     if (e.latLng == null) {
    //         return
    //     }
    //     //update data
    //     const newPoints = points.map((p) => {
    //         if (p.uuid === point.uuid && e.latLng) {
    //             const latLngLit = {
    //                 lat: e.latLng.lat(),
    //                 lng: e.latLng.lng()
    //             }
    //             return {...point, position: latLngLit, modified: true}
    //         } else {
    //             return p;
    //         }
    //     })
    //
    //     setPoints(newPoints)
    //
    // }}>
    //     <Image width={"40px"} height={"40px"} style={{fontSize: "xx-large"}}
    //            src={"/types/" + point.type + ".svg"} alt={"🗑️"}/>
    //
    // </AdvancedMarker>

    return (
        <>
            <AdvancedMarker key={point.uuid} position={point.position} ref={advMarkerRef}
                            clickable={true} onClick={() => setInfowindowOpen(true)}
                            draggable={true}
                            onDragStart={() => {
                // console.log(e)
                draggingRef.current = true;
            }}
                            onDragEnd={(e) => {
                if (e.latLng == null) {
                    return
                }
                const latLngLit = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                }
                //update data
                onChanged({...point, position: latLngLit, modified: true})
            }}>
                <TrashTypeImage size={"40px"} fontSize={"xx-large"} type={point.type}/>
            </AdvancedMarker>
            {infowindowOpen && (
                <InfoWindow anchor={advMarker} maxWidth={200}
                            onCloseClick={() => setInfowindowOpen(false)}
                            onClose={() => setInfowindowOpen(false)}>

                    <Container>
                        <Row>
                            <Col className={"text-center"}>
                                <Button size={"sm"} variant="danger" onClick={
                                    () => {
                                        onDeleted({...point, modified: true})
                                    }
                                }>
                                    ✖ Elimina
                                </Button>
                            </Col>
                        </Row>
                        <Row className={"mt-1"}>
                            <Col>
                                ID: {point.uuid}
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
                            <Col>
                                <Form.Select size={"sm"} value={point.type} onChange={
                                    (e) => {
                                        onChanged({...point, type: e.target.value, modified: true})
                                    }
                                }>
                                    {trashTypesStr.map(typeStr => (
                                        <option key={typeStr} value={typeStr}>{typeStr}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Container>

                </InfoWindow>
            )}
        </>
    )
}

