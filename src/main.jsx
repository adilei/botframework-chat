import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AppM365 from './AppM365.jsx'
import AppDemo from './AppDemo.jsx'

// URL param switches: ?m365 for M365 SDK, ?demo for demo mode
const useM365 = window.location.search.includes('m365')
const useDemo = window.location.search.includes('demo')

// Select app based on mode
let app
if (useDemo) {
  // Demo mode - no real bot connection needed
  app = <AppDemo />
} else if (useM365) {
  // M365 SDK mode - disable StrictMode to prevent double connection
  app = <AppM365 />
} else {
  // Standard DirectLine mode
  app = <StrictMode><App /></StrictMode>
}

createRoot(document.getElementById('root')).render(app)
