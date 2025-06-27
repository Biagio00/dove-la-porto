import {AdvancedMarker, InfoWindow, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import {TrashTypeImage} from "./TrashTypeImage.tsx";
import {Button, Col, Container, Row} from "react-bootstrap";
import type {ViewPoint} from "../utils/Types.ts";
import {useState} from "react";

export const ViewAdvancedMarker = ({point}: { point: ViewPoint }) => {
    const [infowindowOpen, setInfowindowOpen] = useState<boolean>(false);
    const [advMarkerRef, advMarker] = useAdvancedMarkerRef();

    return (
        <>
            <AdvancedMarker position={point.position} ref={advMarkerRef}
                            clickable={true} onClick={() => setInfowindowOpen(true)}>
                <TrashTypeImage size={"40px"} fontSize={"x-large"} type={point.type}/>
            </AdvancedMarker>
            {infowindowOpen && (
                <InfoWindow anchor={advMarker} maxWidth={200}
                            onCloseClick={() => setInfowindowOpen(false)}
                            onClose={() => setInfowindowOpen(false)}>

                    <Container>
                        <Row className={"mt-1"}>
                            <Col className={"text-center"}>
                                <Button variant={"primary"}
                                        href={"geo:" + point.position.lat + "," + point.position.lng}>
                                    Viaggia qui 🚗<br/>(solo android)
                                </Button>
                            </Col>
                        </Row>
                        <Row className={"mt-1"}>
                            <Col className={"text-center"}>
                                <Button variant={"secondary"} target={"_blank"}
                                        href={"https://www.google.com/maps/search/?api=1&query=" + point.position.lat + "," + point.position.lng}>
                                    Apri su<br/>Google Maps 🗺️
                                </Button>
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
                                Tipo: {point.type}
                            </Col>
                        </Row>
                    </Container>

                </InfoWindow>
            )}
        </>
    )
}
