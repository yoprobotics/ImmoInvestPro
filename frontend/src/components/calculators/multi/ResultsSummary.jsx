import React from 'react';
import { 
  Paper, Typography, Box, Divider, Grid, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant le résumé des résultats du calcul
 * @param {Object} results - Résultats du calcul
 */
const ResultsSummary = ({ results }) => {
  if (!results) return null;
  
  const { summary, details } = results;
  
  // Détermination de la classe de viabilité
  let viabilityColor = 'success';
  let viabilityIcon = <CheckCircleIcon />;
  
  if (!summary.isViable) {
    if (summary.cashflowPerUnit < 0) {
      viabilityColor = 'error';
      viabilityIcon = <ErrorIcon />;
    } else {
      viabilityColor = 'warning';
      viabilityIcon = <WarningIcon />;
    }
  }
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Résumé des résultats
      </Typography>
      
      {/* Indicateur de viabilité */}
      <Paper 
        variant="outlined" 
        sx={{ p: 2, mb: 3, bgcolor: `${viabilityColor}.light`, borderColor: `${viabilityColor}.main` }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {viabilityIcon}
          <Typography variant="subtitle1" color={`${viabilityColor}.dark`}>
            {summary.message}
          </Typography>
        </Box>
      </Paper>
      
      {/* Section Prix et Revenus */}
      <Typography variant="subtitle2" gutterBottom>
        Prix et Revenus
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            Prix d'achat:
          </Typography>
          <Typography variant="h6">
            {formatNumberWithSpaces(summary.purchasePrice)} $
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            Revenu brut annuel:
          </Typography>
          <Typography variant="h6" color="primary.main">
            {formatNumberWithSpaces(summary.grossAnnualRent)} $
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            Revenu net d'exploitation:
          </Typography>
          <Typography variant="h6" color="primary.main">
            {formatNumberWithSpaces(summary.netOperatingIncome)} $
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            Nombre d'unités:
          </Typography>
          <Typography variant="h6">
            {summary.units}
          </Typography>
        </Grid>
      </Grid>
      
      {/* Section Cashflow */}
      <Typography variant="subtitle2" gutterBottom>
        Cashflow et Rentabilité
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" color="text.secondary">
            Cashflow mensuel:
          </Typography>
          <Typography 
            variant="h6" 
            color={summary.monthlyCashflow >= 0 ? "success.main" : "error.main"}
          >
            {formatNumberWithSpaces(summary.monthlyCashflow)} $
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" color="text.secondary">
            Cashflow par porte:
          </Typography>
          <Typography 
            variant="h6" 
            color={summary.cashflowPerUnit >= 75 ? "success.main" : 
                  summary.cashflowPerUnit >= 0 ? "warning.main" : "error.main"}
          >
            {formatNumberWithSpaces(summary.cashflowPerUnit)} $ / mois
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" color="text.secondary">
            Taux de capitalisation:
          </Typography>
          <Typography variant="h6" color={parseFloat(summary.capRate) >= 5 ? "success.main" : "warning.main"}>
            {summary.capRate} %
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" color="text.secondary">
            Rendement sur fonds propres:
          </Typography>
          <Typography variant="h6" color={parseFloat(summary.cashOnCash) >= 8 ? "success.main" : "warning.main"}>
            {summary.cashOnCash} %
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" color="text.secondary">
            Multiplicateur brut:
          </Typography>
          <Typography variant="h6">
            {summary.grossRentMultiplier}
          </Typography>
        </Grid>
      </Grid>
      
      {/* Répartition des revenus */}
      <Typography variant="subtitle2" gutterBottom>
        Répartition des Revenus
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      {details?.revenueDetails?.unitCategories && (
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type d'unité</TableCell>
                <TableCell align="right">Nombre</TableCell>
                <TableCell align="right">Loyer moyen</TableCell>
                <TableCell align="right">Loyer total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(details.revenueDetails.unitCategories).map(([type, data]) => (
                <TableRow key={type}>
                  <TableCell>{type}</TableCell>
                  <TableCell align="right">{data.count}</TableCell>
                  <TableCell align="right">{formatNumberWithSpaces(data.averageRent)} $</TableCell>
                  <TableCell align="right">{formatNumberWithSpaces(data.totalRent)} $</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Ratios d'endettement si disponibles */}
      {summary.debtServiceRatios && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Ratios d'endettement
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ABD (Amortissement Brut de la Dette):
                </Typography>
                <Chip 
                  label={`${summary.debtServiceRatios.abd}%`}
                  color={summary.debtServiceRatios.abdExceeded ? "error" : "success"}
                  size="small"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ATD (Amortissement Total de la Dette):
                </Typography>
                <Chip 
                  label={`${summary.debtServiceRatios.atd}%`}
                  color={summary.debtServiceRatios.atdExceeded ? "error" : "success"}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default ResultsSummary;