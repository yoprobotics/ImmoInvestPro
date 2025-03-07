import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Divider, 
  Box, 
  Button, 
  TextField, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  Alert,
  LinearProgress,
  InputAdornment
} from '@mui/material';
import { 
  Home as HomeIcon, 
  AttachMoney as MoneyIcon, 
  Build as BuildIcon, 
  Assessment as AssessmentIcon,
  EventNote as EventIcon,
  Save as SaveIcon,
  PictureAsPdf as PdfIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { FlipCalculatorService } from '../../services/FlipCalculatorService';

// Initialisation du service
const calculatorService = new FlipCalculatorService();

/**
 * Composant principal du calculateur FLIP
 */
const FlipCalculator = () => {
  // États pour le calculateur
  const [calculator, setCalculator] = useState(calculatorService.createNewCalculator());
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState({});
  const [isViable, setIsViable] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [napkinAnalysis, setNapkinAnalysis] = useState(null);
  const [maxOfferPrice, setMaxOfferPrice] = useState(0);

  // Options d'affichage
  const currencyFormatter = new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  const percentFormatter = new Intl.NumberFormat('fr-CA', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Effet pour valider le formulaire
  useEffect(() => {
    const isValid = 
      calculator.propertyInfo.purchasePrice > 0 &&
      calculator.propertyInfo.estimatedResaleValue > 0 &&
      calculator.propertyInfo.projectDuration > 0;
    
    setFormValid(isValid);
    
    if (isValid) {
      // Analyse rapide Napkin
      const napkinResult = calculatorService.checkNapkinViability(
        calculator.propertyInfo.estimatedResaleValue,
        calculator.propertyInfo.purchasePrice,
        calculator.calculateTotalRenovationCosts()
      );
      setNapkinAnalysis(napkinResult);
      
      // Prix d'offre maximum
      const offerPrice = calculatorService.calculateNapkinOfferPrice(
        calculator.propertyInfo.estimatedResaleValue,
        calculator.calculateTotalRenovationCosts()
      );
      setMaxOfferPrice(offerPrice);
    }
  }, [calculator]);

  // Gestionnaires d'événements
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePropertyInfoChange = (field, value) => {
    setCalculator(prevState => ({
      ...prevState,
      propertyInfo: {
        ...prevState.propertyInfo,
        [field]: value
      }
    }));
  };

  const handleAcquisitionCostsChange = (field, value) => {
    setCalculator(prevState => ({
      ...prevState,
      acquisitionCosts: {
        ...prevState.acquisitionCosts,
        [field]: value
      }
    }));
  };

  const handleFinancingChange = (field, value) => {
    setCalculator(prevState => ({
      ...prevState,
      financing: {
        ...prevState.financing,
        [field]: value
      }
    }));
  };

  const handleRenovationChange = (category, subcategory, value) => {
    setCalculator(prevState => {
      const newState = { ...prevState };
      newState.renovationBudget[category][subcategory] = value;
      return newState;
    });
  };

  const handleHoldingCostsChange = (field, value) => {
    setCalculator(prevState => ({
      ...prevState,
      holdingCosts: {
        ...prevState.holdingCosts,
        [field]: value
      }
    }));
  };

  const handleSellingCostsChange = (field, value) => {
    setCalculator(prevState => ({
      ...prevState,
      sellingCosts: {
        ...prevState.sellingCosts,
        [field]: value
      }
    }));
  };

  const calculateResults = () => {
    const newResults = calculatorService.calculateAllResults(calculator);
    setResults(newResults);
    setIsViable(calculator.isViable());
  };

  // Rendu des onglets
  const renderPropertyInfoTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations de base
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Adresse de la propriété"
          value={calculator.propertyInfo.address}
          onChange={(e) => handlePropertyInfoChange('address', e.target.value)}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Prix d'achat"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.propertyInfo.purchasePrice}
          onChange={(e) => handlePropertyInfoChange('purchasePrice', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Valeur de revente estimée"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.propertyInfo.estimatedResaleValue}
          onChange={(e) => handlePropertyInfoChange('estimatedResaleValue', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Durée estimée du projet (mois)"
          type="number"
          value={calculator.propertyInfo.projectDuration}
          onChange={(e) => handlePropertyInfoChange('projectDuration', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Frais d'acquisition
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Taxe de bienvenue"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.acquisitionCosts.welcomeTax}
          onChange={(e) => handleAcquisitionCostsChange('welcomeTax', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Frais de notaire"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.acquisitionCosts.notaryFees}
          onChange={(e) => handleAcquisitionCostsChange('notaryFees', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Frais d'inspection"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.acquisitionCosts.inspectionFees}
          onChange={(e) => handleAcquisitionCostsChange('inspectionFees', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            const welcomeTax = calculatorService.calculateWelcomeTax(calculator.propertyInfo.purchasePrice);
            const notaryFees = calculatorService.estimateNotaryFees(calculator.propertyInfo.purchasePrice);
            
            setCalculator(prevState => ({
              ...prevState,
              acquisitionCosts: {
                ...prevState.acquisitionCosts,
                welcomeTax,
                notaryFees
              }
            }));
          }}
        >
          Calculer automatiquement
        </Button>
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Financement
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Mise de fonds"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.financing.downPayment}
          onChange={(e) => handleFinancingChange('downPayment', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Taux d'intérêt annuel"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          value={calculator.financing.interestRate}
          onChange={(e) => handleFinancingChange('interestRate', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Période d'amortissement (années)"
          type="number"
          value={calculator.financing.amortization}
          onChange={(e) => handleFinancingChange('amortization', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => {
            calculatorService.updateFinancingInfo(calculator);
            setCalculator({...calculator});
          }}
        >
          Calculer le paiement hypothécaire
        </Button>
      </Grid>
      
      {napkinAnalysis && (
        <Grid item xs={12}>
          <Alert 
            severity={napkinAnalysis.isViable ? "success" : "warning"}
            sx={{ mt: 2 }}
          >
            <Typography variant="subtitle1">
              Analyse rapide (méthode Napkin FIP10):
            </Typography>
            <Typography>
              Profit estimé: {currencyFormatter.format(napkinAnalysis.estimatedProfit)}
            </Typography>
            <Typography>
              Cible minimale: {currencyFormatter.format(napkinAnalysis.profitTarget)}
            </Typography>
            <Typography>
              {napkinAnalysis.isViable 
                ? `Ce projet semble viable avec un surplus de ${currencyFormatter.format(napkinAnalysis.profitGap)}` 
                : `Ce projet risque de ne pas être assez rentable, il manque ${currencyFormatter.format(Math.abs(napkinAnalysis.profitGap))}`}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Prix d'offre maximum recommandé: {currencyFormatter.format(maxOfferPrice)}
            </Typography>
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderRenovationTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Budget de rénovation
        </Typography>
      </Grid>
      
      {/* Cuisine */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Cuisine
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Armoires"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.kitchen.cabinets}
                onChange={(e) => handleRenovationChange('kitchen', 'cabinets', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Comptoirs"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.kitchen.countertops}
                onChange={(e) => handleRenovationChange('kitchen', 'countertops', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Électroménagers"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.kitchen.appliances}
                onChange={(e) => handleRenovationChange('kitchen', 'appliances', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Plomberie"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.kitchen.plumbing}
                onChange={(e) => handleRenovationChange('kitchen', 'plumbing', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Planchers"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.kitchen.flooring}
                onChange={(e) => handleRenovationChange('kitchen', 'flooring', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Électricité"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.kitchen.electrical}
                onChange={(e) => handleRenovationChange('kitchen', 'electrical', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Peinture"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.kitchen.painting}
                onChange={(e) => handleRenovationChange('kitchen', 'painting', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Autres"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.kitchen.other}
                onChange={(e) => handleRenovationChange('kitchen', 'other', Number(e.target.value))}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      {/* Salle de bain */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Salle de bain
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Vanité"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.bathroom.vanity}
                onChange={(e) => handleRenovationChange('bathroom', 'vanity', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Toilette"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.bathroom.toilet}
                onChange={(e) => handleRenovationChange('bathroom', 'toilet', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Douche"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.bathroom.shower}
                onChange={(e) => handleRenovationChange('bathroom', 'shower', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Baignoire"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.bathroom.bathtub}
                onChange={(e) => handleRenovationChange('bathroom', 'bathtub', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Plomberie"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.bathroom.plumbing}
                onChange={(e) => handleRenovationChange('bathroom', 'plumbing', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Planchers"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.bathroom.flooring}
                onChange={(e) => handleRenovationChange('bathroom', 'flooring', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Électricité"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.bathroom.electrical}
                onChange={(e) => handleRenovationChange('bathroom', 'electrical', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Autres"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.bathroom.other}
                onChange={(e) => handleRenovationChange('bathroom', 'other', Number(e.target.value))}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      {/* Extérieur */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Extérieur
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Toiture"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.exterior.roofing}
                onChange={(e) => handleRenovationChange('exterior', 'roofing', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Revêtement"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.exterior.siding}
                onChange={(e) => handleRenovationChange('exterior', 'siding', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fenêtres"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.exterior.windows}
                onChange={(e) => handleRenovationChange('exterior', 'windows', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Portes"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.exterior.doors}
                onChange={(e) => handleRenovationChange('exterior', 'doors', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Aménagement paysager"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.exterior.landscaping}
                onChange={(e) => handleRenovationChange('exterior', 'landscaping', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Entrée"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.exterior.driveway}
                onChange={(e) => handleRenovationChange('exterior', 'driveway', Number(e.target.value))}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      {/* Contingence */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Contingence pour imprévus
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Montant de contingence"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={calculator.renovationBudget.contingency}
                onChange={(e) => handleRenovationChange('contingency', '', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => {
                  const totalReno = calculator.calculateTotalRenovationCosts() - calculator.renovationBudget.contingency;
                  const contingency = Math.round(totalReno * 0.15); // 15% de contingence
                  
                  setCalculator(prevState => ({
                    ...prevState,
                    renovationBudget: {
                      ...prevState.renovationBudget,
                      contingency
                    }
                  }));
                }}
              >
                Calculer 15% de contingence
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Total des rénovations: {currencyFormatter.format(calculator.calculateTotalRenovationCosts())}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderExpensesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Frais de possession pendant les travaux
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Paiement hypothécaire mensuel"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.holdingCosts.mortgage}
          onChange={(e) => handleHoldingCostsChange('mortgage', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Taxes foncières annuelles"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.holdingCosts.propertyTaxes}
          onChange={(e) => handleHoldingCostsChange('propertyTaxes', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Services publics mensuels"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.holdingCosts.utilities}
          onChange={(e) => handleHoldingCostsChange('utilities', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Assurance annuelle"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.holdingCosts.insurance}
          onChange={(e) => handleHoldingCostsChange('insurance', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Entretien mensuel"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.holdingCosts.maintenance}
          onChange={(e) => handleHoldingCostsChange('maintenance', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Autres frais mensuels"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.holdingCosts.otherHoldingCosts}
          onChange={(e) => handleHoldingCostsChange('otherHoldingCosts', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Frais de vente
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Commission immobilière"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.sellingCosts.realEstateCommission}
          onChange={(e) => handleSellingCostsChange('realEstateCommission', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Coûts de marketing"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.sellingCosts.marketingCosts}
          onChange={(e) => handleSellingCostsChange('marketingCosts', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Coûts de mise en valeur"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.sellingCosts.stagingCosts}
          onChange={(e) => handleSellingCostsChange('stagingCosts', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Frais juridiques"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.sellingCosts.legalFees}
          onChange={(e) => handleSellingCostsChange('legalFees', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Autres frais de vente"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={calculator.sellingCosts.otherSellingCosts}
          onChange={(e) => handleSellingCostsChange('otherSellingCosts', Number(e.target.value))}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => {
            const resaleValue = calculator.propertyInfo.estimatedResaleValue;
            const commission = Math.round(resaleValue * 0.05); // 5% de commission
            
            setCalculator(prevState => ({
              ...prevState,
              sellingCosts: {
                ...prevState.sellingCosts,
                realEstateCommission: commission
              }
            }));
          }}
        >
          Calculer commission (5%)
        </Button>
      </Grid>
    </Grid>
  );

  const renderResultsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          fullWidth
          onClick={calculateResults}
          disabled={!formValid}
        >
          Calculer les résultats
        </Button>
      </Grid>
      
      {Object.keys(results).length > 0 && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Résultats du projet FLIP
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Coûts du projet
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Prix d'achat: {currencyFormatter.format(calculator.propertyInfo.purchasePrice)}
                  </Typography>
                  <Typography variant="body1">
                    Frais d'acquisition: {currencyFormatter.format(results.totalPurchasePrice - calculator.propertyInfo.purchasePrice)}
                  </Typography>
                  <Typography variant="body1">
                    Coût total de rénovation: {currencyFormatter.format(results.totalRenovationCosts)}
                  </Typography>
                  <Typography variant="body1">
                    Frais de possession: {currencyFormatter.format(results.totalHoldingCosts)}
                  </Typography>
                  <Typography variant="body1">
                    Frais de vente: {currencyFormatter.format(results.totalSellingCosts)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h6">
                    Coût total du projet: {currencyFormatter.format(results.totalProjectCosts)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profits
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Prix de revente: {currencyFormatter.format(calculator.propertyInfo.estimatedResaleValue)}
                  </Typography>
                  <Typography variant="body1">
                    Profit brut: {currencyFormatter.format(results.grossProfit)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h6" color={isViable ? "success.main" : "error.main"}>
                    Profit net: {currencyFormatter.format(results.netProfit)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rendement
                </Typography>
                <Box>
                  <Typography variant="body1">
                    Rendement sur investissement: {results.returnOnInvestment.toFixed(2)}%
                  </Typography>
                  <Typography variant="body1">
                    Rendement annualisé: {results.annualizedReturn.toFixed(2)}%
                  </Typography>
                  <Typography variant="body1">
                    Durée du projet: {calculator.propertyInfo.projectDuration} mois
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: isViable ? 'success.light' : 'error.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Évaluation du projet
                </Typography>
                <Box>
                  <Typography variant="body1">
                    {isViable 
                      ? `Ce projet est viable avec un profit net de ${currencyFormatter.format(results.netProfit)}.` 
                      : `Ce projet n'atteint pas le profit minimum de 25 000$.`}
                  </Typography>
                  {!isViable && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Pour atteindre le profit minimal, essayez:
                      <ul>
                        <li>Négocier un prix d'achat inférieur</li>
                        <li>Réduire le budget de rénovation</li>
                        <li>Augmenter le prix de revente</li>
                      </ul>
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );

  // Rendu principal du composant
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Calculateur de Rendement FLIP 3.0
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Basé sur la méthodologie "Les Secrets de l'Immobilier"
        </Typography>
        
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab icon={<HomeIcon />} label="Propriété" />
          <Tab icon={<BuildIcon />} label="Rénovations" />
          <Tab icon={<MoneyIcon />} label="Dépenses" />
          <Tab icon={<AssessmentIcon />} label="Résultats" />
        </Tabs>
        
        {activeTab === 0 && renderPropertyInfoTab()}
        {activeTab === 1 && renderRenovationTab()}
        {activeTab === 2 && renderExpensesTab()}
        {activeTab === 3 && renderResultsTab()}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            disabled={activeTab === 0}
            onClick={() => setActiveTab(activeTab - 1)}
            startIcon={<ArrowBackIcon />}
          >
            Précédent
          </Button>
          
          <Box>
            <Button
              variant="contained"
              onClick={() => {
                setCalculator(calculatorService.createNewCalculator());
                setResults({});
                setIsViable(null);
                setNapkinAnalysis(null);
              }}
              color="warning"
              sx={{ mr: 1 }}
            >
              Réinitialiser
            </Button>
            
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              sx={{ mr: 1 }}
            >
              Sauvegarder
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
            >
              Exporter PDF
            </Button>
          </Box>
          
          <Button
            variant="outlined"
            disabled={activeTab === 3}
            onClick={() => setActiveTab(activeTab + 1)}
            endIcon={<ArrowForwardIcon />}
          >
            Suivant
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FlipCalculator;
