import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Import shared base styles
import '../shared-styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
