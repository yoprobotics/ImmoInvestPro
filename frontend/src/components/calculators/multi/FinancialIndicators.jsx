import React from 'react';
import { 
  Paper, Typography, Box, Divider, Grid,
  LinearProgress, Rating, Tooltip
} from '@mui/material';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant les principaux indicateurs financiers
 * @param {Object} results - Résultats du calcul
 */
const FinancialIndicators = ({ results }) => {
  if (!results) return null;
  
  const { summary, details } = results;
  
  // Évaluation des indicateurs sur une échelle de 1 à 5
  const evaluateCapRate = (rate) => {
    const capRate = parseFloat(rate);
    if (capRate >= 7) return 5;
    if (capRate >= 6) return 4;
    if (capRate >= 5) return 3;
    if (capRate >= 4) return 2;
    return 1;
  };
  
  const evaluateCashOnCash = (rate) => {
    const cashOnCash = parseFloat(rate);
    if (cashOnCash >= 12) return 5;
    if (cashOnCash >= 10) return 4;
    if (cashOnCash >= 8) return 3;
    if (cashOnCash >= 6) return 2;
    return 1;
  };
  
  const evaluateCashflowPerUnit = (cashflow) => {
    if (cashflow >= 150) return 5;
    if (cashflow >= 100) return 4;
    if (cashflow >= 75) return 3;
    if (cashflow >= 50) return 2;
    if (cashflow >= 0) return 1;
    return 0;
  };
  
  const evaluateGRM = (grm) => {
    const value = parseFloat(grm);
    if (value <= 5) return 5;
    if (value <= 6) return 4;
    if (value <= 8) return 3;
    if (value <= 10) return 2;
    return 1;
  };
  
  const evaluateExpenseRatio = (ratio) => {
    if (!details?.expenseDetails?.expenseRatio) return 3;
    
    const expenseRatio = details.expenseDetails.expenseRatio;
    if (expenseRatio <= 35) return 5;
    if (expenseRatio <= 40) return 4;
    if (expenseRatio <= 45) return 3;
    if (expenseRatio <= 50) return 2;
    return 1;
  };
  
  // Calcul du score global
  const capRateScore = evaluateCapRate(summary.capRate);
  const cashOnCashScore = evaluateCashOnCash(summary.cashOnCash);
  const cashflowPerUnitScore = evaluateCashflowPerUnit(summary.cashflowPerUnit);
  const grmScore = evaluateGRM(summary.grossRentMultiplier);
  const expenseRatioScore = evaluateExpenseRatio();
  
  const totalScore = Math.round((capRateScore + cashOnCashScore + cashflowPerUnitScore + grmScore + expenseRatioScore) / 5 * 100) / 100;
  
  // Interprétation du score
  let scoreInterpretation;
  let scoreColor;
  
  if (totalScore >= 4.5) {
    scoreInterpretation = "Excellent investissement";
    scoreColor = "success.main";
  } else if (totalScore >= 3.5) {
    scoreInterpretation = "Très bon investissement";
    scoreColor = "success.main";
  } else if (totalScore >= 2.5) {
    scoreInterpretation = "Bon investissement";
    scoreColor = "primary.main";
  } else if (totalScore >= 1.5) {
    scoreInterpretation = "Investissement moyen";
    scoreColor = "warning.main";
  } else {
    scoreInterpretation = "Investissement risqué";
    scoreColor = "error.main";
  }
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Indicateurs financiers
      </Typography>
      
      {/* Score global */}
      <Box sx={{ textAlign: 'center', my: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Score global
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ mr: 2, color: scoreColor }}>
            {totalScore}
          </Typography>
          <Rating value={totalScore} precision={0.5} readOnly max={5} />
        </Box>
        <Typography variant="body2" color={scoreColor} sx={{ mt: 1, fontWeight: 'bold' }}>
          {scoreInterpretation}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Évaluation détaillée des indicateurs */}
      <Grid container spacing={3}>
        {/* Taux de capitalisation */}
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title="Revenu net d'exploitation divisé par le prix d'achat">
                <Typography variant="body2">Taux de capitalisation (Cap Rate)</Typography>
              </Tooltip>
              <Typography variant="body2">{summary.capRate}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={capRateScore * 20} 
              color={capRateScore >= 3 ? "success" : "warning"}
              sx={{ height: 8, borderRadius: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Faible</Typography>
              <Typography variant="caption" color="text.secondary">Excellent</Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Rendement sur fonds propres */}
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title="Cashflow annuel divisé par la mise de fonds">
                <Typography variant="body2">Rendement sur fonds propres (Cash-on-Cash)</Typography>
              </Tooltip>
              <Typography variant="body2">{summary.cashOnCash}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={cashOnCashScore * 20} 
              color={cashOnCashScore >= 3 ? "success" : "warning"}
              sx={{ height: 8, borderRadius: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Faible</Typography>
              <Typography variant="caption" color="text.secondary">Excellent</Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Cashflow par porte */}
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title="Cashflow mensuel divisé par le nombre d'unités">
                <Typography variant="body2">Cashflow par porte</Typography>
              </Tooltip>
              <Typography variant="body2">{formatNumberWithSpaces(summary.cashflowPerUnit)} $/mois</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={cashflowPerUnitScore * 20} 
              color={cashflowPerUnitScore >= 3 ? "success" : "warning"}
              sx={{ height: 8, borderRadius: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Négatif</Typography>
              <Typography variant="caption" color="text.secondary">Excellent</Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Multiplicateur de revenu brut */}
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title="Prix d'achat divisé par le revenu brut annuel">
                <Typography variant="body2">Multiplicateur de revenu brut (GRM)</Typography>
              </Tooltip>
              <Typography variant="body2">{summary.grossRentMultiplier}</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={grmScore * 20} 
              color={grmScore >= 3 ? "success" : "warning"}
              sx={{ height: 8, borderRadius: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Élevé</Typography>
              <Typography variant="caption" color="text.secondary">Faible</Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Ratio de dépenses */}
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title="Dépenses d'exploitation divisées par le revenu brut">
                <Typography variant="body2">Ratio de dépenses</Typography>
              </Tooltip>
              <Typography variant="body2">
                {details?.expenseDetails?.expenseRatio ? 
                 details.expenseDetails.expenseRatio.toFixed(1) : "N/A"}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={expenseRatioScore * 20} 
              color={expenseRatioScore >= 3 ? "success" : "warning"}
              sx={{ height: 8, borderRadius: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Élevé</Typography>
              <Typography variant="caption" color="text.secondary">Faible</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Conseils et recommandations */}
      <Typography variant="subtitle2" gutterBottom>
        Conseils et recommandations
      </Typography>
      
      <Box sx={{ mt: 1 }}>
        {cashflowPerUnitScore < 3 && (
          <Typography variant="body2" paragraph>
            • Le cashflow par porte est inférieur à 75$/mois. Cherchez à augmenter les revenus ou à réduire les dépenses.
          </Typography>
        )}
        
        {capRateScore < 3 && (
          <Typography variant="body2" paragraph>
            • Le taux de capitalisation est faible. Essayez de négocier un meilleur prix d'achat ou d'optimiser les revenus.
          </Typography>
        )}
        
        {expenseRatioScore < 3 && (
          <Typography variant="body2" paragraph>
            • Le ratio de dépenses est élevé. Identifiez les dépenses qui peuvent être réduites.
          </Typography>
        )}
        
        {cashOnCashScore < 3 && (
          <Typography variant="body2" paragraph>
            • Le rendement sur fonds propres est faible. Explorez différentes structures de financement pour améliorer le rendement.
          </Typography>
        )}
        
        {summary.isViable && (
          <Typography variant="body2" paragraph color="success.main">
            • Cet investissement génère un cashflow positif et respecte le seuil minimal recommandé de 75$/porte/mois.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default FinancialIndicators;