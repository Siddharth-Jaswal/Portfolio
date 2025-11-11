import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Force dark mode by default (persist if toggled later)
const rootEl = document.documentElement
if (!rootEl.classList.contains('dark')) {
  rootEl.classList.add('dark')
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
