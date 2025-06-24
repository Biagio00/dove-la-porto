// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, NavLink, Route, Routes} from "react-router";
import {Container, Image, Nav, Navbar} from "react-bootstrap";
import {Home} from "./pages/Home.tsx";
import {MapPos} from "./pages/MapPos.tsx";
import {ViewMap} from "./pages/ViewMap.tsx";
import {Users} from "./pages/Users.tsx";
import {APIProvider} from "@vis.gl/react-google-maps";

function App() {

    return (
        <>
            <BrowserRouter>

                    <Navbar collapseOnSelect expand="sm" className="bg-body-tertiary" sticky="top">
                        <Container>
                            <Navbar.Brand as={NavLink} to="/"><Image width={40} height={40} src={"/dlp.svg"} alt={"logo"} /> Dove la porto?</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                                    <Nav.Link as={NavLink} to="/map">Mappa</Nav.Link>
                                    <Nav.Link as={NavLink} to="/positions">Posizioni</Nav.Link>
                                    <Nav.Link as={NavLink} to="/users">Utenti</Nav.Link>
                                </Nav>
                                <Nav>
                                    <Nav.Link as={NavLink} to="/">Logout</Nav.Link>
                                    <Nav.Link as={NavLink} to="/">Login</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>


                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>

                    <Routes>

                        <Route path="/" element={<Home/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/map" element={<ViewMap/>}/>
                        <Route path="/positions" element={<MapPos/>}/>
                        <Route path="/users" element={<Users/>}/>
                    </Routes>
                </APIProvider>


            </BrowserRouter>

            {/*<div>*/}
            {/*  <a href="https://vite.dev" target="_blank">*/}
            {/*    <img src={viteLogo} className="logo" alt="Vite logo" />*/}
            {/*  </a>*/}
            {/*  <a href="https://react.dev" target="_blank">*/}
            {/*    <img src={reactLogo} className="logo react" alt="React logo" />*/}
            {/*  </a>*/}
            {/*</div>*/}
            {/*<h1>Vite + React</h1>*/}
            {/*<div className="card">*/}
            {/*  <button onClick={() => setCount((count) => count + 1)}>*/}
            {/*    count is {count}*/}
            {/*  </button>*/}
            {/*  <p>*/}
            {/*    Edit <code>src/App.tsx</code> and save to test HMR*/}
            {/*  </p>*/}
            {/*</div>*/}
            {/*<p className="read-the-docs">*/}
            {/*  Click on the Vite and React logos to learn more*/}
            {/*</p>*/}
        </>
    )
}

export default App
