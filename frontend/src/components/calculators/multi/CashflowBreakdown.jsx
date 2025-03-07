import React from 'react';
import { 
  Paper, Typography, Box, Divider, Grid,
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant la décomposition détaillée du cashflow
 * @param {Object} results - Résultats du calcul
 */
const CashflowBreakdown = ({ results }) => {
  if (!results) return null;
  
  const { summary, details } = results;
  
  // Préparation des données pour le graphique en camembert des dépenses
  const prepareExpenseChartData = () => {
    if (!details?.expenseDetails?.categories) return [];
    
    const categories = details.expenseDetails.categories;
    const data = [];
    
    // Regrouper les dépenses par catégorie principale
    const taxesTotal = (categories.municipalTaxes?.annualAmount || 0) + 
                       (categories.schoolTaxes?.annualAmount || 0);
    
    const utilitiesTotal = (categories.electricity?.annualAmount || 0) + 
                           (categories.heating?.annualAmount || 0) + 
                           (categories.water?.annualAmount || 0);
    
    const maintenanceTotal = (categories.maintenance?.annualAmount || 0) + 
                            (categories.janitorial?.annualAmount || 0) + 
                            (categories.snowRemoval?.annualAmount || 0) + 
                            (categories.landscaping?.annualAmount || 0) + 
                            (categories.garbage?.annualAmount || 0);
    
    const insuranceTotal = categories.insurance?.annualAmount || 0;
    
    const managementTotal = categories.management?.annualAmount || 0;
    
    const professionalTotal = (categories.legal?.annualAmount || 0) + 
                              (categories.accounting?.annualAmount || 0);
    
    const otherTotal = (categories.advertising?.annualAmount || 0) + 
                       (categories.condo?.annualAmount || 0) + 
                       (categories.other?.annualAmount || 0);
    
    // Ajouter les catégories principales au tableau de données
    if (taxesTotal > 0) {
      data.push({ name: 'Taxes', value: taxesTotal });
    }
    if (utilitiesTotal > 0) {
      data.push({ name: 'Services publics', value: utilitiesTotal });
    }
    if (maintenanceTotal > 0) {
      data.push({ name: 'Entretien', value: maintenanceTotal });
    }
    if (insuranceTotal > 0) {
      data.push({ name: 'Assurances', value: insuranceTotal });
    }
    if (managementTotal > 0) {
      data.push({ name: 'Gestion', value: managementTotal });
    }
    if (professionalTotal > 0) {
      data.push({ name: 'Services pro.', value: professionalTotal });
    }
    if (otherTotal > 0) {
      data.push({ name: 'Autres', value: otherTotal });
    }
    
    return data;
  };
  
  // Préparation des données pour le graphique en camembert des revenus
  const prepareRevenueChartData = () => {
    if (!details?.revenueDetails) return [];
    
    const data = [];
    const revenueDetails = details.revenueDetails;
    
    // Revenus des unités
    if (revenueDetails.totalMonthlyUnitRevenue > 0) {
      data.push({ 
        name: 'Loyers', 
        value: revenueDetails.totalMonthlyUnitRevenue * 12 
      });
    }
    
    // Revenus additionnels
    if (revenueDetails.totalMonthlyAdditionalRevenue > 0) {
      data.push({ 
        name: 'Revenus add.', 
        value: revenueDetails.totalMonthlyAdditionalRevenue * 12 
      });
    }
    
    return data;
  };
  
  // Préparation des données pour le graphique en camembert de répartition du revenu net
  const prepareNetRevenueDistributionData = () => {
    const data = [];
    
    // Ajout du montant pour le financement
    const financingAmount = details.annualFinancingPayments || 0;
    if (financingAmount > 0) {
      data.push({ name: 'Financement', value: financingAmount });
    }
    
    // Ajout du cashflow (s'il est positif)
    const cashflowAmount = details.annualCashflow || 0;
    if (cashflowAmount > 0) {
      data.push({ name: 'Cashflow', value: cashflowAmount });
    } else if (cashflowAmount < 0) {
      // Si le cashflow est négatif, on l'ajoute comme un "déficit"
      data.push({ name: 'Déficit', value: Math.abs(cashflowAmount) });
    }
    
    return data;
  };
  
  // Couleurs pour les graphiques
  const EXPENSE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];
  const REVENUE_COLORS = ['#82CA9D', '#8884D8'];
  const DISTRIBUTION_COLORS = ['#0088FE', '#00C49F', '#FF8042'];
  
  // Extraction des données
  const expenseData = prepareExpenseChartData();
  const revenueData = prepareRevenueChartData();
  const distributionData = prepareNetRevenueDistributionData();
  
  // Calcul des totaux pour les tableaux
  const totalExpenses = details?.operatingExpenses || 0;
  const totalRevenues = details?.revenueDetails?.totalAnnualRevenue || 0;
  const netOperatingIncome = details?.netOperatingIncome || 0;
  const totalFinancing = details?.annualFinancingPayments || 0;
  const annualCashflow = details?.annualCashflow || 0;
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Décomposition du Cashflow
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Analyse détaillée des revenus, dépenses et du cashflow
      </Typography>
      
      {/* Tableau récapitulatif */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Catégorie</TableCell>
              <TableCell align="right">Montant annuel</TableCell>
              <TableCell align="right">Montant mensuel</TableCell>
              <TableCell align="right">Par porte/mois</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Revenus bruts</strong>
              </TableCell>
              <TableCell align="right" sx={{ color: 'primary.main' }}>
                {formatNumberWithSpaces(totalRevenues)} $
              </TableCell>
              <TableCell align="right" sx={{ color: 'primary.main' }}>
                {formatNumberWithSpaces(totalRevenues / 12)} $
              </TableCell>
              <TableCell align="right" sx={{ color: 'primary.main' }}>
                {formatNumberWithSpaces((totalRevenues / 12) / summary.units)} $
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <strong>Dépenses d'exploitation</strong>
              </TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {formatNumberWithSpaces(totalExpenses)} $
              </TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {formatNumberWithSpaces(totalExpenses / 12)} $
              </TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {formatNumberWithSpaces((totalExpenses / 12) / summary.units)} $
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <strong>Revenu net d'exploitation</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatNumberWithSpaces(netOperatingIncome)} $
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatNumberWithSpaces(netOperatingIncome / 12)} $
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatNumberWithSpaces((netOperatingIncome / 12) / summary.units)} $
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <strong>Financement total</strong>
              </TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {formatNumberWithSpaces(totalFinancing)} $
              </TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {formatNumberWithSpaces(totalFinancing / 12)} $
              </TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {formatNumberWithSpaces((totalFinancing / 12) / summary.units)} $
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <strong>Cashflow</strong>
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: annualCashflow >= 0 ? 'success.main' : 'error.main' 
                }}
              >
                {formatNumberWithSpaces(annualCashflow)} $
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: annualCashflow >= 0 ? 'success.main' : 'error.main' 
                }}
              >
                {formatNumberWithSpaces(annualCashflow / 12)} $
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: annualCashflow >= 0 ? 'success.main' : 'error.main' 
                }}
              >
                {formatNumberWithSpaces((annualCashflow / 12) / summary.units)} $
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Visualisations graphiques */}
      <Grid container spacing={3}>
        {/* Graphique des dépenses */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Répartition des dépenses
          </Typography>
          <Box sx={{ height: 200, mb: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${formatNumberWithSpaces(value)} $`, 'Montant']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        {/* Graphique des revenus */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Répartition des revenus
          </Typography>
          <Box sx={{ height: 200, mb: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={REVENUE_COLORS[index % REVENUE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${formatNumberWithSpaces(value)} $`, 'Montant']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        {/* Graphique de distribution du revenu net */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Distribution du revenu net
          </Typography>
          <Box sx={{ height: 200, mb: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === 'Déficit' 
                          ? '#FF6B6B' 
                          : DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]
                      } 
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${formatNumberWithSpaces(value)} $`, 'Montant']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
      
      {/* Analyse du cashflow */}
      {annualCashflow < 0 ? (
        <Paper
          variant="outlined"
          sx={{ p: 2, mt: 3, bgcolor: 'error.light', borderColor: 'error.main' }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Analyse du cashflow négatif
          </Typography>
          <Typography variant="body2">
            Le cashflow est négatif à {formatNumberWithSpaces(summary.cashflowPerUnit)} $ par unité par mois.
            Pour atteindre l'objectif de 75$ par unité par mois, vous devez:
          </Typography>
          <Box component="ul" sx={{ mt: 1 }}>
            <Typography component="li" variant="body2">
              Augmenter les revenus mensuels de {formatNumberWithSpaces(Math.abs(summary.cashflowPerUnit - 75) * summary.units)} $ (ex: augmentation des loyers, revenus additionnels)
            </Typography>
            <Typography component="li" variant="body2">
              Réduire les dépenses mensuelles de {formatNumberWithSpaces(Math.abs(summary.cashflowPerUnit - 75) * summary.units)} $
            </Typography>
            <Typography component="li" variant="body2">
              Renégocier le financement pour réduire les paiements mensuels
            </Typography>
            <Typography component="li" variant="body2">
              Négocier un prix d'achat inférieur de {formatNumberWithSpaces(Math.abs(summary.cashflowPerUnit - 75) * summary.units * 12 * 10)} $ (approximation)
            </Typography>
          </Box>
        </Paper>
      ) : (
        summary.cashflowPerUnit < 75 && (
          <Paper
            variant="outlined"
            sx={{ p: 2, mt: 3, bgcolor: 'warning.light', borderColor: 'warning.main' }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Optimisation du cashflow
            </Typography>
            <Typography variant="body2">
              Le cashflow actuel est de {formatNumberWithSpaces(summary.cashflowPerUnit)} $ par unité par mois.
              Pour atteindre l'objectif de 75$ par unité par mois, vous devez:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <Typography component="li" variant="body2">
                Augmenter les revenus mensuels de {formatNumberWithSpaces((75 - summary.cashflowPerUnit) * summary.units)} $ (ex: augmentation des loyers, revenus additionnels)
              </Typography>
              <Typography component="li" variant="body2">
                Réduire les dépenses mensuelles de {formatNumberWithSpaces((75 - summary.cashflowPerUnit) * summary.units)} $
              </Typography>
            </Box>
          </Paper>
        )
      )}
    </Paper>
  );
};

export default CashflowBreakdown;