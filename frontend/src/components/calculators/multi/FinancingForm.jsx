import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, TextField, InputAdornment,
  Paper, Box, Divider, Slider, Tooltip, FormControlLabel,
  Switch, Alert, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { 
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

/**
 * Formulaire pour configurer le financement d'un immeuble MULTI
 */
const FinancingForm = ({ propertyData, updatePropertyData }) => {
  // État pour contrôler l'affichage du financement créatif
  const [showCreativeFinancing, setShowCreativeFinancing] = useState(
    propertyData.creativeFinancing?.enabled || false
  );
  
  // Mettre à jour le financement standard
  const handleFinancingChange = (field, value) => {
    // Si c'est le pourcentage de mise de fonds, mettre à jour le montant
    if (field === 'downPaymentPercentage') {
      const downPaymentAmount = (propertyData.price * value) / 100;
      updatePropertyData('financing', 'downPayment', downPaymentAmount);
    } 
    // Si c'est le montant de mise de fonds, mettre à jour le pourcentage
    else if (field === 'downPayment') {
      const downPaymentPercentage = propertyData.price > 0 ? (value / propertyData.price) * 100 : 0;
      updatePropertyData('financing', 'downPaymentPercentage', downPaymentPercentage);
    }
    
    // Mettre à jour le champ
    updatePropertyData('financing', field, value);
    
    // Calculer le montant du prêt
    const loanAmount = propertyData.price - (field === 'downPayment' ? value : propertyData.financing.downPayment);
    updatePropertyData('financing', 'loanAmount', loanAmount);
  };
  
  // Mettre à jour le financement créatif
  const handleCreativeFinancingChange = (field, value) => {
    updatePropertyData('creativeFinancing', field, value);
  };
  
  // Activer/désactiver le financement créatif
  const toggleCreativeFinancing = (event) => {
    const enabled = event.target.checked;
    setShowCreativeFinancing(enabled);
    updatePropertyData('creativeFinancing', 'enabled', enabled);
  };
  
  // Initialiser le montant de mise de fonds lors du chargement
  useEffect(() => {
    // Calculer le montant de mise de fonds si le prix et le pourcentage sont définis
    if (propertyData.price && propertyData.financing.downPaymentPercentage) {
      const downPayment = (propertyData.price * propertyData.financing.downPaymentPercentage) / 100;
      updatePropertyData('financing', 'downPayment', downPayment);
      
      // Calculer le montant du prêt
      const loanAmount = propertyData.price - downPayment;
      updatePropertyData('financing', 'loanAmount', loanAmount);
    }
  }, [propertyData.price]); // Recalculer quand le prix change
  
  // Calculer le paiement hypothécaire mensuel
  const calculateMonthlyPayment = () => {
    const loanAmount = propertyData.financing.loanAmount || 0;
    const rate = propertyData.financing.interestRate || 0;
    const years = propertyData.financing.amortizationYears || 25;
    
    if (loanAmount > 0 && rate > 0) {
      const monthlyRate = rate / 100 / 12;
      const numPayments = years * 12;
      
      return loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
    
    return 0;
  };
  
  // Calculer la structure globale du financement
  const calculateFinancingStructure = () => {
    const price = propertyData.price || 0;
    const downPayment = propertyData.financing.downPayment || 0;
    const bankLoan = propertyData.financing.loanAmount || 0;
    
    let vendorBalance = 0;
    let privateInvestor = 0;
    
    if (showCreativeFinancing) {
      vendorBalance = propertyData.creativeFinancing.vendorBalance || 0;
      privateInvestor = propertyData.creativeFinancing.privateInvestor || 0;
    }
    
    const totalFinancing = downPayment + bankLoan + vendorBalance + privateInvestor;
    
    return {
      downPaymentPercentage: price > 0 ? (downPayment / price) * 100 : 0,
      bankLoanPercentage: price > 0 ? (bankLoan / price) * 100 : 0,
      vendorBalancePercentage: price > 0 ? (vendorBalance / price) * 100 : 0,
      privateInvestorPercentage: price > 0 ? (privateInvestor / price) * 100 : 0,
      totalPercentage: price > 0 ? (totalFinancing / price) * 100 : 0
    };
  };
  
  // Calculer les paiements mensuels pour tous les types de financement
  const calculateMonthlyPayments = () => {
    // Paiement hypothécaire standard
    const bankPayment = calculateMonthlyPayment();
    
    // Paiements pour le financement créatif
    let vendorPayment = 0;
    let investorPayment = 0;
    
    if (showCreativeFinancing) {
      // Balance de vente
      const vendorAmount = propertyData.creativeFinancing.vendorBalance || 0;
      const vendorRate = propertyData.creativeFinancing.vendorBalanceRate || 0;
      if (vendorAmount > 0 && vendorRate > 0) {
        vendorPayment = (vendorAmount * (vendorRate / 100)) / 12;
      }
      
      // Investisseur privé
      const investorAmount = propertyData.creativeFinancing.privateInvestor || 0;
      const investorRate = propertyData.creativeFinancing.privateInvestorRate || 0;
      if (investorAmount > 0 && investorRate > 0) {
        investorPayment = (investorAmount * (investorRate / 100)) / 12;
      }
    }
    
    const totalMonthlyPayment = bankPayment + vendorPayment + investorPayment;
    const annualPayment = totalMonthlyPayment * 12;
    
    return {
      bankPayment,
      vendorPayment,
      investorPayment,
      totalMonthlyPayment,
      annualPayment
    };
  };
  
  const financingStructure = calculateFinancingStructure();
  const monthlyPayments = calculateMonthlyPayments();
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Options de financement
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Configurez les options de financement pour votre immeuble à revenus.
        </Typography>
      </Grid>
      
      {/* Financement standard */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Financement hypothécaire standard
        </Typography>
      </Grid>
      
      {/* Prix d'achat (lecture seule) */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Prix d'achat"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.price || ''}
          disabled
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            readOnly: true,
          }}
          helperText="Prix d'achat de l'immeuble (modifiable à l'étape 1)"
        />
      </Grid>
      
      {/* Mise de fonds (montant) */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Mise de fonds"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.financing.downPayment || ''}
          onChange={(e) => handleFinancingChange('downPayment', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          helperText="Montant de la mise de fonds"
        />
      </Grid>
      
      {/* Mise de fonds (pourcentage) */}
      <Grid item xs={12}>
        <Typography variant="body2" gutterBottom>
          Pourcentage de mise de fonds: {propertyData.financing.downPaymentPercentage?.toFixed(1) || 0}%
        </Typography>
        <Slider
          value={propertyData.financing.downPaymentPercentage || 20}
          onChange={(e, value) => handleFinancingChange('downPaymentPercentage', value)}
          aria-labelledby="mise-de-fonds-slider"
          valueLabelDisplay="auto"
          step={0.5}
          marks={[
            { value: 5, label: '5%' },
            { value: 10, label: '10%' },
            { value: 20, label: '20%' },
            { value: 30, label: '30%' },
          ]}
          min={5}
          max={50}
        />
      </Grid>
      
      {/* Montant du prêt */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Montant du prêt"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.financing.loanAmount || ''}
          onChange={(e) => handleFinancingChange('loanAmount', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          helperText="Montant du prêt hypothécaire"
        />
      </Grid>
      
      {/* Taux d'intérêt */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Taux d'intérêt"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.financing.interestRate || ''}
          onChange={(e) => handleFinancingChange('interestRate', parseFloat(e.target.value) || 0)}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          helperText="Taux d'intérêt annuel"
          inputProps={{ step: 0.1 }}
        />
      </Grid>
      
      {/* Période d'amortissement */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Période d'amortissement"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.financing.amortizationYears || ''}
          onChange={(e) => handleFinancingChange('amortizationYears', parseInt(e.target.value) || 0)}
          InputProps={{
            endAdornment: <InputAdornment position="end">ans</InputAdornment>,
          }}
          helperText="Durée totale du prêt"
          inputProps={{ min: 1, max: 30, step: 1 }}
        />
      </Grid>
      
      {/* Terme du prêt */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Terme du prêt"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.financing.term || ''}
          onChange={(e) => handleFinancingChange('term', parseInt(e.target.value) || 0)}
          InputProps={{
            endAdornment: <InputAdornment position="end">ans</InputAdornment>,
          }}
          helperText="Durée du terme initial"
          inputProps={{ min: 1, max: 10, step: 1 }}
        />
      </Grid>
      
      {/* Financement créatif */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2">
            Financement créatif
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showCreativeFinancing}
                onChange={toggleCreativeFinancing}
                color="primary"
              />
            }
            label="Activer le financement créatif"
          />
        </Box>
        
        {showCreativeFinancing && (
          <>
            <Typography variant="body2" color="text.secondary" paragraph>
              Le financement créatif peut vous aider à réduire votre mise de fonds et augmenter votre rendement.
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Balance de vente</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Montant balance de vente"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={propertyData.creativeFinancing.vendorBalance || ''}
                      onChange={(e) => handleCreativeFinancingChange('vendorBalance', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      helperText="Montant financé par le vendeur"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Taux d'intérêt"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={propertyData.creativeFinancing.vendorBalanceRate || ''}
                      onChange={(e) => handleCreativeFinancingChange('vendorBalanceRate', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      helperText="Taux d'intérêt annuel (généralement 6-8%)"
                      inputProps={{ step: 0.1 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Investisseur privé</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Montant investisseur privé"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={propertyData.creativeFinancing.privateInvestor || ''}
                      onChange={(e) => handleCreativeFinancingChange('privateInvestor', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      helperText="Montant financé par un investisseur privé"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Taux d'intérêt"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={propertyData.creativeFinancing.privateInvestorRate || ''}
                      onChange={(e) => handleCreativeFinancingChange('privateInvestorRate', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      helperText="Taux d'intérêt annuel (généralement 8-12%)"
                      inputProps={{ step: 0.1 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </Grid>
      
      {/* Résumé du financement */}
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'action.hover' }}>
          <Typography variant="subtitle2" gutterBottom>
            Structure du financement
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Mise de fonds</Typography>
              <Typography variant="h6">{financingStructure.downPaymentPercentage.toFixed(1)}%</Typography>
              <Typography variant="body2">{(propertyData.financing.downPayment || 0).toLocaleString()} $</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Prêt bancaire</Typography>
              <Typography variant="h6">{financingStructure.bankLoanPercentage.toFixed(1)}%</Typography>
              <Typography variant="body2">{(propertyData.financing.loanAmount || 0).toLocaleString()} $</Typography>
            </Grid>
            {showCreativeFinancing && (
              <>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2">Balance de vente</Typography>
                  <Typography variant="h6">{financingStructure.vendorBalancePercentage.toFixed(1)}%</Typography>
                  <Typography variant="body2">{(propertyData.creativeFinancing.vendorBalance || 0).toLocaleString()} $</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2">Investisseur privé</Typography>
                  <Typography variant="h6">{financingStructure.privateInvestorPercentage.toFixed(1)}%</Typography>
                  <Typography variant="body2">{(propertyData.creativeFinancing.privateInvestor || 0).toLocaleString()} $</Typography>
                </Grid>
              </>
            )}
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Paiements mensuels
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Prêt bancaire</Typography>
              <Typography variant="h6">{monthlyPayments.bankPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} $</Typography>
            </Grid>
            {showCreativeFinancing && (
              <>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2">Balance de vente</Typography>
                  <Typography variant="h6">{monthlyPayments.vendorPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} $</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2">Investisseur privé</Typography>
                  <Typography variant="h6">{monthlyPayments.investorPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} $</Typography>
                </Grid>
              </>
            )}
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" fontWeight="bold">Total mensuel</Typography>
              <Typography variant="h6" fontWeight="bold">{monthlyPayments.totalMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} $</Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Total annuel: {monthlyPayments.annualPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} $
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FinancingForm;
