import {Col, Container, Image, Row} from "react-bootstrap";

export const NotFound = () => {
    return (
        <Container className={"mt-5 text-center"}>
            <Row>
                <Col>
                    <Image src={"/dlp.svg"} alt={"logo"}/>
                </Col>
            </Row>
            <Row>
                <Col className={"mt-3"}>
                    <h1>404: Pagina non trovata</h1>
                </Col>
            </Row>
        </Container>
    )
}
