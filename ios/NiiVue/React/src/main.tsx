import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      light: grey[300], // Lighter shade of grey for primary light
      main: grey[800], // Darker shade of grey (almost black) for primary main
      dark: grey[900], // Almost black for primary dark
      contrastText: '#fff', // White text for contrast
    },
    secondary: {
      light: '#f5f5f5', // Very light grey (almost white) for secondary light
      main: '#fff', // White for secondary main
      dark: grey[100], // Light grey for secondary dark
      contrastText: '#000', // Black text for contrast
    },
  },
});



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
