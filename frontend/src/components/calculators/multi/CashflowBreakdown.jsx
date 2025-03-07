import React, { useState } from 'react';
import { 
  Paper, Typography, Box, Divider, Grid, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, ToggleButtonGroup, 
  ToggleButton, Card, CardContent
} from '@mui/material';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Legend
} from 'recharts';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant la décomposition du cashflow
 * @param {Object} results - Résultats du calcul
 */
const CashflowBreakdown = ({ results }) => {
  const [view, setView] = useState('monthly');
  
  if (!results) return null;
  
  const { summary, details } = results;
  
  // Changement de vue (mensuel/annuel)
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };
  
  // Facteur de conversion selon la vue
  const factor = view === 'monthly' ? 1 : 12;
  
  // Formater le montant selon la vue
  const formatAmount = (amount) => {
    const value = view === 'monthly' ? amount / 12 : amount;
    return formatNumberWithSpaces(value);
  };
  
  // Décomposition des revenus pour le graphique
  const revenueBreakdown = [
    { name: 'Loyers', value: details.revenueDetails.totalMonthlyUnitRevenue * factor },
    { name: 'Additionnels', value: details.revenueDetails.totalMonthlyAdditionalRevenue * factor }
  ].filter(item => item.value > 0);
  
  // Décomposition des dépenses pour le graphique
  const expenseCategories = details.expenseDetails.categories;
  const expenseBreakdown = Object.entries(expenseCategories)
    .map(([key, data]) => ({
      name: getCategoryLabel(key),
      value: view === 'monthly' ? data.monthlyAmount : data.annualAmount
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
  
  // Décomposition du financement pour le graphique
  const financingBreakdown = [
    { name: 'Principal', value: details.financing.totalMonthlyPrincipal * factor },
    { name: 'Intérêts', value: details.financing.totalMonthlyInterest * factor }
  ];
  
  // Couleurs pour les graphiques
  const COLORS = {
    revenue: ['#4CAF50', '#8BC34A', '#CDDC39'],
    expense: ['#F44336', '#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#9C27B0', '#673AB7'],
    financing: ['#2196F3', '#03A9F4', '#00BCD4']
  };
  
  // Fonction pour obtenir le libellé d'une catégorie de dépense
  function getCategoryLabel(category) {
    const labels = {
      municipalTaxes: 'Taxes municipales',
      schoolTaxes: 'Taxes scolaires',
      insurance: 'Assurances',
      electricity: 'Électricité',
      heating: 'Chauffage',
      water: 'Eau',
      maintenance: 'Entretien',
      management: 'Gestion',
      janitorial: 'Conciergerie',
      snowRemoval: 'Déneigement',
      landscaping: 'Aménagement',
      garbage: 'Ordures',
      legal: 'Frais juridiques',
      accounting: 'Comptabilité',
      advertising: 'Publicité',
      condo: 'Frais condo',
      other: 'Autres'
    };
    return labels[category] || category;
  }
  
  // Rendu d'un graphique en camembert
  const renderPieChart = (data, colors) => {
    if (!data || data.length === 0) return null;
    
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          <RechartsTooltip 
            formatter={(value) => [`${formatNumberWithSpaces(value)} $`, null]}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Décomposition du cashflow
        </Typography>
        
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          <ToggleButton value="monthly">Mensuel</ToggleButton>
          <ToggleButton value="annual">Annuel</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Tableau récapitulatif du cashflow */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell colSpan={2}>
                <Typography variant="subtitle2">
                  Calcul du cashflow ({view === 'monthly' ? 'mensuel' : 'annuel'})
                </Typography>
              </TableCell>
              <TableCell align="right">Montant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Revenus */}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="body2" color="primary.main" fontWeight="bold">
                  Revenus bruts
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="primary.main" fontWeight="bold">
                  {formatAmount(details.grossAnnualRent)} $
                </Typography>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell width="5%"></TableCell>
              <TableCell>Loyers</TableCell>
              <TableCell align="right">
                {formatAmount(details.revenueDetails.totalMonthlyUnitRevenue * 12)} $
              </TableCell>
            </TableRow>
            
            {details.revenueDetails.totalMonthlyAdditionalRevenue > 0 && (
              <TableRow>
                <TableCell width="5%"></TableCell>
                <TableCell>Revenus additionnels</TableCell>
                <TableCell align="right">
                  {formatAmount(details.revenueDetails.totalMonthlyAdditionalRevenue * 12)} $
                </TableCell>
              </TableRow>
            )}
            
            {/* Dépenses */}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  Dépenses d'exploitation
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  {formatAmount(details.operatingExpenses)} $
                </Typography>
              </TableCell>
            </TableRow>
            
            {/* Principales dépenses (top 5) */}
            {Object.entries(expenseCategories)
              .sort((a, b) => b[1].annualAmount - a[1].annualAmount)
              .slice(0, 5)
              .map(([category, data], index) => (
                <TableRow key={category}>
                  <TableCell width="5%"></TableCell>
                  <TableCell>{getCategoryLabel(category)}</TableCell>
                  <TableCell align="right">
                    {view === 'monthly' ? formatNumberWithSpaces(data.monthlyAmount) : formatNumberWithSpaces(data.annualAmount)} $
                  </TableCell>
                </TableRow>
              ))}
            
            {/* Revenu net d'exploitation */}
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell colSpan={2}>
                <Typography variant="body2" fontWeight="bold">
                  Revenu net d'exploitation (RNO)
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold">
                  {formatAmount(details.netOperatingIncome)} $
                </Typography>
              </TableCell>
            </TableRow>
            
            {/* Financement */}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="body2" color="info.main" fontWeight="bold">
                  Paiements financiers
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="info.main" fontWeight="bold">
                  {formatAmount(details.financing.totalAnnualPayment)} $
                </Typography>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell width="5%"></TableCell>
              <TableCell>Hypothèque principale</TableCell>
              <TableCell align="right">
                {formatAmount(details.financing.firstMortgageMonthlyPayment * 12)} $
              </TableCell>
            </TableRow>
            
            {details.financing.secondMortgageMonthlyPayment > 0 && (
              <TableRow>
                <TableCell width="5%"></TableCell>
                <TableCell>Hypothèque secondaire</TableCell>
                <TableCell align="right">
                  {formatAmount(details.financing.secondMortgageMonthlyPayment * 12)} $
                </TableCell>
              </TableRow>
            )}
            
            {details.financing.sellerFinancingMonthlyPayment > 0 && (
              <TableRow>
                <TableCell width="5%"></TableCell>
                <TableCell>Balance de vente</TableCell>
                <TableCell align="right">
                  {formatAmount(details.financing.sellerFinancingMonthlyPayment * 12)} $
                </TableCell>
              </TableRow>
            )}
            
            {details.financing.privateInvestorMonthlyPayment > 0 && (
              <TableRow>
                <TableCell width="5%"></TableCell>
                <TableCell>Investisseur privé</TableCell>
                <TableCell align="right">
                  {formatAmount(details.financing.privateInvestorMonthlyPayment * 12)} $
                </TableCell>
              </TableRow>
            )}
            
            {/* Cashflow final */}
            <TableRow sx={{ bgcolor: summary.monthlyCashflow >= 0 ? 'success.light' : 'error.light' }}>
              <TableCell colSpan={2}>
                <Typography variant="subtitle2">
                  Cashflow
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" color={summary.monthlyCashflow >= 0 ? 'success.main' : 'error.main'}>
                  {formatAmount(details.annualCashflow)} $
                </Typography>
              </TableCell>
            </TableRow>
            
            {/* Par porte */}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="body2">
                  Cashflow par porte {view === 'monthly' ? '(mensuel)' : '(annuel)'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography 
                  variant="body2"
                  color={summary.cashflowPerUnit >= 75 ? 'success.main' : 
                        summary.cashflowPerUnit >= 0 ? 'warning.main' : 'error.main'}
                >
                  {view === 'monthly' ? 
                    formatNumberWithSpaces(summary.cashflowPerUnit) : 
                    formatNumberWithSpaces(summary.cashflowPerUnit * 12)} $ / porte
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Graphiques */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" align="center" gutterBottom>
                Revenus
              </Typography>
              {renderPieChart(revenueBreakdown, COLORS.revenue)}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" align="center" gutterBottom>
                Dépenses
              </Typography>
              {renderPieChart(expenseBreakdown.slice(0, 6), COLORS.expense)}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" align="center" gutterBottom>
                Financement
              </Typography>
              {renderPieChart(financingBreakdown, COLORS.financing)}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CashflowBreakdown;