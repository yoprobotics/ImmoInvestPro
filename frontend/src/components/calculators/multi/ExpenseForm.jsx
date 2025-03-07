import React, { useState } from 'react';
import { 
  Grid, TextField, Typography, Paper, Box, Divider,
  MenuItem, FormControl, InputLabel, Select, Button
} from '@mui/material';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Formulaire pour la saisie des dépenses de l'immeuble
 * @param {Object} expenseData - Les données de dépenses actuelles
 * @param {Function} setExpenseData - Fonction pour mettre à jour les données de dépenses
 */
const ExpenseForm = ({ expenseData, setExpenseData }) => {
  const [expenseFrequency, setExpenseFrequency] = useState('annual');
  
  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let numberValue = value === '' ? 0 : Number(value);
    
    // Si l'entrée est mensuelle, convertir en annuelle
    if (expenseFrequency === 'monthly') {
      numberValue *= 12;
    }
    
    setExpenseData(prev => ({ ...prev, [name]: numberValue }));
  };
  
  // Conversion des valeurs pour l'affichage selon la fréquence choisie
  const getDisplayValue = (value) => {
    if (expenseFrequency === 'monthly') {
      return (value / 12).toFixed(2);
    }
    return value.toString();
  };
  
  // Groupes de dépenses
  const expenseGroups = [
    {
      title: 'Taxes',
      fields: [
        { name: 'municipalTaxes', label: 'Taxes municipales' },
        { name: 'schoolTaxes', label: 'Taxes scolaires' },
      ]
    },
    {
      title: 'Services publics',
      fields: [
        { name: 'electricity', label: 'Électricité' },
        { name: 'heating', label: 'Chauffage' },
        { name: 'water', label: 'Eau' },
      ]
    },
    {
      title: 'Entretien et services',
      fields: [
        { name: 'maintenance', label: 'Entretien général' },
        { name: 'management', label: 'Gestion' },
        { name: 'janitorial', label: 'Conciergerie' },
        { name: 'snowRemoval', label: 'Déneigement' },
        { name: 'landscaping', label: 'Aménagement paysager' },
        { name: 'garbage', label: 'Ordures' },
      ]
    },
    {
      title: 'Frais professionnels',
      fields: [
        { name: 'legal', label: 'Frais juridiques' },
        { name: 'accounting', label: 'Comptabilité' },
        { name: 'insurance', label: 'Assurances' },
      ]
    },
    {
      title: 'Autres dépenses',
      fields: [
        { name: 'advertising', label: 'Publicité' },
        { name: 'condoFees', label: 'Frais de copropriété' },
        { name: 'other', label: 'Autres dépenses' },
      ]
    }
  ];
  
  // Calcul du total des dépenses
  const totalExpenses = Object.values(expenseData).reduce((sum, value) => sum + value, 0);
  const monthlyExpenses = totalExpenses / 12;
  
  // Fonction pour réinitialiser toutes les dépenses
  const resetExpenses = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les dépenses à zéro?')) {
      const resetData = {};
      Object.keys(expenseData).forEach(key => {
        resetData[key] = 0;
      });
      setExpenseData(resetData);
    }
  };
  
  // Fonction pour estimer les dépenses sur la base d'un pourcentage des revenus bruts
  const estimateExpenses = () => {
    // Cette fonction pourrait être complétée plus tard pour générer des estimations
    // basées sur le nombre d'unités et le revenu brut
    alert('Cette fonctionnalité sera disponible prochainement.');
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Dépenses d'exploitation
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Saisissez les dépenses annuelles prévues pour l'immeuble.
      </Typography>
      
      {/* Contrôle de la fréquence (mensuelle/annuelle) */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="expense-frequency-label">Fréquence</InputLabel>
          <Select
            labelId="expense-frequency-label"
            id="expense-frequency"
            value={expenseFrequency}
            label="Fréquence"
            onChange={(e) => setExpenseFrequency(e.target.value)}
          >
            <MenuItem value="monthly">Mensuelle</MenuItem>
            <MenuItem value="annual">Annuelle</MenuItem>
          </Select>
        </FormControl>
        
        <Box>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="small" 
            onClick={resetExpenses}
            sx={{ mr: 1 }}
          >
            Réinitialiser
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small" 
            onClick={estimateExpenses}
          >
            Estimer
          </Button>
        </Box>
      </Box>
      
      {/* Formulaire des dépenses */}
      {expenseGroups.map((group, groupIndex) => (
        <Paper 
          key={groupIndex} 
          variant="outlined" 
          sx={{ p: 3, mb: 3 }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {group.title}
          </Typography>
          
          <Grid container spacing={3}>
            {group.fields.map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={getDisplayValue(expenseData[field.name] || 0)}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: '$',
                    inputProps: { min: 0, step: expenseFrequency === 'monthly' ? 10 : 100 }
                  }}
                  helperText={`${field.label} ${expenseFrequency === 'monthly' ? 'mensuelle' : 'annuelle'}`}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
      
      {/* Résumé des dépenses */}
      <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" gutterBottom>
          Résumé des dépenses
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Dépenses mensuelles:</strong>
            </Typography>
            <Typography variant="h6" color="error.main">
              {formatNumberWithSpaces(monthlyExpenses)} $
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Dépenses annuelles:</strong>
            </Typography>
            <Typography variant="h6" color="error.main">
              {formatNumberWithSpaces(totalExpenses)} $
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Principales dépenses:</strong>
            </Typography>
            <Typography variant="body2">
              Taxes municipales: {formatNumberWithSpaces(expenseData.municipalTaxes)} $
            </Typography>
            <Typography variant="body2">
              Assurances: {formatNumberWithSpaces(expenseData.insurance)} $
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Taxes:</strong>
            </Typography>
            <Typography variant="body2">
              Municipales: {formatNumberWithSpaces(expenseData.municipalTaxes)} $
            </Typography>
            <Typography variant="body2">
              Scolaires: {formatNumberWithSpaces(expenseData.schoolTaxes)} $
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Recommandations et astuces */}
      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Astuces pour optimiser vos dépenses
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body2" paragraph>
          <strong>1. Économies d'énergie:</strong> Envisagez des améliorations énergétiques pour réduire les coûts d'électricité et de chauffage.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>2. Entretien préventif:</strong> Un entretien régulier évite des réparations coûteuses futures.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>3. Assurances:</strong> Comparez différentes offres d'assurance pour obtenir le meilleur tarif.
        </Typography>
        <Typography variant="body2">
          <strong>4. Taxes:</strong> Vérifiez que l'évaluation municipale est juste, et contestez-la si nécessaire.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ExpenseForm;