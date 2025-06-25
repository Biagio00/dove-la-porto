// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import {Home} from "./pages/Home.tsx";
import {MapPos} from "./pages/MapPos.tsx";
import {ViewMap} from "./pages/ViewMap.tsx";
import {Users} from "./pages/Users.tsx";
import {APIProvider} from "@vis.gl/react-google-maps";
import {UserDataProvider} from "./contexts/UserDataProvider.tsx";
import {Profile} from "./pages/Profile.tsx";
import {TopNavbar} from "./components/TopNavbar.tsx";

function App() {



    return (
        <UserDataProvider>
            <BrowserRouter>
                <TopNavbar/>

                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>

                    <Routes>

                        <Route path="/" element={<Home/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/map" element={<ViewMap/>}/>
                        <Route path="/positions" element={<MapPos/>}/>
                        <Route path="/users" element={<Users/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                    </Routes>
                </APIProvider>


            </BrowserRouter>

        </UserDataProvider>
    )
}

export default App
