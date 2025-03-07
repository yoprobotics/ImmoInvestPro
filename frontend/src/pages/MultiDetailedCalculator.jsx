import React, { useState } from 'react';
import { 
  Container, Typography, Box, Stepper, Step, StepLabel,
  Paper, Grid, Button
} from '@mui/material';
import { ArrowBack, ArrowForward, Check, Save } from '@mui/icons-material';

// Importation des composants de formulaire
import PropertyInfoForm from '../components/calculators/multi/PropertyInfoForm';
import RevenueForm from '../components/calculators/multi/RevenueForm';
import ExpensesForm from '../components/calculators/multi/ExpensesForm';
import FinancingForm from '../components/calculators/multi/FinancingForm';
import ResultsAnalysis from '../components/calculators/multi/ResultsAnalysis';

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
    yearBuilt: 0,
    buildingType: '',
    landArea: 0,
    livingArea: 0,
    parkingSpaces: 0,
    zoning: '',
    notes: '',
    
    // Revenus
    grossRevenue: 0,
    otherRevenue: 0,
    unitDetails: [],
    otherRevenues: {
      parking: 0,
      laundry: 0,
      storage: 0,
      other: 0
    },
    
    // Dépenses
    expenses: {
      municipalTaxes: 0,
      schoolTaxes: 0,
      insurance: 0,
      electricity: 0,
      heating: 0,
      water: 0,
      maintenance: 0,
      management: 0,
      snow: 0,
      lawn: 0,
      vacancy: 0,
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
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tous les champs et commencer un nouveau calcul?")) {
      setActiveStep(0);
      setPropertyData({
        // Réinitialisation des valeurs
        address: '',
        units: 0,
        price: 0,
        yearBuilt: 0,
        buildingType: '',
        landArea: 0,
        livingArea: 0,
        parkingSpaces: 0,
        zoning: '',
        notes: '',
        grossRevenue: 0,
        otherRevenue: 0,
        unitDetails: [],
        otherRevenues: {
          parking: 0,
          laundry: 0,
          storage: 0,
          other: 0
        },
        expenses: {
          municipalTaxes: 0,
          schoolTaxes: 0,
          insurance: 0,
          electricity: 0,
          heating: 0,
          water: 0,
          maintenance: 0,
          management: 0,
          snow: 0,
          lawn: 0,
          vacancy: 0,
          other: 0
        },
        financing: {
          downPayment: 0,
          downPaymentPercentage: 20,
          loanAmount: 0,
          interestRate: 5,
          amortizationYears: 25,
          term: 5
        },
        creativeFinancing: {
          enabled: false,
          vendorBalance: 0,
          vendorBalanceRate: 6,
          privateInvestor: 0,
          privateInvestorRate: 8
        }
      });
    }
  };
  
  // Fonction pour enregistrer le projet
  const handleSave = () => {
    // Cette fonctionnalité sera implémentée plus tard avec la gestion des utilisateurs
    alert("Cette fonctionnalité sera disponible dans une prochaine version!");
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
  
  // Composants pour chaque étape
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <PropertyInfoForm 
              propertyData={propertyData} 
              updatePropertyData={updatePropertyData} 
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <RevenueForm 
              propertyData={propertyData} 
              updatePropertyData={updatePropertyData} 
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <ExpensesForm 
              propertyData={propertyData} 
              updatePropertyData={updatePropertyData} 
            />
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <FinancingForm 
              propertyData={propertyData} 
              updatePropertyData={updatePropertyData} 
            />
          </Box>
        );
      case 4:
        return (
          <Box sx={{ p: 3 }}>
            <ResultsAnalysis 
              propertyData={propertyData} 
            />
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
              onClick={handleSave}
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
              {activeStep === steps.length - 2 ? 'Voir les résultats' : 'Suivant'}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default MultiDetailedCalculator;
