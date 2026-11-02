import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { SesionProvider } from './aplicacion/SesionProvider.tsx'
import { EquipoProvider } from './aplicacion/EquipoProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        {/* El equipo depende de quién tiene la sesión, por eso va ADENTRO del Provider de sesión */}
        <EquipoProvider>
          <App />
        </EquipoProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
)
