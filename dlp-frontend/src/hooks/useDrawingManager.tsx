/**
 * Ho preso spunto da https://github.com/visgl/react-google-maps/blob/main/examples/drawing/src/
 */
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {type RefObject, useEffect, useState} from 'react';
import type {DrawResult} from "../utils/Types.ts";

export function useDrawingManager(
    initialValue: google.maps.drawing.DrawingManager | null = null
) {
    const map = useMap();
    const drawing = useMapsLibrary('drawing');

    const [drawingManager, setDrawingManager] =
        useState<google.maps.drawing.DrawingManager | null>(initialValue);

    useEffect(() => {
        if (!map || !drawing) return;

        // https://developers.google.com/maps/documentation/javascript/reference/drawing
        const newDrawingManager = new drawing.DrawingManager({
            map,
            //drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.MARKER
                ]
            },
            markerOptions: {
                draggable: true,
                clickable: true
            }
        });

        setDrawingManager(newDrawingManager);

        return () => {
            newDrawingManager.setMap(null);
        };
    }, [drawing, map]);

    return drawingManager;
}

// Handle drawing manager events
export function useDrawingManagerEvents(
    drawingManager: google.maps.drawing.DrawingManager | null,
    overlaysShouldUpdateRef: RefObject<boolean>
    // ,    dispatch: Dispatch<Action>
) {
    useEffect(() => {
        if (!drawingManager) return;

        const eventListeners: Array<google.maps.MapsEventListener> = [];

        drawingManager.getMap()

        // const addUpdateListener = (eventName: string, drawResult: DrawResult) => {
        //     const updateListener = google.maps.event.addListener(
        //         drawResult.overlay,
        //         eventName,
        //         () => {
        //             if (eventName === 'dragstart') {
        //                 overlaysShouldUpdateRef.current = false;
        //             }
        //
        //             if (eventName === 'dragend') {
        //                 overlaysShouldUpdateRef.current = true;
        //             }
        //
        //             if (overlaysShouldUpdateRef.current) {
        //                 dispatch({type: DrawingActionKind.UPDATE_OVERLAYS});
        //             }
        //         }
        //     );
        //
        //     eventListeners.push(updateListener);
        // };

        const overlayCompleteListener = google.maps.event.addListener(
            drawingManager,
            'overlaycomplete',
            (drawResult: DrawResult) => {
                if (drawResult.type == google.maps.drawing.OverlayType.MARKER) {
                    // quando viene creato un nuovo overlay, se è un marker si vuole intercettare quando viene spostato
                    //   se non è un marker non facciamo niente (in questo caso consentiamo di disegnare solamente marker)
                    const updateListener = google.maps.event.addListener(
                        drawResult.overlay,
                        "dragend",
                        () => {
                            // overlaysShouldUpdateRef.current = true;
                            //
                            // if (overlaysShouldUpdateRef.current) {
                            const marker = drawResult.overlay as google.maps.marker.AdvancedMarkerElement;
                            console.log(marker);
                            console.log(drawResult.overlay);
                            //quando il marker viene spostato
                                // TODO: alla fine applichiamo l'overlay allo stato di react
                                // dispatch({type: DrawingActionKind.UPDATE_OVERLAYS});
                            // }
                        }
                    );
                    //per cleanup
                    eventListeners.push(updateListener);
                    // TODO: alla fine applichiamo l'overlay allo stato di react
                    // dispatch({type: DrawingActionKind.SET_OVERLAY, payload: drawResult});
                }
            }
        );

        eventListeners.push(overlayCompleteListener);

        return () => {
            eventListeners.forEach(listener =>
                google.maps.event.removeListener(listener)
            );
        };
    }, [drawingManager, overlaysShouldUpdateRef]); //dispatch
}