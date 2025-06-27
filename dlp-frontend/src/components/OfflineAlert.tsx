import {useOnlineOfflineContext} from "../hooks/useOnlineOfflineContext.tsx";
import {Alert, Col, Container, Row} from "react-bootstrap";


export const OfflineAlert = () => {
    const {online} = useOnlineOfflineContext();

    return (
        <>
            {!online &&
                <Container className="position-fixed z-3 bottom-0 w-100 mw-100">
                    <Row className={"justify-content-center"}>
                        <Col md={"auto"}>
                            <Alert variant="danger" className="text-center">
                                Sei offline: i dati potrebbero essere obsoleti e alcune funzionalità non sono
                                disponibili.
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            }
        </>
    );
};
