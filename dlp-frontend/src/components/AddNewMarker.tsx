import {trashTypesStr} from "../Constants.ts";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import type {ModificationPoint} from "../Types.ts";
import {useState} from "react";
import {v4 as uuidv4} from 'uuid';


export const AddNewMarker = (
    {position, onAdd}: {
        position: google.maps.LatLngLiteral,
        onAdd: (mp: ModificationPoint) => void
    }) => {

    const [type, setType] = useState<string>(trashTypesStr[0])

    const onAddClick = () => {
        const mp: ModificationPoint = {
            position: position,
            type: type,
            modified: true,
            uuid: uuidv4()
        }
        onAdd(mp)
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form.Select size={"sm"} value={type} onChange={(e) => {
                        setType(e.target.value)
                    }}>
                        {trashTypesStr.map(typeStr => (
                            <option key={typeStr} value={typeStr}>{typeStr}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row className={"mt-1 text-center"}>
                <Col>
                    <Button variant={"primary"} onClick={onAddClick}>Aggiungi</Button>
                </Col>
            </Row>
        </Container>
    )

}
