import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router";

const Home = () => {
    return (
        <>
            <Container className={"mt-5"}></Container>
        <Container className={"mt-5"}>
            <Row>
                <Col>
                    <h1>Dove la porto?</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    È l'applicazione che ti consente di trovare velocemente le postazioni dei cassonetti nella tua zona.
                </Col>
            </Row>
            <Row>
                <Col>
                    Non perdere altro tempo e consulta subito la <Link to={"/map"}>mappa</Link>!
                </Col>
            </Row>
        </Container>
        </>
    )
}

export {Home};