import React from 'react';
import { 
  Paper, Typography, Box, Divider, Grid,
  LinearProgress, Tooltip
} from '@mui/material';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant les indicateurs financiers du calcul
 * @param {Object} results - Résultats du calcul
 */
const FinancialIndicators = ({ results }) => {
  if (!results) return null;
  
  const { summary, details } = results;
  
  // Calcul du pourcentage des dépenses par rapport aux revenus
  const expenseRatio = (details.expenseRatio || 0).toFixed(1);
  
  // Calcul des ratios pour les barres de progression
  const capRateRatio = Math.min(parseFloat(summary.capRate) / 10 * 100, 100); // Considérons 10% comme maximum
  const cashOnCashRatio = Math.min(parseFloat(summary.cashOnCash) / 15 * 100, 100); // Considérons 15% comme maximum
  const rentMultiplierGoodness = Math.max(0, Math.min((12 - parseFloat(summary.grossRentMultiplier)) / 8 * 100, 100)); // 4 à 12 comme plage
  
  // Évaluation des ratios
  const evaluateRatio = (name, value) => {
    let color, message;
    
    switch (name) {
      case 'capRate':
        if (value >= 7) {
          color = 'success.main';
          message = 'Excellent rendement';
        } else if (value >= 5) {
          color = 'success.main';
          message = 'Bon rendement';
        } else if (value >= 3) {
          color = 'warning.main';
          message = 'Rendement moyen';
        } else {
          color = 'error.main';
          message = 'Faible rendement';
        }
        break;
        
      case 'cashOnCash':
        if (value >= 12) {
          color = 'success.main';
          message = 'Excellent rendement sur fonds propres';
        } else if (value >= 8) {
          color = 'success.main';
          message = 'Bon rendement sur fonds propres';
        } else if (value >= 5) {
          color = 'warning.main';
          message = 'Rendement sur fonds propres moyen';
        } else {
          color = 'error.main';
          message = 'Faible rendement sur fonds propres';
        }
        break;
        
      case 'grossRentMultiplier':
        if (value <= 8) {
          color = 'success.main';
          message = 'Excellent multiplicateur brut';
        } else if (value <= 10) {
          color = 'success.main';
          message = 'Bon multiplicateur brut';
        } else if (value <= 12) {
          color = 'warning.main';
          message = 'Multiplicateur brut moyen';
        } else {
          color = 'error.main';
          message = 'Multiplicateur brut élevé';
        }
        break;
        
      case 'expenseRatio':
        if (value <= 35) {
          color = 'success.main';
          message = 'Ratio de dépenses très bas';
        } else if (value <= 45) {
          color = 'success.main';
          message = 'Bon ratio de dépenses';
        } else if (value <= 55) {
          color = 'warning.main';
          message = 'Ratio de dépenses moyen';
        } else {
          color = 'error.main';
          message = 'Ratio de dépenses élevé';
        }
        break;
    }
    
    return { color, message };
  };
  
  // Évaluation de chaque ratio
  const capRateEval = evaluateRatio('capRate', parseFloat(summary.capRate));
  const cashOnCashEval = evaluateRatio('cashOnCash', parseFloat(summary.cashOnCash));
  const grmEval = evaluateRatio('grossRentMultiplier', parseFloat(summary.grossRentMultiplier));
  const expenseRatioEval = evaluateRatio('expenseRatio', parseFloat(expenseRatio));
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Indicateurs financiers
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Analyse de la performance financière de l'investissement
      </Typography>
      
      {/* Taux de capitalisation */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
          <Typography variant="subtitle2">
            Taux de capitalisation
          </Typography>
          <Tooltip title={capRateEval.message} arrow>
            <Typography variant="h6" color={capRateEval.color}>
              {summary.capRate} %
            </Typography>
          </Tooltip>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={capRateRatio} 
          color={capRateEval.color === 'error.main' ? 'error' : capRateEval.color === 'warning.main' ? 'warning' : 'success'} 
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Ratio entre le revenu net d'exploitation et le prix d'achat
        </Typography>
      </Box>
      
      {/* Rendement sur fonds propres */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
          <Typography variant="subtitle2">
            Rendement sur fonds propres
          </Typography>
          <Tooltip title={cashOnCashEval.message} arrow>
            <Typography variant="h6" color={cashOnCashEval.color}>
              {summary.cashOnCash} %
            </Typography>
          </Tooltip>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={cashOnCashRatio} 
          color={cashOnCashEval.color === 'error.main' ? 'error' : cashOnCashEval.color === 'warning.main' ? 'warning' : 'success'} 
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Ratio entre le cashflow annuel et la mise de fonds
        </Typography>
      </Box>
      
      {/* Multiplicateur brut */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
          <Typography variant="subtitle2">
            Multiplicateur brut
          </Typography>
          <Tooltip title={grmEval.message} arrow>
            <Typography variant="h6" color={grmEval.color}>
              {summary.grossRentMultiplier}
            </Typography>
          </Tooltip>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={rentMultiplierGoodness} 
          color={grmEval.color === 'error.main' ? 'error' : grmEval.color === 'warning.main' ? 'warning' : 'success'} 
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Ratio entre le prix d'achat et le revenu brut annuel
        </Typography>
      </Box>
      
      {/* Ratio des dépenses */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
          <Typography variant="subtitle2">
            Ratio des dépenses
          </Typography>
          <Tooltip title={expenseRatioEval.message} arrow>
            <Typography variant="h6" color={expenseRatioEval.color}>
              {expenseRatio} %
            </Typography>
          </Tooltip>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={100 - (parseFloat(expenseRatio) / 80 * 100)} // Inversé, car un ratio plus bas est meilleur
          color={expenseRatioEval.color === 'error.main' ? 'error' : expenseRatioEval.color === 'warning.main' ? 'warning' : 'success'} 
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Ratio entre les dépenses totales et les revenus bruts
        </Typography>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Comparaison aux objectifs */}
      <Typography variant="subtitle2" gutterBottom>
        Comparaison aux objectifs
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Objectif de cashflow:</strong> 75$ / porte / mois
          </Typography>
          <Typography 
            variant="body2"
            color={summary.cashflowPerUnit >= 75 ? "success.main" : "error.main"}
          >
            Résultat: {formatNumberWithSpaces(summary.cashflowPerUnit)} $ / porte / mois
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Objectif de rendement sur fonds propres:</strong> 8% minimum
          </Typography>
          <Typography 
            variant="body2"
            color={parseFloat(summary.cashOnCash) >= 8 ? "success.main" : "error.main"}
          >
            Résultat: {summary.cashOnCash} %
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FinancialIndicators;