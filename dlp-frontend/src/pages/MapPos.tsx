import {Map} from "@vis.gl/react-google-maps";
import {Col, Container, Row} from "react-bootstrap";

const MapPos = () => {
    return (
        <>
                    <Map
                        className={"vh-100 vw-100 position-fixed z-n1"}
                        defaultCenter={{lat: 43.1710196, lng: 10.569224}}
                        defaultZoom={14}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                    />
            <Container>
                <Row>
                    <Col className={"bg-info me-auto"}>
                        Legenda
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col className={"bg-info me-auto"}>
                        Legenda
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col className={"bg-info me-auto"}>
                        Legenda
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </>
    )
}

export {MapPos};
