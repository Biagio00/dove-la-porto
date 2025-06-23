import {Col, Container, Row, Table} from "react-bootstrap";
import {trashTypesStr} from "../Constants.ts";
import {TrashTypeImage} from "./TrashTypeImage.tsx";

export const MapLegend = () => {
    return (
        <Container className="pe-none position-absolute mt-2 z-1">
            <Row>
                <Col sm={2}>
            <Table bordered hover size="sm" style={{opacity: .85}}>
                <tbody>
                {trashTypesStr.map(typeStr => (
                    <tr key={typeStr}>
                        <td>
                            <TrashTypeImage size={"30px"} fontSize={"large"} type={typeStr}/>
                        </td>
                        <td>
                            {""+typeStr}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
                </Col>
            </Row>
        </Container>
    )
}
