import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import {type FormEvent, useState} from "react";
import {fireAuth} from "../utils/Firebase.ts";
import {Alert, Button, Card, Container, Form, Modal, Tab, Tabs} from "react-bootstrap";
import {useUserDataContext} from "../hooks/useUserDataContext.tsx";

export const LoginSignUpResetLogout = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const [loggingIn, setLogginIn] = useState(false);
    const [signingUp, setSigningUp] = useState(false);
    const [sendingResetMail, setSendingResetMail] = useState(false);
    const [loggingOut, setLogginOut] = useState(false);

    const userData = useUserDataContext();

    /* eslint-disable  @typescript-eslint/no-explicit-any */

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLogginIn(true);

        try {
            const userCredential = await signInWithEmailAndPassword(fireAuth, email, password);

            if (!userCredential.user.emailVerified) {
                setError("Per favore verifica la tua email prima di accedere.");
                await fireAuth.signOut();
                return;
            }

        } catch (err: any) {
            setError("Errore durante il login: " + err.message);
        } finally {
            setLogginIn(false);
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setSigningUp(true);

        if (password !== confirmPassword) {
            setError("Le password non corrispondono");
            setSigningUp(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(fireAuth, email, password);
            await sendEmailVerification(userCredential.user);

            setMessage("Ti abbiamo inviato una email di verifica. Per favore controlla la tua casella di posta.");
            setActiveTab("login");
        } catch (err: any) {
            setError("Errore durante la registrazione: " + err.message);
        } finally {
            setSigningUp(false);
        }
    };

    const handlePasswordReset = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setSendingResetMail(true);

        try {
            await sendPasswordResetEmail(fireAuth, resetEmail);
            setMessage("Ti abbiamo inviato una email per reimpostare la password.");
            setShowResetModal(false);
        } catch (err: any) {
            setError("Errore durante il reset della password: " + err.message);
        } finally {
            setSendingResetMail(false);
        }
    };

    const handleLogout = async () => {
        setLogginOut(true);

        try {
            await signOut(fireAuth);
            setMessage("Sei stato disconnesso.");
        } catch (err: any) {
            setError("Errore durante il logout: " + err.message);
        } finally {
            setLogginOut(false);
        }
    };


    return (
        <Container className={"p-0"}>
            <Card>
                <Card.Body>
                    {error && <Alert variant={"danger"}>{error}</Alert>}
                    {message && <Alert variant={"success"}>{message}</Alert>}


                    {userData.currentUser == null ? (
                    <Tabs className={"mb-3"} activeKey={activeTab}
                          onSelect={
                              (newValue) => {
                                  if (newValue != null) {
                                      setActiveTab(newValue)
                                  }
                              }
                          }>
                        <Tab eventKey={"login"} title={"Accedi"}>
                            <Form onSubmit={handleLogin}>
                                <Form.Group className={"mb-3"}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type={"email"} value={email} required={true}
                                                  onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className={"mb-3"}>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type={"password"} value={password} required={true}
                                                  onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button className={"w-100"} type={"submit"} disabled={loggingIn}>
                                    {loggingIn ? "Caricamento..." : "Accedi"}
                                </Button>
                            </Form>

                            <div className={"text-center mt-3"}>
                                <Button variant={"link"} onClick={() => setShowResetModal(true)}>
                                    Password dimenticata?
                                </Button>
                            </div>
                        </Tab>

                        <Tab eventKey={"register"} title={"Registrati"}>
                            <Form onSubmit={handleRegister}>
                                <Form.Group className={"mb-3"}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type={"email"} value={email} required={true}
                                                  onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className={"mb-3"}>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type={"password"} value={password} required={true}
                                                  onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className={"mb-3"}>
                                    <Form.Label>Conferma Password</Form.Label>
                                    <Form.Control type={"password"} value={confirmPassword} required={true}
                                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button className="w-100" type="submit" disabled={signingUp}>
                                    {signingUp ? "Caricamento..." : "Registrati"}
                                </Button>
                            </Form>
                        </Tab>
                    </Tabs>
                    ): (
                        <Container className={"text-center"}>
                        <Button variant={"link"} onClick={handleLogout} disabled={loggingOut}>
                            {loggingOut ? "Logout in corso..." : "Logout"}
                        </Button>
                        </Container>
                    )}
                </Card.Body>
            </Card>
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Reimposta Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePasswordReset}>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type={"email"} value={resetEmail} required={true}
                                          onChange={(e) => setResetEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Button className={"w-100"} type={"submit"} disabled={sendingResetMail}>
                            {sendingResetMail ? "Invio in corso..." : "Invia email di reset"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

