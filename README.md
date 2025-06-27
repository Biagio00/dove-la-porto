# dove-la-porto

Dove la porto? è un'applicazione che consente di visualizzare in tempo reale le postazioni dei cassonetti nella zona.

## Funzionalità

- Gli utenti non registrati possono visualizzare la mappa e ricevere notifiche quando le posizioni vengono modificate
- Autenticazione basata su Firebase con email e password
- Ruoli di operatore e amministratore impostabili per gli utenti
- Modifica delle posizioni integrata con Google Maps
- Sia operatori che amministratori possono modificare le posizioni sulla mappa
- Solo gli amministratori possono impostare o revocare i ruoli agli altri utenti

## Screenshots
#### Visualizzare la mappa
![Alt Text](media/viewmap_demo.gif)

#### Modificare gli utenti
![Alt Text](media/users_demo.gif)

#### Modificare le posizioni
![Alt Text](media/positions_demo.gif)


## Installazione

### Requisiti
- **node** v22.11.0 (LTS) con **npm**

### Download
1. `git clone https://github.com/Biagio00/dove-la-porto.git`
2. `cd ./dove-la-porto`

### Client
1. `cd ./dlp-frontend`
2. `npm install`
3. In questa cartella inserire il file `.env` con le API di Google Maps e di Firebase impostando le seguenti variabili d'ambiente:
```
VITE_GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAPS_MAP_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
4. `npm run dev` -> dovrebbe ascoltare su http://localhost:5173/

### Server
1. `cd ./dlp-backend`
2. `npm install`
3. In questa cartella inserire il file `firebase-adminsdk-pkey.json` ottenuto creando una nuova chiave per Firebase Admin
4. `npm run startsx` (ci mette un po' a partire) dovrebbe ascoltare sulla porta 3000


