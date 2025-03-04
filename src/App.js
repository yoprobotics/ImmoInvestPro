import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  CssBaseline,
  Divider,
  IconButton,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Calculate as CalculateIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon,
  LocalAtm as LocalAtmIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

// Importation des composants de calculateurs
import LiquidityCalculator from './components/LiquidityCalculator';

// Page d'accueil
const HomePage = () => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Bienvenue sur ImmoInvestPro
    </Typography>
    <Typography paragraph>
      Plateforme complète d'analyse et de suivi d'investissements immobiliers spécifiquement adaptée au marché québécois.
    </Typography>
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Calculateurs disponibles:
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          flexWrap: 'wrap'
        }}
      >
        <Box 
          component={Link} 
          to="/calculateurs/liquidite" 
          sx={{ 
            width: { xs: '100%', md: '30%' }, 
            textDecoration: 'none',
            color: 'inherit',
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: 3,
              transform: 'translateY(-5px)'
            }
          }}
        >
          <LocalAtmIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" align="center" gutterBottom>
            Calculateur de Liquidité
          </Typography>
          <Typography variant="body2" align="center">
            Analysez le cashflow, le ROI et les risques d'un investissement immobilier
          </Typography>
        </Box>
        
        {/* Autres calculateurs à venir */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '30%' }, 
            p: 2,
            border: '1px solid #ddd',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 0.6
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 60, color: 'grey.500', mb: 1 }} />
          <Typography variant="h6" align="center" gutterBottom>
            Calculateur Napkin FLIP
          </Typography>
          <Typography variant="body2" align="center">
            À venir prochainement...
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            width: { xs: '100%', md: '30%' }, 
            p: 2,
            border: '1px solid #ddd',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 0.6
          }}
        >
          <AssessmentIcon sx={{ fontSize: 60, color: 'grey.500', mb: 1 }} />
          <Typography variant="h6" align="center" gutterBottom>
            Calculateur Napkin MULTI
          </Typography>
          <Typography variant="body2" align="center">
            À venir prochainement...
          </Typography>
        </Box>
      </Box>
    </Box>
  </Container>
);

// Création du thème
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Bleu
      light: '#63a4ff',
      dark: '#004ba0',
    },
    secondary: {
      main: '#388e3c', // Vert
      light: '#6abf69',
      dark: '#00600f',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div>
      <List>
        <ListItem button component={Link} to="/" onClick={toggleDrawer}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Accueil" />
        </ListItem>
        <ListItem button component={Link} to="/tableau-bord" onClick={toggleDrawer}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText 
            primary="Calculateurs" 
            primaryTypographyProps={{ 
              fontWeight: 'bold',
              color: 'primary'
            }} 
          />
        </ListItem>
        <ListItem button component={Link} to="/calculateurs/liquidite" onClick={toggleDrawer}>
          <ListItemIcon>
            <LocalAtmIcon />
          </ListItemIcon>
          <ListItemText primary="Calculateur de Liquidité" />
        </ListItem>
        <ListItem button disabled>
          <ListItemIcon>
            <CalculateIcon />
          </ListItemIcon>
          <ListItemText primary="Calculateur Napkin FLIP" />
        </ListItem>
        <ListItem button disabled>
          <ListItemIcon>
            <CalculateIcon />
          </ListItemIcon>
          <ListItemText primary="Calculateur Napkin MULTI" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                ImmoInvestPro
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
          >
            {drawer}
          </Drawer>
          
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculateurs/liquidite" element={<LiquidityCalculator />} />
              <Route path="*" element={
                <Container sx={{ mt: 4 }}>
                  <Typography variant="h4">Page non trouvée</Typography>
                  <Typography paragraph>La page que vous recherchez n'existe pas.</Typography>
                </Container>
              } />
            </Routes>
          </Box>
          
          <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'grey.200' }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} ImmoInvestPro - Application d'analyse d'investissement immobilier au Québec
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
