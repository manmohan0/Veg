import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'rsuite/dist/rsuite.min.css';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='bg-neutral-800 text-neutral-200 h-screen w-screen'>
      <App />
    </div>
  </StrictMode>,
)
