import {createContext} from "react";
import type {OnlineOffline} from "../utils/Types.ts";

export const OnlineOfflineContext = createContext<OnlineOffline>({ online: true });



