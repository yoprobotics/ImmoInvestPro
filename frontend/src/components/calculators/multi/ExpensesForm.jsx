import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, TextField, InputAdornment,
  Paper, Box, Divider, Tooltip, FormControlLabel,
  Switch, Alert
} from '@mui/material';
import { 
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

/**
 * Formulaire pour saisir les dépenses d'un immeuble MULTI
 */
const ExpensesForm = ({ propertyData, updatePropertyData }) => {
  // État pour suivre les dépenses
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenseRatio, setExpenseRatio] = useState(0);
  
  // Fonction pour mettre à jour une dépense
  const handleExpenseChange = (field, value) => {
    updatePropertyData('expenses', field, value);
  };
  
  // Calculer le ratio de dépenses basé sur le revenu brut
  useEffect(() => {
    const totalRevenue = (propertyData.grossRevenue || 0) + (propertyData.otherRevenue || 0);
    const expenses = Object.values(propertyData.expenses).reduce((sum, val) => sum + (val || 0), 0);
    
    setTotalExpenses(expenses);
    setExpenseRatio(totalRevenue > 0 ? (expenses / totalRevenue) * 100 : 0);
  }, [propertyData.expenses, propertyData.grossRevenue, propertyData.otherRevenue]);
  
  // Fonction pour déterminer la couleur du ratio de dépenses
  const getRatioColor = (ratio) => {
    if (ratio < 35) return 'success.main';
    if (ratio < 45) return 'warning.main';
    return 'error.main';
  };
  
  // Recommandation basée sur le nombre de logements
  const getRecommendedRatio = () => {
    const units = propertyData.units || 0;
    if (units <= 2) return '30%';
    if (units <= 4) return '35%';
    if (units <= 6) return '45%';
    return '50%';
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Dépenses annuelles d'exploitation
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Entrez les dépenses annuelles de l'immeuble. Le ratio de dépenses recommandé pour votre type d'immeuble ({propertyData.units || 0} logements) est d'environ {getRecommendedRatio()}.
        </Typography>
        
        {/* Alerte sur le ratio de dépenses */}
        {expenseRatio > 0 && (
          <Alert 
            severity={expenseRatio < 40 ? "success" : expenseRatio < 50 ? "warning" : "error"}
            icon={expenseRatio < 40 ? undefined : <WarningIcon />}
            sx={{ mb: 2 }}
          >
            {expenseRatio < 40 
              ? `Ratio de dépenses actuel: ${expenseRatio.toFixed(1)}% - Bon ratio pour ce type d'immeuble.`
              : expenseRatio < 50
                ? `Ratio de dépenses actuel: ${expenseRatio.toFixed(1)}% - Ratio légèrement élevé pour ce type d'immeuble.`
                : `Ratio de dépenses actuel: ${expenseRatio.toFixed(1)}% - Ratio élevé qui pourrait affecter la rentabilité.`
            }
          </Alert>
        )}
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Taxes et assurances
        </Typography>
      </Grid>
      
      {/* Taxes municipales */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Taxes municipales"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.municipalTaxes || ''}
          onChange={(e) => handleExpenseChange('municipalTaxes', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Taxes municipales annuelles">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Taxes municipales annuelles"
        />
      </Grid>
      
      {/* Taxes scolaires */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Taxes scolaires"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.schoolTaxes || ''}
          onChange={(e) => handleExpenseChange('schoolTaxes', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Taxes scolaires annuelles">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Taxes scolaires annuelles"
        />
      </Grid>
      
      {/* Assurances */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Assurances"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.insurance || ''}
          onChange={(e) => handleExpenseChange('insurance', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Assurances annuelles">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Assurances annuelles"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" gutterBottom>
          Services publics
        </Typography>
      </Grid>
      
      {/* Électricité */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Électricité"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.electricity || ''}
          onChange={(e) => handleExpenseChange('electricity', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Électricité annuelle payée par le propriétaire">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Électricité annuelle (partie propriétaire)"
        />
      </Grid>
      
      {/* Chauffage */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Chauffage"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.heating || ''}
          onChange={(e) => handleExpenseChange('heating', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Chauffage annuel payé par le propriétaire (gaz, mazout, etc.)">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Chauffage annuel (partie propriétaire)"
        />
      </Grid>
      
      {/* Eau et égouts */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Eau et égouts"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.water || ''}
          onChange={(e) => handleExpenseChange('water', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Frais annuels d'eau et d'égouts">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Eau et égouts annuels"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" gutterBottom>
          Entretien et gestion
        </Typography>
      </Grid>
      
      {/* Entretien et réparations */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Entretien et réparations"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.maintenance || ''}
          onChange={(e) => handleExpenseChange('maintenance', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Entretien général et réparations annuelles">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Entretien et réparations annuels"
        />
      </Grid>
      
      {/* Frais de gestion */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Frais de gestion"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.management || ''}
          onChange={(e) => handleExpenseChange('management', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Frais de gestion annuels (environ 5% des revenus)">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Frais de gestion annuels"
        />
      </Grid>
      
      {/* Déneigement */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Déneigement"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.snow || ''}
          onChange={(e) => handleExpenseChange('snow', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Frais annuels de déneigement">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Déneigement annuel"
        />
      </Grid>
      
      {/* Entretien pelouse */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Entretien pelouse"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.lawn || ''}
          onChange={(e) => handleExpenseChange('lawn', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Frais annuels d'entretien de la pelouse et aménagement paysager">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Entretien pelouse annuel"
        />
      </Grid>
      
      {/* Autres dépenses */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Autres dépenses"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.other || ''}
          onChange={(e) => handleExpenseChange('other', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Autres dépenses annuelles non catégorisées">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Autres dépenses annuelles"
        />
      </Grid>
      
      {/* Vacance et mauvais payeurs */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Vacance et mauvais payeurs"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.expenses.vacancy || ''}
          onChange={(e) => handleExpenseChange('vacancy', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Provision pour vacance et mauvais payeurs (3-5% des revenus)">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Provision annuelle pour vacance et mauvais payeurs"
        />
      </Grid>
      
      {/* Résumé des dépenses */}
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'action.hover' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Total des dépenses</Typography>
              <Typography variant="h6">{totalExpenses.toLocaleString()} $ / an</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Ratio de dépenses</Typography>
              <Typography 
                variant="h6" 
                color={getRatioColor(expenseRatio)}
              >
                {expenseRatio.toFixed(1)} %
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Recommandé: {getRecommendedRatio()} pour {propertyData.units || 0} logements
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ExpensesForm;
