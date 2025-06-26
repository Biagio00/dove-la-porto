import type {ModificationPoint} from "../utils/Types.ts";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AdvancedMarker, InfoWindow, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import {type RefObject, useState} from "react";
import {trashTypesStr} from "../utils/Constants.ts";
import {TrashTypeImage} from "./TrashTypeImage.tsx";

export const ModifiableAdvancedMarker = (
    {point, draggingRef, onChanged, onRestored}: {
        point: ModificationPoint,
        draggingRef: RefObject<boolean>,
        onChanged: (modificationPoint: ModificationPoint) => void,
        onRestored: (modificationPoint: ModificationPoint) => void
    }) => {

    const [infowindowOpen, setInfowindowOpen] = useState<boolean>(false);
    const [advMarkerRef, advMarker] = useAdvancedMarkerRef();

    return (
        <>
            {!point.deleted &&
                <>
                    <AdvancedMarker position={point.position} ref={advMarkerRef}
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
                                                onChanged({...point, modified: true, deleted: true})
                                            }
                                        }>
                                            ✖ Elimina
                                        </Button>
                                        {(point.id != null && point.modified) &&
                                            <Button className={"mt-1"} size={"sm"} variant="primary" onClick={
                                                () => {
                                                    onRestored(point)
                                                }
                                            }>
                                                ↩️ Ripristina
                                            </Button>
                                        }
                                    </Col>
                                </Row>
                                <Row className={"mt-1"}>
                                    <Col>
                                        ID: {point.id != null ? point.id : "-nuovo-"}
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
            }
        </>
    )
}

