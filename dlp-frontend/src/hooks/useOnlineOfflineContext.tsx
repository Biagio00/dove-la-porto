import {useContext} from "react";
import type {OnlineOffline} from "../utils/Types.ts";
import {OnlineOfflineContext} from "../contexts/OnlineOfflineContext.tsx";

export const useOnlineOfflineContext = () => useContext<OnlineOffline>(OnlineOfflineContext);
