import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Calculate as CalculateIcon,
  CompareArrows as FlipIcon,
  ApartmentOutlined as MultiIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowRight as ExpandLessIcon
} from '@mui/icons-material';

/**
 * Composant de barre latérale de navigation
 */
const Sidebar = ({ open, onClose, width = 240 }) => {
  const [calculatorsOpen, setCalculatorsOpen] = React.useState(false);

  const handleCalculatorsToggle = () => {
    setCalculatorsOpen(!calculatorsOpen);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          ImmoInvestPro
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        <ListItem component={NavLink} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Accueil" />
        </ListItem>
        
        <ListItem component={NavLink} to="/dashboard" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
        
        <ListItem button onClick={handleCalculatorsToggle}>
          <ListItemIcon>
            <CalculateIcon />
          </ListItemIcon>
          <ListItemText primary="Calculateurs" />
          {calculatorsOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </ListItem>
        
        <Collapse in={calculatorsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              component={NavLink} 
              to="/calculators/flip" 
              sx={{ pl: 4, color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon>
                <FlipIcon />
              </ListItemIcon>
              <ListItemText primary="Calculateur FLIP" />
            </ListItem>
            
            <ListItem 
              component={NavLink} 
              to="/calculators/multi" 
              sx={{ pl: 4, color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon>
                <MultiIcon />
              </ListItemIcon>
              <ListItemText primary="Calculateur MULTI" />
            </ListItem>
          </List>
        </Collapse>
      </List>
      
      <Divider />
      
      <List>
        <ListItem component={NavLink} to="/profile" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profil" />
        </ListItem>
        
        <ListItem component={NavLink} to="/settings" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
