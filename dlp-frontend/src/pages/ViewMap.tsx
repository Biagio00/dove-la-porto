import {useState} from "react";
import type {ViewPoint} from "../Types.ts";
import {Map} from "@vis.gl/react-google-maps";
import {v4 as uuidv4} from "uuid";
import {MapLegend} from "../components/MapLegend.tsx";
import {ViewAdvancedMarker} from "../components/ViewAdvancedMarker.tsx";

const ViewMap = () => {
    const [points, setPoints] = useState<ViewPoint[]>([
        //test data
        {uuid: uuidv4(), position: {lat: 43.166221, lng: 10.567741}, type: "solo-vetro"},
        {uuid: uuidv4(), position: {lat: 43.167438, lng: 10.579719}, type: "discarica"},
        {uuid: uuidv4(), position: {lat: 43.170405, lng: 10.574837}, type: "completa"}
    ]);

    return (<>
        <MapLegend/>
        <Map
            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
            clickableIcons={false}
            className={"vh-100 vw-100 position-fixed"}
            //className={"vh-100"}
            style={{maxHeight: "90vh", height: "90vh"}}
            defaultCenter={{lat: 43.1710196, lng: 10.569224}}
            defaultZoom={14}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
        >

            {points.map(point => (

                <ViewAdvancedMarker key={point.uuid} point={point}/>


            ))}

        </Map>

    </>)
}

export {ViewMap};
