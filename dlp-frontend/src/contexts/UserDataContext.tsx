import {createContext} from "react";
import type {UserData} from "../utils/Types.ts";

export const UserDataContext = createContext<UserData>({
    currentUser: null,
    loading: false,
    // error: null,
    role: 0
});

