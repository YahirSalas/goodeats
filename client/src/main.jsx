import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LoadScript } from '@react-google-maps/api'
import './input.css';
import './output.css'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={['places']}>
      <App />
    </LoadScript>
  </StrictMode>
)
