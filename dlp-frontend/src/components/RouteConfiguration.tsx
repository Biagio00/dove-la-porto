import {useUserDataContext} from "../hooks/useUserDataContext.tsx";
import {Route, Routes} from "react-router";
import {Home} from "../pages/Home.tsx";
import {ViewMap} from "../pages/ViewMap.tsx";
import {MapPos} from "../pages/MapPos.tsx";
import {Users} from "../pages/Users.tsx";
import {Profile} from "../pages/Profile.tsx";
import {NotFound} from "../pages/NotFound.tsx";

export const RouteConfiguration = () => {
    const userData = useUserDataContext()
    return (
        <Routes>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/map" element={<ViewMap/>}/>
            {userData.role >= 2 &&
                <Route path="/positions" element={<MapPos/>}/>
            }
            {userData.role >= 5 &&
                <Route path="/users" element={<Users/>}/>
            }
            <Route path="/profile" element={<Profile/>}/>
        </Routes>
    )
}
