import type {UserInfo} from "../utils/Types.ts";
import {Button, Form} from "react-bootstrap";
import {type ChangeEvent, useEffect, useState} from "react";
import {doApiFetchPostJson} from "../utils/DoFetch.ts";
import {useUserDataContext} from "../hooks/useUserDataContext.tsx";

export const UserConfiguration = (
    {userInfo, setError, setMessage, executeUpdate}:
    {
        userInfo: UserInfo,
        setError: (error: string | null) => void,
        setMessage: (message: string | null) => void,
        executeUpdate: () => void
    }
) => {

    const [newRole, setNewRole] = useState<string>(""+userInfo.role);
    const [toSave, setToSave] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const userData = useUserDataContext();

    useEffect(() => {
        setNewRole(""+userInfo.role)
    }, [userInfo]);

    const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.value == null) {
            return;
        }
        setNewRole(e.target.value);
        const newRoleValue = parseInt(e.target.value);
        if (newRoleValue < 0 || newRoleValue > 5 || isNaN(newRoleValue)) {
            setToSave(false);
            return;
        }
        if (newRoleValue !== userInfo.role) {
            setToSave(true);
            return;
        } else {
            setToSave(false);
            return;
        }
    }

    const handleSaveClick = async () => {
        setLoading(true)
        setError(null)
        setMessage(null)
        const {data, error} = await doApiFetchPostJson("/api/userSet", userData.currentUser, {uid: userInfo.userID, role: newRole})
        if (error) {
            setError(error)
        }
        if (data) {
            setMessage(data)
            setToSave(false)
        }
        setLoading(false)
    }

    const handleDeleteClick = async () => {
        setError(null)
        setMessage(null)
        const {data, error} = await doApiFetchPostJson("/api/userDelete", userData.currentUser, {uid: userInfo.userID})
        if (error) {
            setError(error)
        }
        if (data) {
            setMessage(data)
            executeUpdate()
        }
    }

    return (
        // <Container className={"border rounded pt-1 pb-1  mt-1"}>

            <tr className={"justify-content-center"}>
                <td className={"align-content-center text-wrap"} style={{maxWidth: "10vw", overflow: "hidden"}}>
                    UID: {userInfo.userID}
                </td>
                <td className={"align-content-center"}>Ruolo: </td>
                <td>
                    <Form.Control style={{minWidth: 50, maxWidth: 50}} type={"input"} value={newRole} onChange={handleRoleChange}></Form.Control>
                </td>
                <td>
                    <Button variant={toSave ? "primary" : "outline-primary"} disabled={!toSave || loading}
                            onClick={handleSaveClick}>
                        Salva
                    </Button>
                </td>
                <td>
                    <Button variant={"danger"} onClick={handleDeleteClick} disabled={loading}>
                        Cancella
                    </Button>
                </td>
            </tr>

        // </Container>
    )
}
