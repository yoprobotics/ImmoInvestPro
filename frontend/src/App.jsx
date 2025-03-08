import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import HomePage from './pages/HomePage';
import MultiDetailedCalculator from './pages/MultiDetailedCalculator';
import YearlyAcquisitionCalculatorPage from './pages/YearlyAcquisitionCalculatorPage';

// Composants partagés
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';

// Création du thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      subtle: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

/**
 * Composant principal de l'application
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppHeader />
        <main style={{ minHeight: 'calc(100vh - 140px)', marginTop: '64px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculators/multi/detailed" element={<MultiDetailedCalculator />} />
            <Route path="/calculators/yearly-acquisition" element={<YearlyAcquisitionCalculatorPage />} />
            {/* Routes à ajouter pour les futures fonctionnalités */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <AppFooter />
      </Router>
    </ThemeProvider>
  );
}

export default App;
