import {type ReactNode, useEffect, useState} from "react";
import { OnlineOfflineContext } from "./OnlineOfflineContext";

export const OnlineOfflineProvider = ({children}: { children: ReactNode }) => {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const onlineEventHandler = () => {
            setOnline(true);
        }
        window.addEventListener('online', onlineEventHandler);


        const offlineEventHandler = () => {
            setOnline(false);
        }
        window.addEventListener('offline', offlineEventHandler);

        return () => {
            window.removeEventListener('online', onlineEventHandler);
            window.removeEventListener('offline', offlineEventHandler);
        };
    }, []);

    return (
        <OnlineOfflineContext.Provider value={{ online }}>
            {children}
        </OnlineOfflineContext.Provider>
    );
};

