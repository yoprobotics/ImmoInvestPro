import React, { useState } from 'react';
import { 
  Paper, Typography, Box, Divider, Grid, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, ToggleButton, ToggleButtonGroup,
  Tooltip, IconButton, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { formatNumberWithSpaces } from '../../../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

/**
 * Composant affichant la décomposition détaillée du cashflow
 * @param {Object} results - Résultats du calcul
 */
const CashflowBreakdown = ({ results }) => {
  if (!results) return null;
  
  const { details } = results;
  const [timeframe, setTimeframe] = useState('monthly');
  
  // Conversion en fonction de la période choisie
  const multiplier = timeframe === 'monthly' ? 1 : 12;
  
  // Gestion du changement de période
  const handleTimeframeChange = (event, newTimeframe) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };
  
  // Préparation des données pour le graphique des revenus
  const revenueData = [];
  
  if (details.revenueDetails) {
    // Revenus de loyer
    revenueData.push({
      name: 'Loyers',
      value: details.revenueDetails.totalMonthlyUnitRevenue * multiplier,
      color: '#4CAF50'
    });
    
    // Revenus additionnels s'ils existent
    if (details.revenueDetails.totalMonthlyAdditionalRevenue > 0) {
      revenueData.push({
        name: 'Revenus add.',
        value: details.revenueDetails.totalMonthlyAdditionalRevenue * multiplier,
        color: '#8BC34A'
      });
    }
  }
  
  // Préparation des données pour le graphique des dépenses
  const expenseData = [];
  
  if (details.expenseDetails) {
    // Groupement des catégories de dépenses
    const expenseCategories = details.expenseDetails.categories;
    
    // Ajout des catégories avec des valeurs non nulles
    if (expenseCategories) {
      // Taxes
      const taxes = (expenseCategories.municipalTaxes?.annualAmount || 0) + 
                   (expenseCategories.schoolTaxes?.annualAmount || 0);
      
      if (taxes > 0) {
        expenseData.push({
          name: 'Taxes',
          value: taxes / (timeframe === 'monthly' ? 12 : 1),
          color: '#F44336'
        });
      }
      
      // Services publics
      const utilities = (expenseCategories.electricity?.annualAmount || 0) + 
                       (expenseCategories.heating?.annualAmount || 0) + 
                       (expenseCategories.water?.annualAmount || 0);
      
      if (utilities > 0) {
        expenseData.push({
          name: 'Services',
          value: utilities / (timeframe === 'monthly' ? 12 : 1),
          color: '#FF9800'
        });
      }
      
      // Assurances
      if (expenseCategories.insurance?.annualAmount > 0) {
        expenseData.push({
          name: 'Assurances',
          value: expenseCategories.insurance.annualAmount / (timeframe === 'monthly' ? 12 : 1),
          color: '#FFEB3B'
        });
      }
      
      // Entretien
      const maintenance = (expenseCategories.maintenance?.annualAmount || 0) + 
                         (expenseCategories.janitorial?.annualAmount || 0) + 
                         (expenseCategories.snowRemoval?.annualAmount || 0) + 
                         (expenseCategories.landscaping?.annualAmount || 0) + 
                         (expenseCategories.garbage?.annualAmount || 0);
      
      if (maintenance > 0) {
        expenseData.push({
          name: 'Entretien',
          value: maintenance / (timeframe === 'monthly' ? 12 : 1),
          color: '#FF5722'
        });
      }
      
      // Gestion
      const management = (expenseCategories.management?.annualAmount || 0) + 
                        (expenseCategories.legal?.annualAmount || 0) + 
                        (expenseCategories.accounting?.annualAmount || 0);
      
      if (management > 0) {
        expenseData.push({
          name: 'Gestion',
          value: management / (timeframe === 'monthly' ? 12 : 1),
          color: '#9C27B0'
        });
      }
      
      // Autres
      const other = (expenseCategories.advertising?.annualAmount || 0) + 
                   (expenseCategories.condoFees?.annualAmount || 0) + 
                   (expenseCategories.other?.annualAmount || 0);
      
      if (other > 0) {
        expenseData.push({
          name: 'Autres',
          value: other / (timeframe === 'monthly' ? 12 : 1),
          color: '#607D8B'
        });
      }
    }
  }
  
  // Préparation des données pour le graphique du financement
  const financingData = [];
  
  if (details.financing) {
    // Prêt hypothécaire principal
    if (details.financing.firstMortgageMonthlyPayment > 0) {
      financingData.push({
        name: '1ère hypothèque',
        value: details.financing.firstMortgageMonthlyPayment * multiplier,
        color: '#3F51B5'
      });
    }
    
    // Prêt hypothécaire secondaire
    if (details.financing.secondMortgageMonthlyPayment > 0) {
      financingData.push({
        name: '2ème hypothèque',
        value: details.financing.secondMortgageMonthlyPayment * multiplier,
        color: '#2196F3'
      });
    }
    
    // Balance de vente
    if (details.financing.sellerFinancingMonthlyPayment > 0) {
      financingData.push({
        name: 'Balance de vente',
        value: details.financing.sellerFinancingMonthlyPayment * multiplier,
        color: '#03A9F4'
      });
    }
    
    // Investisseur privé
    if (details.financing.privateInvestorMonthlyPayment > 0) {
      financingData.push({
        name: 'Investisseur privé',
        value: details.financing.privateInvestorMonthlyPayment * multiplier,
        color: '#00BCD4'
      });
    }
  }
  
  // Calcul du Revenu Net d'Exploitation (RNO)
  const grossIncome = details.grossMonthlyRent * multiplier;
  const operatingExpenses = details.operatingExpenses / (timeframe === 'monthly' ? 12 : 1);
  const netOperatingIncome = grossIncome - operatingExpenses;
  
  // Calcul de la décomposition du cashflow
  const financing = details.financing ? details.financing.totalMonthlyPayment * multiplier : 0;
  const cashflow = netOperatingIncome - financing;
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Décomposition du cashflow
        </Typography>
        
        <ToggleButtonGroup
          value={timeframe}
          exclusive
          onChange={handleTimeframeChange}
          size="small"
        >
          <ToggleButton value="monthly">
            Mensuel
          </ToggleButton>
          <ToggleButton value="annual">
            Annuel
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Résumé du cashflow */}
      <Box sx={{ mb: 3 }}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Composante</TableCell>
                <TableCell align="right">Montant ({timeframe === 'monthly' ? 'mensuel' : 'annuel'})</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                    Revenu brut
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                  {formatNumberWithSpaces(grossIncome)} $
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                    Dépenses d'exploitation
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                  -{formatNumberWithSpaces(operatingExpenses)} $
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Revenu net d'exploitation (RNO)
                    <Tooltip title="Revenu brut moins les dépenses d'exploitation">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {formatNumberWithSpaces(netOperatingIncome)} $
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                    Coûts de financement
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                  -{formatNumberWithSpaces(financing)} $
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  Cashflow
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: cashflow >= 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {formatNumberWithSpaces(cashflow)} $
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Décomposition graphique */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Analyse graphique</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Graphique des revenus */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" align="center" gutterBottom>
                Revenus
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-revenue-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                  <RechartsTooltip formatter={(value) => `${formatNumberWithSpaces(value)} $`} />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            
            {/* Graphique des dépenses */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" align="center" gutterBottom>
                Dépenses
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-expense-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                  <RechartsTooltip formatter={(value) => `${formatNumberWithSpaces(value)} $`} />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            
            {/* Graphique du financement */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" align="center" gutterBottom>
                Financement
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={financingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {financingData.map((entry, index) => (
                      <Cell key={`cell-financing-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                  <RechartsTooltip formatter={(value) => `${formatNumberWithSpaces(value)} $`} />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Détail des coûts de financement */}
      {details.financing && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Détail des coûts de financement</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell align="right">Capital</TableCell>
                    <TableCell align="right">Intérêts</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Prêt hypothécaire principal */}
                  {details.financing.firstMortgageMonthlyPayment > 0 && (
                    <TableRow>
                      <TableCell>1ère hypothèque</TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.firstMortgageMonthlyPrincipal * multiplier)} $
                      </TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.firstMortgageMonthlyInterest * multiplier)} $
                      </TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.firstMortgageMonthlyPayment * multiplier)} $
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* Prêt hypothécaire secondaire */}
                  {details.financing.secondMortgageMonthlyPayment > 0 && (
                    <TableRow>
                      <TableCell>2ème hypothèque</TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.secondMortgageMonthlyPrincipal * multiplier)} $
                      </TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.secondMortgageMonthlyInterest * multiplier)} $
                      </TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.secondMortgageMonthlyPayment * multiplier)} $
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* Balance de vente */}
                  {details.financing.sellerFinancingMonthlyPayment > 0 && (
                    <TableRow>
                      <TableCell>Balance de vente</TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.sellerFinancingMonthlyPrincipal * multiplier)} $
                      </TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.sellerFinancingMonthlyInterest * multiplier)} $
                      </TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.sellerFinancingMonthlyPayment * multiplier)} $
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* Investisseur privé */}
                  {details.financing.privateInvestorMonthlyPayment > 0 && (
                    <TableRow>
                      <TableCell>Investisseur privé</TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.privateInvestorMonthlyPrincipal * multiplier)} $
                      </TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.privateInvestorMonthlyInterest * multiplier)} $
                      </TableCell>
                      <TableCell align="right">
                        {formatNumberWithSpaces(details.financing.privateInvestorMonthlyPayment * multiplier)} $
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* Totaux */}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatNumberWithSpaces(details.financing.totalMonthlyPrincipal * multiplier)} $
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatNumberWithSpaces(details.financing.totalMonthlyInterest * multiplier)} $
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatNumberWithSpaces(details.financing.totalMonthlyPayment * multiplier)} $
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
};

export default CashflowBreakdown;