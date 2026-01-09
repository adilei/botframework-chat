import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AppM365 from './AppM365.jsx'

// Use ?m365 URL param to switch to M365 SDK (streaming support)
const useM365 = window.location.search.includes('m365')

// Disable StrictMode for M365 to prevent double connection
const wrapper = useM365
  ? <AppM365 />
  : <StrictMode><App /></StrictMode>

createRoot(document.getElementById('root')).render(wrapper)
