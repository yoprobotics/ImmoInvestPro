import React, { useState } from 'react';
import { 
  Typography, Grid, TextField, InputAdornment,
  Button, IconButton, Paper, Box, Divider, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';

/**
 * Formulaire pour saisir les revenus d'un immeuble MULTI
 */
const RevenueForm = ({ propertyData, updatePropertyData }) => {
  // État local pour gérer les unités (logements)
  const [units, setUnits] = useState(propertyData.unitDetails || []);
  
  // Fonction pour mettre à jour les données des logements
  const updateUnitDetails = (updatedUnits) => {
    setUnits(updatedUnits);
    
    // Calculer le revenu brut total
    const totalRent = updatedUnits.reduce((sum, unit) => sum + (unit.rent || 0), 0);
    
    // Mettre à jour les données de la propriété
    updatePropertyData(null, 'unitDetails', updatedUnits);
    updatePropertyData(null, 'grossRevenue', totalRent * 12); // Revenu annuel
  };
  
  // Ajouter un nouveau logement
  const addUnit = () => {
    const newUnit = {
      id: Date.now(), // Identifiant unique
      unitNumber: '',
      type: '',
      bedrooms: 1,
      bathrooms: 1,
      rent: 0,
      isRented: false,
      notes: ''
    };
    
    const updatedUnits = [...units, newUnit];
    updateUnitDetails(updatedUnits);
  };
  
  // Supprimer un logement
  const deleteUnit = (unitId) => {
    const updatedUnits = units.filter(unit => unit.id !== unitId);
    updateUnitDetails(updatedUnits);
  };
  
  // Mettre à jour les données d'un logement
  const updateUnit = (unitId, field, value) => {
    const updatedUnits = units.map(unit => {
      if (unit.id === unitId) {
        return { ...unit, [field]: value };
      }
      return unit;
    });
    
    updateUnitDetails(updatedUnits);
  };
  
  // Mettre à jour un champ simple
  const handleChange = (field, value) => {
    updatePropertyData(null, field, value);
  };
  
  // Mettre à jour des revenus additionnels
  const handleAdditionalRevenueChange = (field, value) => {
    const updatedOtherRevenues = {
      ...propertyData.otherRevenues,
      [field]: value
    };
    
    // Calculer le total des revenus additionnels
    const totalOtherRevenue = Object.values(updatedOtherRevenues).reduce((sum, val) => sum + (val || 0), 0);
    
    updatePropertyData(null, 'otherRevenues', updatedOtherRevenues);
    updatePropertyData(null, 'otherRevenue', totalOtherRevenue);
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Revenus des logements
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Entrez les détails de chaque logement et son loyer mensuel.
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>N° Logement</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="center">Ch.</TableCell>
                <TableCell align="center">SdB</TableCell>
                <TableCell align="right">Loyer mensuel</TableCell>
                <TableCell align="center">Loué</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Aucun logement ajouté. Utilisez le bouton ci-dessous pour ajouter des logements.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <TextField
                        size="small"
                        variant="outlined"
                        value={unit.unitNumber}
                        onChange={(e) => updateUnit(unit.id, 'unitNumber', e.target.value)}
                        placeholder="101"
                        inputProps={{ style: { textAlign: 'left' } }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        variant="outlined"
                        value={unit.type}
                        onChange={(e) => updateUnit(unit.id, 'type', e.target.value)}
                        placeholder="3½"
                        inputProps={{ style: { textAlign: 'left' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        value={unit.bedrooms}
                        onChange={(e) => updateUnit(unit.id, 'bedrooms', parseInt(e.target.value) || 0)}
                        inputProps={{ style: { textAlign: 'center' }, min: 0 }}
                        sx={{ width: '60px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        value={unit.bathrooms}
                        onChange={(e) => updateUnit(unit.id, 'bathrooms', parseFloat(e.target.value) || 0)}
                        inputProps={{ style: { textAlign: 'center' }, min: 0, step: 0.5 }}
                        sx={{ width: '60px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        value={unit.rent}
                        onChange={(e) => updateUnit(unit.id, 'rent', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        inputProps={{ style: { textAlign: 'right' }, min: 0 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        select
                        size="small"
                        variant="outlined"
                        value={unit.isRented ? 'oui' : 'non'}
                        onChange={(e) => updateUnit(unit.id, 'isRented', e.target.value === 'oui')}
                        SelectProps={{ native: true }}
                        sx={{ width: '80px' }}
                      >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </TextField>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => deleteUnit(unit.id)}
                        aria-label="Supprimer le logement"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />} 
            onClick={addUnit}
            size="small"
          >
            Ajouter un logement
          </Button>
        </Box>
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Revenus additionnels
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Ajoutez d'autres sources de revenus annuels comme les stationnements, la buanderie, etc.
        </Typography>
      </Grid>
      
      {/* Revenus de stationnement */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Stationnements"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.otherRevenues?.parking || ''}
          onChange={(e) => handleAdditionalRevenueChange('parking', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Revenus annuels des stationnements">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Revenus annuels des stationnements"
        />
      </Grid>
      
      {/* Revenus de buanderie */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Buanderie"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.otherRevenues?.laundry || ''}
          onChange={(e) => handleAdditionalRevenueChange('laundry', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Revenus annuels de la buanderie">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Revenus annuels de la buanderie"
        />
      </Grid>
      
      {/* Stockage */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Stockage"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.otherRevenues?.storage || ''}
          onChange={(e) => handleAdditionalRevenueChange('storage', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Revenus annuels des espaces de stockage">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Revenus annuels des espaces de stockage"
        />
      </Grid>
      
      {/* Autres revenus */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Autres revenus"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.otherRevenues?.other || ''}
          onChange={(e) => handleAdditionalRevenueChange('other', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Autres revenus annuels">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          helperText="Autres revenus annuels"
        />
      </Grid>
      
      {/* Résumé des revenus */}
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'action.hover' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Revenus bruts des loyers</Typography>
              <Typography variant="h6">{(propertyData.grossRevenue || 0).toLocaleString()} $ / an</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Revenus additionnels</Typography>
              <Typography variant="h6">{(propertyData.otherRevenue || 0).toLocaleString()} $ / an</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Revenus totaux</Typography>
              <Typography variant="h6" color="primary.main">
                {((propertyData.grossRevenue || 0) + (propertyData.otherRevenue || 0)).toLocaleString()} $ / an
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RevenueForm;
