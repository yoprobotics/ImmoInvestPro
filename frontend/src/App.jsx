import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Container, Box, 
  CssBaseline, ThemeProvider, createTheme, Button,
  IconButton, Menu, MenuItem, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Calculate as CalculateIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

// Import des pages
import HomePage from './pages/HomePage';
import MultiDetailedCalculatorPage from './pages/MultiDetailedCalculatorPage';
import ScenarioComparisonPage from './pages/ScenarioComparisonPage';

// Création du thème
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
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

/**
 * Composant principal de l'application
 */
const App = () => {
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  
  // Gestion du menu utilisateur
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  
  // Gestion du tiroir de navigation
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  // Liste des éléments du menu latéral
  const drawerItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Calculateurs', icon: <CalculateIcon />, path: '#', items: [
      { text: 'MULTI détaillé', path: '/calculators/multi/detailed' },
      { text: 'Comparaison de scénarios', path: '/calculators/scenario-comparison' }
    ]},
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
  ];
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          {/* Barre de navigation */}
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              
              <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
                ImmoInvestPro
              </Typography>
              
              <Button color="inherit" component={Link} to="/calculators/multi/detailed">
                Calculateur MULTI
              </Button>
              
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={menuAnchor}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Mon compte</MenuItem>
                <MenuItem onClick={handleMenuClose}>Paramètres</MenuItem>
                <MenuItem onClick={handleMenuClose}>Déconnexion</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          
          {/* Tiroir de navigation */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="div">
                  ImmoInvestPro
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  v1.0.0
                </Typography>
              </Box>
              <Divider />
              <List>
                {drawerItems.map((item, index) => (
                  <React.Fragment key={item.text}>
                    {item.items ? (
                      <>
                        <ListItem button>
                          <ListItemIcon>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.text} />
                        </ListItem>
                        <List component="div" disablePadding>
                          {item.items.map((subItem) => (
                            <ListItem
                              button
                              key={subItem.text}
                              component={Link}
                              to={subItem.path}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText primary={subItem.text} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    ) : (
                      <ListItem button component={Link} to={item.path}>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    )}
                    {index === 0 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Divider />
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Déconnexion" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          
          {/* Contenu principal */}
          <Container>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculators/multi/detailed" element={<MultiDetailedCalculatorPage />} />
              <Route path="/calculators/scenario-comparison" element={<ScenarioComparisonPage />} />
              <Route path="*" element={<div>Page non trouvée</div>} />
            </Routes>
          </Container>
          
          {/* Pied de page */}
          <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
              ImmoInvestPro
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              component="p"
            >
              La plateforme d'analyse pour les investisseurs immobiliers
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {'Copyright © '}
              ImmoInvestPro {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;