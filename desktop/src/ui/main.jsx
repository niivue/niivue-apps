import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // comment out strict mode to avoid doubel renders during development
  // this is annoying when loading niivue images
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)
