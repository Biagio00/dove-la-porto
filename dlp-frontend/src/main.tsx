import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// bootstrap per funzionare ha bisogno del suo css. lo si importa direttamente dalla libreria usando "import".
//  in questo modo lo si applica all'intero documento. (questo approccio è usato spesso in caso di shadow-root)
// documentazione per comportamenti simili:
// - https://web.dev/articles/css-module-scripts
// - https://web.dev/articles/constructable-stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
