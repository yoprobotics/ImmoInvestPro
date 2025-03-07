import React from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  CardMedia, CardActionArea, Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Calculator as CalculatorIcon,
  Apartment as ApartmentIcon,
  Home as HomeIcon,
  Analytics as AnalyticsIcon,
  Compare as CompareIcon
} from '@mui/icons-material';

/**
 * Page d'accueil de l'application
 */
const HomePage = () => {
  // Calculateurs disponibles
  const calculators = [
    {
      id: 'multi-detailed',
      title: 'Calculateur MULTI détaillé',
      description: 'Analyse complète des immeubles à revenus multi-logements selon la méthode du calculateur de rendement MULTI 5.1.',
      icon: <ApartmentIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />,
      path: '/calculators/multi/detailed',
      available: true
    },
    {
      id: 'flip-detailed',
      title: 'Calculateur FLIP détaillé',
      description: 'Analyse des projets d\'achat-rénovation-revente pour maximiser les profits.',
      icon: <HomeIcon sx={{ fontSize: 60, mb: 2, color: 'secondary.main' }} />,
      path: '/calculators/flip/detailed',
      available: false
    },
    {
      id: 'scenario-comparison',
      title: 'Comparaison de scénarios',
      description: 'Comparez différents scénarios d\'investissement pour prendre la meilleure décision.',
      icon: <CompareIcon sx={{ fontSize: 60, mb: 2, color: 'success.main' }} />,
      path: '/calculators/scenario-comparison',
      available: true
    },
    {
      id: 'napkin',
      title: 'Calculateurs Napkin',
      description: 'Évaluez rapidement la rentabilité d\'un projet avec les calculateurs simplifiés.',
      icon: <CalculatorIcon sx={{ fontSize: 60, mb: 2, color: 'info.main' }} />,
      path: '/calculators/napkin',
      available: false
    }
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* En-tête */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 8,
          backgroundImage: 'linear-gradient(to right, #1976d2, #2196f3)',
          color: 'white',
          py: 5,
          px: 3,
          borderRadius: 2
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          ImmoInvestPro
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Plateforme d'analyse et de suivi d'investissements immobiliers
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
          Analysez vos opportunités d'investissement, optimisez vos revenus et suivez la performance de votre portefeuille immobilier.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            backgroundColor: 'white', 
            color: 'primary.main',
            '&:hover': { backgroundColor: '#f0f0f0' }
          }}
          component={RouterLink}
          to="/calculators/multi/detailed"
        >
          Calculateur MULTI détaillé
        </Button>
      </Box>
      
      {/* Section des calculateurs */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Nos calculateurs
      </Typography>
      
      <Grid container spacing={4}>
        {calculators.map((calculator) => (
          <Grid item xs={12} sm={6} md={3} key={calculator.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                opacity: calculator.available ? 1 : 0.6
              }}
            >
              <CardActionArea 
                component={calculator.available ? RouterLink : 'div'}
                to={calculator.available ? calculator.path : '#'}
                sx={{ height: '100%', p: 2, textAlign: 'center' }}
                disabled={!calculator.available}
              >
                {calculator.icon}
                <Typography variant="h6" component="h3" gutterBottom>
                  {calculator.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {calculator.description}
                </Typography>
                {!calculator.available && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    Bientôt disponible
                  </Typography>
                )}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Section sur les avantages */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Pourquoi utiliser ImmoInvestPro?
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <CalculatorIcon sx={{ fontSize: 50, mb: 2, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom>
                Analyses précises
              </Typography>
              <Typography variant="body2">
                Nos calculateurs utilisent les mêmes formules que ceux de la formation "Secrets de l'immobilier" pour des résultats fiables.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <AnalyticsIcon sx={{ fontSize: 50, mb: 2, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom>
                Visualisations claires
              </Typography>
              <Typography variant="body2">
                Comprenez vos investissements grâce à des graphiques intuitifs et des indicateurs de performance clairs.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <CompareIcon sx={{ fontSize: 50, mb: 2, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom>
                Décisions éclairées
              </Typography>
              <Typography variant="body2">
                Comparez différents scénarios d'investissement pour choisir les meilleures opportunités.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;