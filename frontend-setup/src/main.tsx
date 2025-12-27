import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './lib/ToastProvider.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppContextProvider from './context/AppContextProvider.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_GOOGLE_CLIENT_ID


if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}





createRoot(document.getElementById('root')!).render (
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <BrowserRouter>
  <AppContextProvider>
  <ToastProvider/>
    <App />
  </AppContextProvider>
  </BrowserRouter>
 </GoogleOAuthProvider>
)



