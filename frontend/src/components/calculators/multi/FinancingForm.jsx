import React, { useState } from 'react';
import { 
  Grid, TextField, Typography, Paper, Box, Divider, Switch,
  FormControlLabel, MenuItem, Button, Accordion, AccordionSummary,
  AccordionDetails, Slider
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  Add as AddIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Formulaire pour la configuration du financement
 * @param {Object} financingData - Les données de financement actuelles
 * @param {Function} setFinancingData - Fonction pour mettre à jour les données de financement
 * @param {number} purchasePrice - Prix d'achat de l'immeuble
 */
const FinancingForm = ({ financingData, setFinancingData, purchasePrice }) => {
  
  // États locaux pour les fonctionnalités avancées
  const [advancedMode, setAdvancedMode] = useState(false);
  const [showCreativeFinancing, setShowCreativeFinancing] = useState(false);
  
  // Gestion des changements dans le prêt hypothécaire principal
  const handleFirstMortgageChange = (field, value) => {
    const updatedMortgage = { ...financingData.firstMortgage };
    
    // Traitements spécifiques
    if (field === 'loanToValue') {
      updatedMortgage[field] = value;
      
      // Si un montant spécifique était défini, le retirer
      if (updatedMortgage.desiredAmount) {
        updatedMortgage.desiredAmount = undefined;
      }
    } else if (field === 'desiredAmount') {
      // Vérifier que le montant ne dépasse pas le prix d'achat
      const maxAmount = purchasePrice || 0;
      updatedMortgage[field] = Math.min(value, maxAmount);
      
      // Calculer le LTV correspondant
      if (purchasePrice > 0) {
        updatedMortgage.loanToValue = (updatedMortgage[field] / purchasePrice) * 100;
      }
    } else {
      updatedMortgage[field] = value;
    }
    
    setFinancingData(prev => ({
      ...prev,
      firstMortgage: updatedMortgage
    }));
  };
  
  // Activation du prêt hypothécaire secondaire
  const toggleSecondMortgage = (isEnabled) => {
    if (isEnabled) {
      setFinancingData(prev => ({
        ...prev,
        secondMortgage: {
          amount: 0,
          interestRate: 8,
          amortizationYears: 15,
          term: 3,
          interestOnly: false
        }
      }));
    } else {
      setFinancingData(prev => ({
        ...prev,
        secondMortgage: null
      }));
    }
  };
  
  // Gestion des changements dans le prêt hypothécaire secondaire
  const handleSecondMortgageChange = (field, value) => {
    if (!financingData.secondMortgage) return;
    
    const updatedMortgage = { ...financingData.secondMortgage };
    
    if (field === 'interestOnly') {
      updatedMortgage[field] = value;
    } else {
      updatedMortgage[field] = value === '' ? 0 : Number(value);
    }
    
    setFinancingData(prev => ({
      ...prev,
      secondMortgage: updatedMortgage
    }));
  };
  
  // Activation du financement vendeur
  const toggleSellerFinancing = (isEnabled) => {
    if (isEnabled) {
      setFinancingData(prev => ({
        ...prev,
        sellerFinancing: {
          amount: 0,
          interestRate: 5,
          amortizationYears: 5,
          term: 5,
          interestOnly: true,
          paymentStartMonths: 0
        }
      }));
    } else {
      setFinancingData(prev => ({
        ...prev,
        sellerFinancing: null
      }));
    }
  };
  
  // Gestion des changements dans le financement vendeur
  const handleSellerFinancingChange = (field, value) => {
    if (!financingData.sellerFinancing) return;
    
    const updatedFinancing = { ...financingData.sellerFinancing };
    
    if (field === 'interestOnly') {
      updatedFinancing[field] = value;
    } else {
      updatedFinancing[field] = value === '' ? 0 : Number(value);
    }
    
    setFinancingData(prev => ({
      ...prev,
      sellerFinancing: updatedFinancing
    }));
  };
  
  // Activation du financement par investisseur privé
  const togglePrivateInvestor = (isEnabled) => {
    if (isEnabled) {
      setFinancingData(prev => ({
        ...prev,
        privateInvestor: {
          amount: 0,
          interestRate: 10,
          amortizationYears: 5,
          term: 5,
          interestOnly: true,
          profitSharing: 0
        }
      }));
    } else {
      setFinancingData(prev => ({
        ...prev,
        privateInvestor: null
      }));
    }
  };
  
  // Gestion des changements dans le financement par investisseur privé
  const handlePrivateInvestorChange = (field, value) => {
    if (!financingData.privateInvestor) return;
    
    const updatedInvestor = { ...financingData.privateInvestor };
    
    if (field === 'interestOnly') {
      updatedInvestor[field] = value;
    } else {
      updatedInvestor[field] = value === '' ? 0 : Number(value);
    }
    
    setFinancingData(prev => ({
      ...prev,
      privateInvestor: updatedInvestor
    }));
  };
  
  // Gestion des changements dans les montants de mise de fonds personnelle
  const handleEquityChange = (field, value) => {
    setFinancingData(prev => ({
      ...prev,
      [field]: value === '' ? 0 : Number(value)
    }));
  };
  
  // Fréquences de paiement hypothécaire
  const paymentFrequencies = [
    { value: 'monthly', label: 'Mensuelle' },
    { value: 'biweekly', label: 'Aux deux semaines' },
    { value: 'accelerated', label: 'Accéléré (aux deux semaines)' }
  ];
  
  // Calcul du montant du prêt hypothécaire principal
  const firstMortgageAmount = financingData.firstMortgage.desiredAmount || 
    (purchasePrice * (financingData.firstMortgage.loanToValue / 100));
  
  // Calcul du montant total financé
  const totalFinanced = 
    firstMortgageAmount + 
    (financingData.secondMortgage?.amount || 0) + 
    (financingData.sellerFinancing?.amount || 0) + 
    (financingData.privateInvestor?.amount || 0);
  
  // Calcul de la mise de fonds nécessaire
  const requiredDownPayment = Math.max(0, purchasePrice - totalFinanced);
  
  // Mise de fonds totale disponible
  const availableDownPayment = financingData.personalCashAmount + financingData.additionalEquityAmount;
  
  // Calcul de l'écart de financement
  const financingGap = requiredDownPayment - availableDownPayment;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Options de financement
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configurez les différentes sources de financement pour l'acquisition de l'immeuble.
      </Typography>
      
      {/* Section pour le prêt hypothécaire principal */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Prêt hypothécaire principal
        </Typography>
        
        <Grid container spacing={3}>
          {/* Mode de calcul du montant du prêt */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Ratio prêt-valeur (%)"
              value={financingData.firstMortgage.loanToValue}
              onChange={(e) => handleFirstMortgageChange('loanToValue', Number(e.target.value))}
              type="number"
              InputProps={{
                inputProps: { min: 0, max: 100, step: 0.5 }
              }}
              helperText="Pourcentage du prix d'achat"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Montant du prêt"
              value={formatNumberWithSpaces(firstMortgageAmount)}
              InputProps={{
                readOnly: true,
                startAdornment: '$'
              }}
              variant="filled"
              helperText="Montant calculé"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Montant spécifique"
              value={financingData.firstMortgage.desiredAmount || ''}
              onChange={(e) => handleFirstMortgageChange('desiredAmount', Number(e.target.value))}
              type="number"
              InputProps={{
                startAdornment: '$',
                inputProps: { min: 0, max: purchasePrice }
              }}
              helperText="Optionnel, remplace le ratio"
            />
          </Grid>
          
          {/* Taux d'intérêt */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Taux d'intérêt (%)"
              value={financingData.firstMortgage.interestRate}
              onChange={(e) => handleFirstMortgageChange('interestRate', Number(e.target.value))}
              type="number"
              InputProps={{
                inputProps: { min: 0, max: 20, step: 0.01 }
              }}
              required
            />
          </Grid>
          
          {/* Amortissement */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Période d'amortissement (années)"
              value={financingData.firstMortgage.amortizationYears}
              onChange={(e) => handleFirstMortgageChange('amortizationYears', Number(e.target.value))}
              type="number"
              InputProps={{
                inputProps: { min: 1, max: 30 }
              }}
              required
            />
          </Grid>
          
          {/* Terme */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Terme (années)"
              value={financingData.firstMortgage.term}
              onChange={(e) => handleFirstMortgageChange('term', Number(e.target.value))}
              type="number"
              InputProps={{
                inputProps: { min: 1, max: 10 }
              }}
              required
            />
          </Grid>
          
          {/* Options avancées */}
          {advancedMode && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Fréquence de paiement"
                  value={financingData.firstMortgage.paymentFrequency}
                  onChange={(e) => handleFirstMortgageChange('paymentFrequency', e.target.value)}
                >
                  {paymentFrequencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Privilèges de remboursement anticipé (%)"
                  value={financingData.firstMortgage.prepaymentPrivileges}
                  onChange={(e) => handleFirstMortgageChange('prepaymentPrivileges', Number(e.target.value))}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0, max: 100 }
                  }}
                  helperText="Remboursement annuel sans pénalité"
                />
              </Grid>
            </>
          )}
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={advancedMode}
                onChange={(e) => setAdvancedMode(e.target.checked)}
                color="primary"
              />
            }
            label="Options avancées"
          />
        </Box>
      </Paper>
      
      {/* Options de financement créatif */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={showCreativeFinancing ? <ExpandMoreIcon /> : <AddIcon />}
          onClick={() => setShowCreativeFinancing(!showCreativeFinancing)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {showCreativeFinancing ? "Masquer les options de financement créatif" : "Afficher les options de financement créatif"}
        </Button>
        
        {showCreativeFinancing && (
          <Box>
            {/* Prêt hypothécaire secondaire */}
            <Accordion defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">Prêt hypothécaire secondaire</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!financingData.secondMortgage}
                        onChange={(e) => toggleSecondMortgage(e.target.checked)}
                        color="primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label=""
                    sx={{ mr: 0 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {financingData.secondMortgage ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Montant"
                        value={financingData.secondMortgage.amount}
                        onChange={(e) => handleSecondMortgageChange('amount', e.target.value)}
                        type="number"
                        InputProps={{
                          startAdornment: '$',
                          inputProps: { min: 0 }
                        }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Taux d'intérêt (%)"
                        value={financingData.secondMortgage.interestRate}
                        onChange={(e) => handleSecondMortgageChange('interestRate', e.target.value)}
                        type="number"
                        InputProps={{
                          inputProps: { min: 0, step: 0.01 }
                        }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={financingData.secondMortgage.interestOnly}
                              onChange={(e) => handleSecondMortgageChange('interestOnly', e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Intérêt seulement"
                        />
                      </Box>
                    </Grid>
                    
                    {!financingData.secondMortgage.interestOnly && (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            fullWidth
                            label="Période d'amortissement (années)"
                            value={financingData.secondMortgage.amortizationYears}
                            onChange={(e) => handleSecondMortgageChange('amortizationYears', e.target.value)}
                            type="number"
                            InputProps={{
                              inputProps: { min: 1, max: 30 }
                            }}
                            required
                          />
                        </Grid>
                      </>
                    )}
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Terme (années)"
                        value={financingData.secondMortgage.term}
                        onChange={(e) => handleSecondMortgageChange('term', e.target.value)}
                        type="number"
                        InputProps={{
                          inputProps: { min: 1, max: 30 }
                        }}
                        required
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Activez cette option pour ajouter un prêt hypothécaire secondaire.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
            
            {/* Balance de vente (financement vendeur) */}
            <Accordion defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">Balance de vente (Financement vendeur)</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!financingData.sellerFinancing}
                        onChange={(e) => toggleSellerFinancing(e.target.checked)}
                        color="primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label=""
                    sx={{ mr: 0 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {financingData.sellerFinancing ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Montant"
                        value={financingData.sellerFinancing.amount}
                        onChange={(e) => handleSellerFinancingChange('amount', e.target.value)}
                        type="number"
                        InputProps={{
                          startAdornment: '$',
                          inputProps: { min: 0 }
                        }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Taux d'intérêt (%)"
                        value={financingData.sellerFinancing.interestRate}
                        onChange={(e) => handleSellerFinancingChange('interestRate', e.target.value)}
                        type="number"
                        InputProps={{
                          inputProps: { min: 0, step: 0.01 }
                        }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={financingData.sellerFinancing.interestOnly}
                              onChange={(e) => handleSellerFinancingChange('interestOnly', e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Intérêt seulement"
                        />
                      </Box>
                    </Grid>
                    
                    {!financingData.sellerFinancing.interestOnly && (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            fullWidth
                            label="Période d'amortissement (années)"
                            value={financingData.sellerFinancing.amortizationYears}
                            onChange={(e) => handleSellerFinancingChange('amortizationYears', e.target.value)}
                            type="number"
                            InputProps={{
                              inputProps: { min: 1, max: 30 }
                            }}
                            required
                          />
                        </Grid>
                      </>
                    )}
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Terme (années)"
                        value={financingData.sellerFinancing.term}
                        onChange={(e) => handleSellerFinancingChange('term', e.target.value)}
                        type="number"
                        InputProps={{
                          inputProps: { min: 1, max: 30 }
                        }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Délai avant premiers paiements (mois)"
                        value={financingData.sellerFinancing.paymentStartMonths}
                        onChange={(e) => handleSellerFinancingChange('paymentStartMonths', e.target.value)}
                        type="number"
                        InputProps={{
                          inputProps: { min: 0, max: 60 }
                        }}
                        helperText="0 = paiements immédiats"
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Activez cette option pour ajouter un financement vendeur (balance de vente).
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
            
            {/* Investisseur privé */}
            <Accordion defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">Investisseur privé</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!financingData.privateInvestor}
                        onChange={(e) => togglePrivateInvestor(e.target.checked)}
                        color="primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label=""
                    sx={{ mr: 0 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {financingData.privateInvestor ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Montant"
                        value={financingData.privateInvestor.amount}
                        onChange={(e) => handlePrivateInvestorChange('amount', e.target.value)}
                        type="number"
                        InputProps={{
                          startAdornment: '$',
                          inputProps: { min: 0 }
                        }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Taux d'intérêt (%)"
                        value={financingData.privateInvestor.interestRate}
                        onChange={(e) => handlePrivateInvestorChange('interestRate', e.target.value)}
                        type="number"
                        InputProps={{
                          inputProps: { min: 0, step: 0.01 }
                        }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={financingData.privateInvestor.interestOnly}
                              onChange={(e) => handlePrivateInvestorChange('interestOnly', e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Intérêt seulement"
                        />
                      </Box>
                    </Grid>
                    
                    {!financingData.privateInvestor.interestOnly && (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            fullWidth
                            label="Période d'amortissement (années)"
                            value={financingData.privateInvestor.amortizationYears}
                            onChange={(e) => handlePrivateInvestorChange('amortizationYears', e.target.value)}
                            type="number"
                            InputProps={{
                              inputProps: { min: 1, max: 30 }
                            }}
                            required
                          />
                        </Grid>
                      </>
                    )}
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Terme (années)"
                        value={financingData.privateInvestor.term}
                        onChange={(e) => handlePrivateInvestorChange('term', e.target.value)}
                        type="number"
                        InputProps={{
                          inputProps: { min: 1, max: 30 }
                        }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Partage de profits (%)"
                        value={financingData.privateInvestor.profitSharing}
                        onChange={(e) => handlePrivateInvestorChange('profitSharing', e.target.value)}
                        type="number"
                        InputProps={{
                          inputProps: { min: 0, max: 100 }
                        }}
                        helperText="Pourcentage du profit à partager"
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Activez cette option pour ajouter un investisseur privé.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Box>
      
      {/* Section pour la mise de fonds */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Mise de fonds et capitaux propres
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Mise de fonds nécessaire"
              value={formatNumberWithSpaces(requiredDownPayment)}
              InputProps={{
                readOnly: true,
                startAdornment: '$'
              }}
              variant="filled"
              helperText="Montant calculé"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Mise de fonds personnelle"
              value={financingData.personalCashAmount}
              onChange={(e) => handleEquityChange('personalCashAmount', e.target.value)}
              type="number"
              InputProps={{
                startAdornment: '$',
                inputProps: { min: 0 }
              }}
              helperText="Montant en argent personnel"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Équité additionnelle"
              value={financingData.additionalEquityAmount}
              onChange={(e) => handleEquityChange('additionalEquityAmount', e.target.value)}
              type="number"
              InputProps={{
                startAdornment: '$',
                inputProps: { min: 0 }
              }}
              helperText="Autre source d'équité (ex: REER)"
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Résumé du financement */}
      <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" gutterBottom>
          Résumé du financement
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Prix d'achat:</strong>
            </Typography>
            <Typography variant="h6">
              {formatNumberWithSpaces(purchasePrice)} $
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Montant financé total:</strong>
            </Typography>
            <Typography variant="h6" color="primary.main">
              {formatNumberWithSpaces(totalFinanced)} $
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Mise de fonds nécessaire:</strong>
            </Typography>
            <Typography variant="h6" color={financingGap > 0 ? "error.main" : "success.main"}>
              {formatNumberWithSpaces(requiredDownPayment)} $
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Mise de fonds disponible:</strong>
            </Typography>
            <Typography variant="h6" color={financingGap > 0 ? "error.main" : "success.main"}>
              {formatNumberWithSpaces(availableDownPayment)} $
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Prêt hypothécaire principal:</strong> {formatNumberWithSpaces(firstMortgageAmount)} $ ({financingData.firstMortgage.loanToValue.toFixed(1)}% du prix)
            </Typography>
            {financingData.secondMortgage && (
              <Typography variant="body2">
                <strong>2e hypothèque:</strong> {formatNumberWithSpaces(financingData.secondMortgage.amount)} $
              </Typography>
            )}
            {financingData.sellerFinancing && (
              <Typography variant="body2">
                <strong>Balance de vente:</strong> {formatNumberWithSpaces(financingData.sellerFinancing.amount)} $
              </Typography>
            )}
            {financingData.privateInvestor && (
              <Typography variant="body2">
                <strong>Investisseur privé:</strong> {formatNumberWithSpaces(financingData.privateInvestor.amount)} $
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {financingGap > 0 ? (
              <Typography variant="body2" color="error.main">
                <strong>⚠️ Financement insuffisant:</strong> Il manque {formatNumberWithSpaces(financingGap)} $ pour compléter la mise de fonds nécessaire.
              </Typography>
            ) : (
              <Typography variant="body2" color="success.main">
                <strong>✓ Financement complet:</strong> La mise de fonds disponible est suffisante pour l'acquisition.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FinancingForm;