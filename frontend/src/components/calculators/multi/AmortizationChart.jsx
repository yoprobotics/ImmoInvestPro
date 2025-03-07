import React, { useState } from 'react';
import { 
  Paper, Typography, Box, Divider, 
  ToggleButtonGroup, ToggleButton,
  Tab, Tabs
} from '@mui/material';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant les graphiques d'amortissement du prêt
 * @param {Object} results - Résultats du calcul
 */
const AmortizationChart = ({ results }) => {
  const [chartType, setChartType] = useState('bar');
  const [tabValue, setTabValue] = useState(0);
  
  if (!results || !results.details || !results.details.financing) return null;
  
  const { details } = results;
  
  // Changement de type de graphique
  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };
  
  // Changement de l'onglet (année vs mois)
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Récupérer les données d'amortissement
  const firstYearMonths = details.amortizationFirstYear?.months || [];
  
  // Préparer les données pour le graphique mensuel
  const monthlyData = firstYearMonths.map((month) => ({
    name: `Mois ${month.month}`,
    intérêt: month.firstMortgage?.interestPayment || 0,
    capital: month.firstMortgage?.principalPayment || 0,
    paiement: month.firstMortgage?.payment || 0,
    solde: month.firstMortgage?.balance || 0
  }));
  
  // Préparer les données pour le graphique annuel (projection sur 5 ans)
  const annualData = Array.from({ length: 5 }).map((_, index) => {
    const year = index + 1;
    // Décroissance du solde basée sur l'amortissement
    let solde = details.financing.firstMortgageAmount;
    let intérêt = 0;
    let capital = 0;
    
    // Calculer le solde restant basé sur l'année
    if (details.financing.firstMortgageMonthlyPrincipal > 0) {
      // Simuler l'amortissement pour l'année
      const annualPrincipal = details.financing.firstMortgageMonthlyPrincipal * 12;
      solde = details.financing.firstMortgageAmount - (annualPrincipal * year);
      // Prévenir les valeurs négatives
      solde = Math.max(0, solde);
      
      // Estimer l'intérêt et le capital pour cette année
      capital = Math.min(annualPrincipal, details.financing.firstMortgageAmount - (annualPrincipal * (year - 1)));
      intérêt = details.financing.firstMortgageMonthlyPayment * 12 - capital;
    }
    
    return {
      name: `Année ${year}`,
      intérêt: intérêt,
      capital: capital,
      paiement: details.financing.firstMortgageMonthlyPayment * 12,
      solde: solde
    };
  });
  
  // Déterminer quelles données utiliser selon l'onglet
  const chartData = tabValue === 0 ? monthlyData : annualData;
  
  // Formatage des valeurs pour le tooltip du graphique
  const formatTooltipValue = (value) => {
    return `${formatNumberWithSpaces(value)} $`;
  };
  
  // Rendu du graphique selon le type sélectionné
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatTooltipValue(value), null]}
              />
              <Legend />
              <Bar dataKey="intérêt" stackId="a" fill="#ff9800" />
              <Bar dataKey="capital" stackId="a" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatTooltipValue(value), null]}
              />
              <Legend />
              <Line type="monotone" dataKey="solde" stroke="#2196f3" strokeWidth={2} />
              <Line type="monotone" dataKey="paiement" stroke="#9c27b0" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatTooltipValue(value), null]}
              />
              <Legend />
              <Area type="monotone" dataKey="intérêt" stackId="1" stroke="#ff9800" fill="#ff9800" />
              <Area type="monotone" dataKey="capital" stackId="1" stroke="#4caf50" fill="#4caf50" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Amortissement du prêt
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="1ère année (mensuel)" />
          <Tab label="Projection 5 ans" />
        </Tabs>
        
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="bar">Barres</ToggleButton>
          <ToggleButton value="line">Lignes</ToggleButton>
          <ToggleButton value="area">Aires</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {renderChart()}
      
      {/* Résumé de l'amortissement */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Résumé de l'amortissement
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Montant du prêt:
            </Typography>
            <Typography variant="body1">
              {formatNumberWithSpaces(details.financing.firstMortgageAmount)} $
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Paiement mensuel:
            </Typography>
            <Typography variant="body1">
              {formatNumberWithSpaces(details.financing.firstMortgageMonthlyPayment)} $
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Taux d'intérêt:
            </Typography>
            <Typography variant="body1">
              {details.financing.firstMortgageMonthlyInterest * 12 * 100 / details.financing.firstMortgageAmount || 0}%
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Remboursement annuel:
            </Typography>
            <Typography variant="body1">
              {formatNumberWithSpaces(details.financing.firstMortgageMonthlyPayment * 12)} $
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Première année:
          </Typography>
          <Typography variant="body2">
            Capital remboursé: {formatNumberWithSpaces(details.amortizationFirstYear?.totalPrincipal || 0)} $
          </Typography>
          <Typography variant="body2">
            Intérêts payés: {formatNumberWithSpaces(details.amortizationFirstYear?.totalInterest || 0)} $
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AmortizationChart;