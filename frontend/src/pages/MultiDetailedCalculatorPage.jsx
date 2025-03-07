import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Paper, Tabs, Tab, Button, Alert } from '@mui/material';
import { Save as SaveIcon, Calculate as CalculateIcon, Clear as ClearIcon } from '@mui/icons-material';

// Import des composants du calculateur
import PropertyInfoForm from '../components/calculators/multi/PropertyInfoForm';
import RevenueForm from '../components/calculators/multi/RevenueForm';
import ExpenseForm from '../components/calculators/multi/ExpenseForm';
import FinancingForm from '../components/calculators/multi/FinancingForm';
import ResultsSummary from '../components/calculators/multi/ResultsSummary';
import FinancialIndicators from '../components/calculators/multi/FinancialIndicators';
import CashflowBreakdown from '../components/calculators/multi/CashflowBreakdown';
import AmortizationChart from '../components/calculators/multi/AmortizationChart';

/**
 * Page principale du calculateur détaillé MULTI
 * Permet la saisie des données et l'affichage des résultats
 */
const MultiDetailedCalculatorPage = () => {
  // État pour gérer les différentes sections du formulaire
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // États pour stocker les données du formulaire
  const [propertyInfo, setPropertyInfo] = useState({
    purchasePrice: 0,
    numberOfUnits: 0,
    address: '',
    city: '',
    province: '',
    postalCode: '',
    propertyType: 'residential',
    constructionYear: ''
  });
  
  const [revenueData, setRevenueData] = useState({
    units: [],
    additionalRevenues: [],
    vacancyRate: 5 // 5% par défaut
  });
  
  const [expenseData, setExpenseData] = useState({
    municipalTaxes: 0,
    schoolTaxes: 0,
    insurance: 0,
    electricity: 0,
    heating: 0,
    water: 0,
    maintenance: 0,
    management: 0,
    janitorial: 0,
    snowRemoval: 0,
    landscaping: 0,
    garbage: 0,
    legal: 0,
    accounting: 0,
    advertising: 0,
    condoFees: 0,
    other: 0
  });
  
  const [financingData, setFinancingData] = useState({
    firstMortgage: {
      loanToValue: 75,
      interestRate: 4.5,
      amortizationYears: 25,
      term: 5,
      prepaymentPrivileges: 15,
      paymentFrequency: 'monthly'
    },
    secondMortgage: null,
    sellerFinancing: null,
    privateInvestor: null,
    personalCashAmount: 0,
    additionalEquityAmount: 0
  });
  
  // État pour stocker les résultats du calculateur
  const [calculationResults, setCalculationResults] = useState(null);
  
  // Gestion des changements d'onglets
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Fonction pour calculer les résultats
  const calculateResults = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Préparation des données pour l'API
      const requestData = {
        purchasePrice: propertyInfo.purchasePrice,
        revenueDetails: revenueData,
        expenseDetails: expenseData,
        financing: financingData,
        renovationCost: 0, // Peut être ajouté plus tard
        acquisitionCosts: {}, // Peut être ajouté plus tard
      };
      
      // Appel à l'API pour le calcul
      const response = await fetch('/api/calculators/multi/detailed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur de calcul. Veuillez vérifier vos données.');
      }
      
      const results = await response.json();
      setCalculationResults(results);
      setSuccess('Calcul réussi !');
      
      // Passer automatiquement à l'onglet des résultats
      setActiveTab(4);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors du calcul.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les champs ?')) {
      setPropertyInfo({
        purchasePrice: 0,
        numberOfUnits: 0,
        address: '',
        city: '',
        province: '',
        postalCode: '',
        propertyType: 'residential',
        constructionYear: ''
      });
      
      setRevenueData({
        units: [],
        additionalRevenues: [],
        vacancyRate: 5
      });
      
      setExpenseData({
        municipalTaxes: 0,
        schoolTaxes: 0,
        insurance: 0,
        electricity: 0,
        heating: 0,
        water: 0,
        maintenance: 0,
        management: 0,
        janitorial: 0,
        snowRemoval: 0,
        landscaping: 0,
        garbage: 0,
        legal: 0,
        accounting: 0,
        advertising: 0,
        condoFees: 0,
        other: 0
      });
      
      setFinancingData({
        firstMortgage: {
          loanToValue: 75,
          interestRate: 4.5,
          amortizationYears: 25,
          term: 5,
          prepaymentPrivileges: 15,
          paymentFrequency: 'monthly'
        },
        secondMortgage: null,
        sellerFinancing: null,
        privateInvestor: null,
        personalCashAmount: 0,
        additionalEquityAmount: 0
      });
      
      setCalculationResults(null);
      setActiveTab(0);
      setSuccess('Le formulaire a été réinitialisé.');
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calculateur détaillé de rendement MULTI 5.1
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Analyse approfondie pour immeubles à revenus
      </Typography>
      
      {/* Messages d'erreur et de succès */}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}
      
      <Paper sx={{ p: 2, mt: 3 }}>
        {/* Navigation par onglets */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="Informations de base" />
          <Tab label="Revenus" />
          <Tab label="Dépenses" />
          <Tab label="Financement" />
          <Tab label="Résultats" disabled={!calculationResults} />
        </Tabs>
        
        {/* Boutons d'action */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />}
            onClick={resetForm}
            sx={{ mr: 1 }}
          >
            Réinitialiser
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CalculateIcon />}
            onClick={calculateResults}
            disabled={isLoading}
          >
            Calculer
          </Button>
        </Box>
        
        {/* Formulaires par onglet */}
        {activeTab === 0 && (
          <PropertyInfoForm 
            propertyInfo={propertyInfo}
            setPropertyInfo={setPropertyInfo}
          />
        )}
        
        {activeTab === 1 && (
          <RevenueForm 
            revenueData={revenueData}
            setRevenueData={setRevenueData}
            numberOfUnits={propertyInfo.numberOfUnits}
          />
        )}
        
        {activeTab === 2 && (
          <ExpenseForm 
            expenseData={expenseData}
            setExpenseData={setExpenseData}
          />
        )}
        
        {activeTab === 3 && (
          <FinancingForm 
            financingData={financingData}
            setFinancingData={setFinancingData}
            purchasePrice={propertyInfo.purchasePrice}
          />
        )}
        
        {activeTab === 4 && calculationResults && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ResultsSummary results={calculationResults} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FinancialIndicators results={calculationResults} />
            </Grid>
            <Grid item xs={12} md={8}>
              <CashflowBreakdown results={calculationResults} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AmortizationChart results={calculationResults} />
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default MultiDetailedCalculatorPage;