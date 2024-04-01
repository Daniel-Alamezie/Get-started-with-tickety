import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../app/globals.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className=' bg-slate-600'>
      <App />
    </div>
  </React.StrictMode>,
)
