import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Calculate as CalculateIcon,
  Apartment as ApartmentIcon,
  Compare as CompareIcon,
  Construction as ConstructionIcon,
  AccountCircle as AccountCircleIcon,
  KeyboardArrowDown as ArrowDownIcon,
  TrendingUp as TrendingUpIcon,
  Handyman as HandymanIcon
} from '@mui/icons-material';

/**
 * Composant d'en-tête de l'application
 */
const AppHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // État pour le menu des calculateurs
  const [calculatorAnchorEl, setCalculatorAnchorEl] = useState(null);
  
  // État pour le menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Gestion du menu des calculateurs
  const handleCalculatorMenuOpen = (event) => {
    setCalculatorAnchorEl(event.currentTarget);
  };
  
  const handleCalculatorMenuClose = () => {
    setCalculatorAnchorEl(null);
  };
  
  // Navigation vers un calculateur
  const navigateToCalculator = (path) => {
    handleCalculatorMenuClose();
    navigate(path);
  };
  
  // Gestion du menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo et titre */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ApartmentIcon sx={{ mr: 1 }} />
            ImmoInvestPro
          </Typography>
          
          {/* Menu version desktop */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                startIcon={<HomeIcon />}
                sx={{ ml: 2 }}
              >
                Accueil
              </Button>
              
              <Button
                color="inherit"
                startIcon={<CalculateIcon />}
                endIcon={<ArrowDownIcon />}
                onClick={handleCalculatorMenuOpen}
                sx={{ ml: 2 }}
                aria-controls="calculators-menu"
                aria-haspopup="true"
              >
                Calculateurs
              </Button>
              
              <Menu
                id="calculators-menu"
                anchorEl={calculatorAnchorEl}
                open={Boolean(calculatorAnchorEl)}
                onClose={handleCalculatorMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'calculators-button',
                }}
              >
                <MenuItem 
                  onClick={() => navigateToCalculator('/calculators/multi/detailed')}
                  selected={location.pathname === '/calculators/multi/detailed'}
                >
                  <ListItemIcon>
                    <ApartmentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Calculateur MULTI détaillé</ListItemText>
                </MenuItem>
                
                <MenuItem 
                  onClick={() => navigateToCalculator('/calculators/yearly-acquisition')}
                  selected={location.pathname === '/calculators/yearly-acquisition'}
                >
                  <ListItemIcon>
                    <TrendingUpIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Un immeuble par AN</ListItemText>
                </MenuItem>
                
                <MenuItem 
                  onClick={() => navigateToCalculator('/calculators/renovations')}
                  selected={location.pathname === '/calculators/renovations'}
                >
                  <ListItemIcon>
                    <HandymanIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Estimation des rénovations</ListItemText>
                </MenuItem>
                
                <MenuItem 
                  onClick={() => navigateToCalculator('/calculators/flip/detailed')}
                  selected={location.pathname === '/calculators/flip/detailed'}
                  disabled
                >
                  <ListItemIcon>
                    <ConstructionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Calculateur FLIP détaillé</ListItemText>
                </MenuItem>
                
                <MenuItem 
                  onClick={() => navigateToCalculator('/calculators/napkin')}
                  selected={location.pathname === '/calculators/napkin'}
                  disabled
                >
                  <ListItemIcon>
                    <CalculateIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Calculateurs Napkin</ListItemText>
                </MenuItem>
                
                <MenuItem 
                  onClick={() => navigateToCalculator('/calculators/scenario-comparison')}
                  selected={location.pathname === '/calculators/scenario-comparison'}
                  disabled
                >
                  <ListItemIcon>
                    <CompareIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Comparaison de scénarios</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
          
          {/* Menu hamburger pour mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              onClick={toggleMobileMenu}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Bouton connexion (à implémenter plus tard) */}
          {!isMobile && (
            <Box sx={{ flexGrow: 0 }}>
              <Button 
                color="inherit"
                startIcon={<AccountCircleIcon />}
                disabled
              >
                Connexion
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
      
      {/* Menu mobile (drawer) */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <List>
            <ListItem
              button
              component={RouterLink}
              to="/"
              onClick={toggleMobileMenu}
              selected={location.pathname === '/'}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Accueil" />
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemText 
                primary="Calculateurs" 
                primaryTypographyProps={{ 
                  fontWeight: 'bold', 
                  color: 'primary.main' 
                }} 
              />
            </ListItem>
            
            <ListItem
              button
              component={RouterLink}
              to="/calculators/multi/detailed"
              onClick={toggleMobileMenu}
              selected={location.pathname === '/calculators/multi/detailed'}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <ApartmentIcon />
              </ListItemIcon>
              <ListItemText primary="MULTI détaillé" />
            </ListItem>
            
            <ListItem
              button
              component={RouterLink}
              to="/calculators/yearly-acquisition"
              onClick={toggleMobileMenu}
              selected={location.pathname === '/calculators/yearly-acquisition'}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText primary="Un immeuble par AN" />
            </ListItem>
            
            <ListItem
              button
              component={RouterLink}
              to="/calculators/renovations"
              onClick={toggleMobileMenu}
              selected={location.pathname === '/calculators/renovations'}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <HandymanIcon />
              </ListItemIcon>
              <ListItemText primary="Estimation des rénovations" />
            </ListItem>
            
            <ListItem
              button
              component={RouterLink}
              to="/calculators/flip/detailed"
              onClick={toggleMobileMenu}
              disabled
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <ConstructionIcon />
              </ListItemIcon>
              <ListItemText primary="FLIP détaillé" />
            </ListItem>
            
            <ListItem
              button
              component={RouterLink}
              to="/calculators/napkin"
              onClick={toggleMobileMenu}
              disabled
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <CalculateIcon />
              </ListItemIcon>
              <ListItemText primary="Calculateurs Napkin" />
            </ListItem>
            
            <ListItem
              button
              component={RouterLink}
              to="/calculators/scenario-comparison"
              onClick={toggleMobileMenu}
              disabled
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <CompareIcon />
              </ListItemIcon>
              <ListItemText primary="Comparaison de scénarios" />
            </ListItem>
            
            <Divider />
            
            <ListItem
              button
              disabled
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Connexion" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default AppHeader;
