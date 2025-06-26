import {Col, Container, Image, Row} from "react-bootstrap";
import {useUserDataContext} from "../hooks/useUserDataContext.tsx";
import {LoginSignUpResetLogout} from "../components/LoginSignUpResetLogout.tsx";
import {roleNameFromNum} from "../utils/Constants.ts";

export const Profile = () => {

    const userData = useUserDataContext();

    return (
        <Container>
            <Row className={"mt-5 justify-content-center"}>
                <Col md={4} className={"text-center"}>
                    <Image src={"/dlp.svg"} alt={"logo"} />
                </Col>
            </Row>
            <Row className={"mt-2 justify-content-center"}>
                <Col md={4} className={"text-center"}>
                    <h1>Dove la porto?</h1>
                </Col>
            </Row>


            {userData.currentUser != null && (
                <Row className={"mt-2 justify-content-center"}>
                    <Col md={6} className={"mt-5 text-center h5"}>
                        Hai fatto l'accesso come <b>{userData.currentUser.email}</b><br/>
                        Il tuo ruolo attuale è <b>{roleNameFromNum(userData.role)}</b><br/>
                        Per cambiare il tuo ruolo, comunica il seguente ID all'amministratore:<br/>
                        <b>{userData.currentUser.uid}</b>
                    </Col>
                </Row>
            )}

            <Row className={"mt-2 justify-content-center"}>
                <Col md={4}>
                    <LoginSignUpResetLogout/>
                </Col>
            </Row>

        </Container>
    );
}
