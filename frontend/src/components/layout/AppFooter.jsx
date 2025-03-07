import React from 'react';
import { Container, Typography, Box, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Composant de pied de page de l'application
 */
const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              ImmoInvestPro
            </Typography>
            <Typography variant="body2">
              Plateforme d'analyse et de suivi<br />
              d'investissements immobiliers
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 4 } }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Calculateurs
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Link component={RouterLink} to="/calculators/multi/detailed" color="inherit" underline="hover">
                    MULTI détaillé
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Link component={RouterLink} to="/calculators/flip/detailed" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    FLIP détaillé
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Link component={RouterLink} to="/calculators/napkin" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Calculateurs Napkin
                  </Link>
                </Box>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Ressources
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Link href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Tutoriels
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Link href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Guide de financement
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Link href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    FAQ
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mb: { xs: 1, sm: 0 } }}>
            © {currentYear} ImmoInvestPro. Tous droits réservés.
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Conditions d'utilisation
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Confidentialité
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AppFooter;
