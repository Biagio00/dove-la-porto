export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.log("Questo browser non supporta le notifiche desktop");
    }
    try {
        await Notification.requestPermission();
    } catch (error) {
        console.error("Errore nella richiesta dei permessi:", error);
    }
}

export const sendNotification = async (title: string, options?: NotificationOptions) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
    }

    const notificationOptions: NotificationOptions = {
        icon: "/dlp_ns_192x192.png",
        lang: "it",
        ...options
    }
    try {
        // notifica pc
        new Notification(title, notificationOptions);
        // notifica smartphone
        const registration = await navigator.serviceWorker.ready;
        if (registration) {
            await registration.showNotification(title, notificationOptions);
        }
    } catch (error) {
        console.error("Errore nell'invio della notifica:", error);
    }
}

export const sendUpdatedPointsNotification = async (updatedPointsAmount: number) => {
    await sendNotification("Hai ricevuto le nuove posizioni", {
        body: "Sono state aggiornate " + updatedPointsAmount + " posizioni."
    })
}
