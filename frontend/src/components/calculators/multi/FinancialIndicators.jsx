import React from 'react';
import { 
  Paper, Typography, Box, Divider, Grid,
  Card, CardContent, LinearProgress, Tooltip
} from '@mui/material';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant les indicateurs financiers détaillés
 * @param {Object} results - Résultats du calcul
 */
const FinancialIndicators = ({ results }) => {
  if (!results) return null;
  
  const { summary, details } = results;
  
  // Fonction pour rendre une jauge avec un indicateur
  const renderGauge = (value, threshold1, threshold2, title, suffix = '%', tooltipText = '') => {
    // Déterminer la couleur basée sur les seuils
    let color = 'error';
    if (value >= threshold2) color = 'success';
    else if (value >= threshold1) color = 'warning';
    
    // Normaliser la valeur pour la barre de progression (0-100)
    let normalizedValue = value;
    let max = Math.max(threshold2 * 1.5, value);
    
    // Si valeur négative, on ajuste pour un affichage cohérent
    if (value < 0) {
      normalizedValue = 0;
    } else {
      normalizedValue = (value / max) * 100;
    }
    
    // Limiter à 100%
    normalizedValue = Math.min(normalizedValue, 100);
    
    return (
      <Tooltip title={tooltipText} arrow placement="top">
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" color={`${color}.main`} sx={{ mb: 1 }}>
              {typeof value === 'number' ? value.toFixed(2) : value}{suffix}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={normalizedValue} 
              color={color}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      </Tooltip>
    );
  };
  
  // Configuration des seuils pour chaque indicateur
  const indicators = [
    {
      title: 'Cashflow par porte',
      value: summary.cashflowPerUnit,
      threshold1: 0,
      threshold2: 75,
      suffix: ' $/mois',
      tooltipText: 'Un cashflow de 75$/porte/mois ou plus est considéré comme bon'
    },
    {
      title: 'Taux de capitalisation',
      value: parseFloat(summary.capRate),
      threshold1: 4,
      threshold2: 5,
      suffix: '%',
      tooltipText: 'Un taux de capitalisation de 5% ou plus est généralement recherché'
    },
    {
      title: 'Rendement sur fonds propres',
      value: parseFloat(summary.cashOnCash),
      threshold1: 5,
      threshold2: 8,
      suffix: '%',
      tooltipText: 'Un rendement sur fonds propres de 8% ou plus est considéré comme attractif'
    },
    {
      title: 'Multiplicateur de revenu brut',
      value: parseFloat(summary.grossRentMultiplier),
      threshold1: 8,
      threshold2: 12,
      suffix: '',
      tooltipText: 'Un multiplicateur entre 8 et 12 est généralement acceptable, mais cela dépend du marché'
    }
  ];
  
  // Données supplémentaires pour le tableau de bord
  const expenseRatio = details.expenseRatio || 
    (details.operatingExpenses / details.revenueDetails.totalAnnualRevenue * 100);
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Indicateurs de performance
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {/* Jauges d'indicateurs financiers */}
      <Grid container spacing={2}>
        {indicators.map((indicator, index) => (
          <Grid item xs={12} sm={6} key={index}>
            {renderGauge(
              indicator.value,
              indicator.threshold1,
              indicator.threshold2,
              indicator.title,
              indicator.suffix,
              indicator.tooltipText
            )}
          </Grid>
        ))}
      </Grid>
      
      {/* Informations financières additionnelles */}
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
        Ratios financiers supplémentaires
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Ratio de dépenses:
            </Typography>
            <Typography variant="body1">
              {expenseRatio.toFixed(2)}% des revenus bruts
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Prix par unité:
            </Typography>
            <Typography variant="body1">
              {formatNumberWithSpaces(details.purchasePrice / summary.units)} $
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Revenu annuel par unité:
            </Typography>
            <Typography variant="body1">
              {formatNumberWithSpaces(details.grossAnnualRent / summary.units)} $
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Mise de fonds:
            </Typography>
            <Typography variant="body1">
              {formatNumberWithSpaces(details.financing.totalDownPayment)} $ 
              ({(details.financing.totalDownPayment / details.purchasePrice * 100).toFixed(2)}%)
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* Conseils basés sur les résultats */}
      <Paper 
        variant="outlined" 
        sx={{ p: 2, mt: 3, bgcolor: 'info.light', borderColor: 'info.main' }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Conseils d'optimisation
        </Typography>
        
        {summary.cashflowPerUnit < 75 && (
          <Typography variant="body2" paragraph>
            {summary.cashflowPerUnit < 0 
              ? "⚠️ Le cashflow négatif est risqué. Considérez augmenter les loyers, réduire les dépenses ou renégocier le financement."
              : "⚠️ Le cashflow est positif mais sous le seuil recommandé de 75$/porte/mois. Cherchez des moyens d'optimiser les revenus."}
          </Typography>
        )}
        
        {expenseRatio > 50 && (
          <Typography variant="body2" paragraph>
            "⚠️ Votre ratio de dépenses est supérieur à 50%. Examinez quelles dépenses pourraient être réduites."
          </Typography>
        )}
        
        {parseFloat(summary.capRate) < 5 && (
          <Typography variant="body2">
            "⚠️ Votre taux de capitalisation est inférieur à 5%. Envisagez de négocier un prix d'achat plus bas ou d'augmenter les revenus."
          </Typography>
        )}
      </Paper>
    </Paper>
  );
};

export default FinancialIndicators;