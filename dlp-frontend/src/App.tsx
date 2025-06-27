import './App.css'
import {BrowserRouter} from "react-router";
import {APIProvider} from "@vis.gl/react-google-maps";
import {UserDataProvider} from "./contexts/UserDataProvider.tsx";
import {TopNavbar} from "./components/TopNavbar.tsx";
import {RouteConfiguration} from "./components/RouteConfiguration.tsx";
import {OnlineOfflineProvider} from "./contexts/OnlineOfflineProvider.tsx";
import {OfflineAlert} from "./components/OfflineAlert.tsx";

function App() {


    return (
        <UserDataProvider>
            <OnlineOfflineProvider>
                <BrowserRouter>
                    <OfflineAlert/>
                    <TopNavbar/>
                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                        <RouteConfiguration/>
                    </APIProvider>
                </BrowserRouter>
            </OnlineOfflineProvider>
        </UserDataProvider>
    )
}

export default App
