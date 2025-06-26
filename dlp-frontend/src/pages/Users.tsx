import {Alert, Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import {useFetchUsersInfo} from "../hooks/useFetchUsersInfo.tsx";
import {UserConfiguration} from "../components/UserConfiguration.tsx";
import {type ChangeEvent, useState} from "react";
import {doApiFetchPostJson} from "../utils/DoFetch.ts";
import {useUserDataContext} from "../hooks/useUserDataContext.tsx";

const Users = () => {
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const [newUserRole, setNewUserRole] = useState<string>("");
    const [toAddRole, setToAddRole] = useState<boolean>(false);
    const [newUserUID, setNewUserUID] = useState<string>("");
    const [toAddUid, setToAddUid] = useState<boolean>(false);
    const [triggerUpdate, setTriggerUpdate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const {usersInfo} = useFetchUsersInfo({triggerUpdate});

    const userData = useUserDataContext();

    const executeUpdate = () => {
        setTriggerUpdate(!triggerUpdate)
    }

    const handleNewUserRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.value == null) {
            return;
        }
        setNewUserRole(e.target.value);
        const newRoleValue = parseInt(e.target.value);
        if (newRoleValue < 0 || newRoleValue > 5 || isNaN(newRoleValue)) {
            setToAddRole(false);
            return;
        }
        setToAddRole(true);
    }

    const handleNewUserUidChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.value == null || e.target.value.length < 1) {
            return;
        }
        setNewUserUID(e.target.value);
        setToAddUid(true);
    }

    const handleAddNewClick = async () => {
        setLoading(true)
        setError(null)
        setMessage(null)
        const {data, error} = await doApiFetchPostJson("/api/userSet", userData.currentUser, {uid: newUserUID, role: newUserRole})
        if (error) {
            setError(error)
        }
        if (data) {
            setMessage(data)
            setNewUserUID("")
            setNewUserRole("")
            setToAddUid(false)
            setToAddRole(false)
            executeUpdate()
        }
        setLoading(false)
    }

    return (
        <Container className={"mt-5 justify-content-center"}>
            <Row className={"mb-3"}>
                <Col sm={12} className={"text-center"}>
                    <h1>Configurazione Utenti</h1>
                </Col>
            </Row>
            <Row className={"mb-2"}>
                <Col sm={12} className={"text-center"}>
                    <h5>Immetti valori da 0 a 5: <br/>
                        0=utente, 2=operatore, 5=amministratore</h5>
                </Col>
            </Row>
            {error && <Row>
                <Alert variant={"danger"}>{error}</Alert>
            </Row>}
            {message && <Row>
                <Alert variant={"success"}>{message}</Alert>
            </Row>}
            {(!message && !error) && <Row>
                <Alert variant={"info"}>Configura qui i ruoli degli utenti</Alert>
            </Row>}
            <Row className={"mb-2"}>
                <Table bordered>
                    <tbody>
            {usersInfo && usersInfo.map((userInfo) => (
                <UserConfiguration key={userInfo.userID} userInfo={userInfo}
                                   setError={setError} setMessage={setMessage}
                                   executeUpdate={executeUpdate}/>
            ))}
                    </tbody>
                </Table>
            </Row>

            <Container className={"border rounded pt-1 pb-1 mt-2"}>

                <Row className={"justify-content-center mt-2"}>
                    <Col md={"auto"} className={"align-content-center"}><h5>Aggiungi nuovo utente</h5></Col>
                </Row>
                <Row className={"justify-content-center"}>
                    <Col md={"auto"} className={"align-content-center"}>UID: </Col>
                    <Col md={"auto"}>
                        <Form.Control type={"input"} value={newUserUID} onChange={handleNewUserUidChange}></Form.Control>
                    </Col>
                    <Col md={"auto"} className={"pe-0 text-rigth align-content-center"}>Ruolo: </Col>
                    <Col md={"auto"}>
                        <Form.Control type={"input"} value={newUserRole} onChange={handleNewUserRoleChange}></Form.Control>
                    </Col>
                    <Col md={"auto"}>
                        <Button variant={(toAddRole&&toAddUid) ? "primary" : "outline-primary"}
                                disabled={!(toAddRole&&toAddUid) || loading}
                                onClick={handleAddNewClick}>
                            Aggiungi
                        </Button>
                    </Col>
                </Row>



            </Container>
        </Container>
    )
}

export {Users};
