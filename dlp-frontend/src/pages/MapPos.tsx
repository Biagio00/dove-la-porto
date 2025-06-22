import {AdvancedMarker, ControlPosition, Map, MapControl} from "@vis.gl/react-google-maps";
import {Col, Container, Row, Image} from "react-bootstrap";
import {useState} from "react";
import type {Point} from "../Types.ts";
import {useDrawingManager} from "../hooks/useDrawingManager.tsx";

const MapPos = () => {
    const [points, setPoints] = useState<Point[]>([
        //test data
        {id:"1", position: {lat: 43.166221, lng: 10.567741}, type: "glass-only"},
        {id:"2", position: {lat: 43.167438, lng: 10.579719}, type: "station"},
        {id:"3", position: {lat: 43.170405, lng: 10.574837}, type: "all"}
    ]);

    const drawingManager = useDrawingManager();

    return (
        <>

            <Map
                mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
                className={"vh-100 vw-100 position-fixed z-n1"}
                defaultCenter={{lat: 43.1710196, lng: 10.569224}}
                defaultZoom={14}
                gestureHandling={'greedy'}
                disableDefaultUI={true}>

                {points.map(point => (
                    <AdvancedMarker key={point.id} position={point.position} clickable={true} draggable={true} >
                        <Image width={"40px"} height={"40px"} style={{fontSize: "xx-large"}} src={"/types/" + point.type + ".svg"} alt={"🗑️"} />
                    </AdvancedMarker>
                ))}

                {/*<MapControl position={ControlPosition.TOP_CENTER}>*/}
                {/*    {drawingManager}*/}
                {/*</MapControl>*/}

            </Map>
            <Container className="pe-none position-absolute mt-2">
                testtESTETSJOIJOIJOIJ
                {/*<Row className="pe-none" >*/}
                {/*    <Col className={"bg-danger pe-none"} md={"auto"}>*/}
                {/*        Legenda*/}
                {/*    </Col>*/}

                {/*    <Col> </Col>*/}
                {/*</Row>*/}
            </Container>
        </>
    )
}

export {MapPos};
