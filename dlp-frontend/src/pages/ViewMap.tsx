import {Map} from "@vis.gl/react-google-maps";
import {MapLegend} from "../components/MapLegend.tsx";
import {ViewAdvancedMarker} from "../components/ViewAdvancedMarker.tsx";
import {useFetchViewPoints} from "../hooks/useFetchViewPoints.tsx";
import {useEffect} from "react";
import {requestNotificationPermission} from "../utils/NotificationManager.ts";

const ViewMap = () => {
    const {viewPoints} = useFetchViewPoints({intervalTime: 3000, doSendNotification: true, triggerUpdate: false})

    useEffect(() => {
        requestNotificationPermission();
    }, []);


    return (<>
        <MapLegend/>
        <Map
            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
            clickableIcons={false}
            className={"vh-100 vw-100 position-fixed"}
            style={{maxHeight: "90vh", height: "90vh"}}
            defaultCenter={{lat: 43.1710196, lng: 10.569224}}
            defaultZoom={14}
            gestureHandling={'greedy'}
            disableDefaultUI={true}>

            {viewPoints.map(point => (
                <ViewAdvancedMarker key={point.id} point={point}/>
            ))}

        </Map>

    </>)
}

export {ViewMap};
