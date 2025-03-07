import React, { useState } from 'react';
import { 
  Container, Typography, Box, Stepper, Step, StepLabel,
  Paper, Grid, Button
} from '@mui/material';
import { ArrowBack, ArrowForward, Check, Save } from '@mui/icons-material';

/**
 * Calculateur détaillé pour les immeubles MULTI (à revenus)
 * Basé sur le calculateur de rendement MULTI 5.1 de la formation "Secrets de l'immobilier"
 */
const MultiDetailedCalculator = () => {
  // États pour gérer les étapes et les données du calculateur
  const [activeStep, setActiveStep] = useState(0);
  const [propertyData, setPropertyData] = useState({
    // Informations de base
    address: '',
    units: 0,
    price: 0,
    
    // Revenus
    grossRevenue: 0,
    otherRevenue: 0,
    
    // Dépenses
    expenses: {
      municipalTaxes: 0,
      schoolTaxes: 0,
      insurance: 0,
      electricity: 0,
      heating: 0,
      maintenance: 0,
      management: 0,
      snow: 0,
      lawn: 0,
      other: 0
    },
    
    // Financement
    financing: {
      downPayment: 0,
      downPaymentPercentage: 20,
      loanAmount: 0,
      interestRate: 5,
      amortizationYears: 25,
      term: 5
    },
    
    // Financement créatif
    creativeFinancing: {
      enabled: false,
      vendorBalance: 0,
      vendorBalanceRate: 6,
      privateInvestor: 0,
      privateInvestorRate: 8
    }
  });
  
  // Étapes du calculateur
  const steps = [
    'Informations de base',
    'Revenus',
    'Dépenses',
    'Financement',
    'Résultats'
  ];
  
  // Fonctions pour naviguer entre les étapes
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
  };
  
  // Fonction pour mettre à jour les données de la propriété
  const updatePropertyData = (section, field, value) => {
    if (section) {
      setPropertyData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setPropertyData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  // Calculer les résultats financiers
  const calculateResults = () => {
    // Total des revenus
    const totalRevenue = propertyData.grossRevenue + propertyData.otherRevenue;
    
    // Total des dépenses
    const totalExpenses = Object.values(propertyData.expenses).reduce((sum, value) => sum + value, 0);
    
    // Revenu net d'opération (RNO)
    const netOperatingIncome = totalRevenue - totalExpenses;
    
    // Calcul du paiement hypothécaire
    const monthlyInterestRate = propertyData.financing.interestRate / 100 / 12;
    const numberOfPayments = propertyData.financing.amortizationYears * 12;
    const loanAmount = propertyData.price * (1 - propertyData.financing.downPaymentPercentage / 100);
    
    let monthlyPayment = 0;
    if (monthlyInterestRate > 0) {
      monthlyPayment = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numberOfPayments;
    }
    
    const annualPayment = monthlyPayment * 12;
    
    // Cashflow annuel
    const annualCashflow = netOperatingIncome - annualPayment;
    
    // Cashflow mensuel par porte
    const monthlyCashflowPerUnit = propertyData.units > 0 ? annualCashflow / propertyData.units / 12 : 0;
    
    // Taux de rendement global
    const totalInvestment = propertyData.price * (propertyData.financing.downPaymentPercentage / 100);
    const returnRate = totalInvestment > 0 ? (annualCashflow / totalInvestment) * 100 : 0;
    
    // Multiplicateur de revenu brut (MRB)
    const grossRevenuMultiplier = propertyData.grossRevenue > 0 ? propertyData.price / propertyData.grossRevenue : 0;
    
    // Ratio de couverture de la dette (DCR)
    const debtCoverageRatio = annualPayment > 0 ? netOperatingIncome / annualPayment : 0;
    
    return {
      totalRevenue,
      totalExpenses,
      netOperatingIncome,
      annualPayment,
      annualCashflow,
      monthlyCashflowPerUnit,
      returnRate,
      grossRevenuMultiplier,
      debtCoverageRatio
    };
  };
  
  // Composants pour chaque étape
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations de base de l'immeuble
            </Typography>
            {/* Formulaire pour les informations de base */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Cette section sera implémentée avec un formulaire pour les informations de base de l'immeuble.
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenus de l'immeuble
            </Typography>
            {/* Formulaire pour les revenus */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Cette section sera implémentée avec un formulaire pour saisir les revenus de l'immeuble.
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dépenses d'exploitation
            </Typography>
            {/* Formulaire pour les dépenses */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Cette section sera implémentée avec un formulaire pour saisir les dépenses d'exploitation.
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Options de financement
            </Typography>
            {/* Formulaire pour le financement */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Cette section sera implémentée avec un formulaire pour configurer les options de financement.
            </Typography>
          </Box>
        );
      case 4:
        const results = calculateResults();
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Résultats de l'analyse
            </Typography>
            
            {/* Affichage des résultats */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Revenus et dépenses
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Revenus totaux:</Typography>
                    <Typography variant="body2">{results.totalRevenue.toLocaleString()} $</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Dépenses totales:</Typography>
                    <Typography variant="body2">{results.totalExpenses.toLocaleString()} $</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">Revenu net d'opération (RNO):</Typography>
                    <Typography variant="body2" fontWeight="bold">{results.netOperatingIncome.toLocaleString()} $</Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Cashflow et rendement
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Paiement hypothécaire annuel:</Typography>
                    <Typography variant="body2">{results.annualPayment.toLocaleString()} $</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">Cashflow annuel:</Typography>
                    <Typography variant="body2" fontWeight="bold">{results.annualCashflow.toLocaleString()} $</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">Cashflow mensuel par porte:</Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color={results.monthlyCashflowPerUnit >= 75 ? 'success.main' : 'error.main'}
                    >
                      {results.monthlyCashflowPerUnit.toFixed(2)} $
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Indicateurs de performance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="body2">Taux de rendement global</Typography>
                        <Typography variant="h6">{results.returnRate.toFixed(2)}%</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="body2">Multiplicateur de revenu brut (MRB)</Typography>
                        <Typography variant="h6">{results.grossRevenuMultiplier.toFixed(2)}x</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="body2">Ratio de couverture de la dette</Typography>
                        <Typography variant="h6">{results.debtCoverageRatio.toFixed(2)}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calculateur MULTI détaillé
      </Typography>
      <Typography variant="body1" paragraph>
        Analysez en détail la rentabilité de votre immeuble à revenus. Calculez le cashflow par porte,
        le rendement global et obtenez toutes les métriques essentielles pour prendre une décision d'investissement éclairée.
      </Typography>
      
      {/* Stepper pour les étapes du calculateur */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Contenu de l'étape actuelle */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        {renderStep()}
      </Paper>
      
      {/* Boutons de navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Précédent
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<Save />}
              sx={{ mr: 1 }}
            >
              Enregistrer
            </Button>
          ) : null}
          {activeStep === steps.length - 1 ? (
            <Button 
              onClick={handleReset}
              variant="outlined"
            >
              Nouveau calcul
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              endIcon={<ArrowForward />}
            >
              Suivant
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default MultiDetailedCalculator;
