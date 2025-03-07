import React, { useEffect } from 'react';
import { 
  Grid, TextField, Typography, Paper, Box, Divider, IconButton, 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Switch, FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Formulaire pour la saisie des revenus de l'immeuble
 * @param {Object} revenueData - Les données de revenus actuelles
 * @param {Function} setRevenueData - Fonction pour mettre à jour les données de revenus
 * @param {number} numberOfUnits - Nombre d'unités dans l'immeuble
 */
const RevenueForm = ({ revenueData, setRevenueData, numberOfUnits }) => {
  
  // Mise à jour des unités si le nombre d'unités change
  useEffect(() => {
    if (numberOfUnits > 0) {
      // Ajuster le nombre d'unités dans le tableau des revenus
      const currentUnitCount = revenueData.units.length;
      
      if (currentUnitCount < numberOfUnits) {
        // Ajouter des unités manquantes
        const newUnits = [...revenueData.units];
        
        for (let i = currentUnitCount; i < numberOfUnits; i++) {
          newUnits.push({
            id: i + 1,
            unitNumber: `${i + 1}`,
            type: '3 1/2',
            monthlyRent: 0,
            isOccupied: true
          });
        }
        
        setRevenueData(prev => ({ ...prev, units: newUnits }));
      } else if (currentUnitCount > numberOfUnits) {
        // Réduire le nombre d'unités
        const newUnits = revenueData.units.slice(0, numberOfUnits);
        setRevenueData(prev => ({ ...prev, units: newUnits }));
      }
    }
  }, [numberOfUnits]);
  
  // Gestion des changements dans les unités
  const handleUnitChange = (index, field, value) => {
    const updatedUnits = [...revenueData.units];
    
    // Conversion en nombre pour les champs numériques
    if (field === 'monthlyRent') {
      updatedUnits[index][field] = value === '' ? 0 : Number(value);
    } else if (field === 'isOccupied') {
      updatedUnits[index][field] = value;
    } else {
      updatedUnits[index][field] = value;
    }
    
    setRevenueData(prev => ({ ...prev, units: updatedUnits }));
  };
  
  // Gestion des changements dans le taux d'inoccupation
  const handleVacancyRateChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    setRevenueData(prev => ({ ...prev, vacancyRate: value }));
  };
  
  // Ajout d'un revenu additionnel
  const addAdditionalRevenue = () => {
    const newAdditionalRevenue = {
      id: revenueData.additionalRevenues.length + 1,
      type: '',
      monthlyRevenue: 0,
      count: 1,
      notes: ''
    };
    
    setRevenueData(prev => ({
      ...prev,
      additionalRevenues: [...prev.additionalRevenues, newAdditionalRevenue]
    }));
  };
  
  // Suppression d'un revenu additionnel
  const removeAdditionalRevenue = (index) => {
    const updatedRevenues = [...revenueData.additionalRevenues];
    updatedRevenues.splice(index, 1);
    
    setRevenueData(prev => ({
      ...prev,
      additionalRevenues: updatedRevenues
    }));
  };
  
  // Gestion des changements dans les revenus additionnels
  const handleAdditionalRevenueChange = (index, field, value) => {
    const updatedRevenues = [...revenueData.additionalRevenues];
    
    // Conversion en nombre pour les champs numériques
    if (field === 'monthlyRevenue' || field === 'count') {
      updatedRevenues[index][field] = value === '' ? 0 : Number(value);
    } else {
      updatedRevenues[index][field] = value;
    }
    
    setRevenueData(prev => ({
      ...prev,
      additionalRevenues: updatedRevenues
    }));
  };
  
  // Calcul du total des revenus de loyer mensuels
  const totalMonthlyRent = revenueData.units.reduce(
    (sum, unit) => sum + (unit.isOccupied ? unit.monthlyRent : 0), 
    0
  );
  
  // Calcul du total potentiel des revenus de loyer mensuels (si tous occupés)
  const totalPotentialMonthlyRent = revenueData.units.reduce(
    (sum, unit) => sum + unit.monthlyRent, 
    0
  );
  
  // Calcul du total des revenus additionnels mensuels
  const totalAdditionalMonthlyRevenue = revenueData.additionalRevenues.reduce(
    (sum, revenue) => sum + (revenue.monthlyRevenue * revenue.count), 
    0
  );
  
  // Calcul du revenu brut mensuel
  const totalMonthlyRevenue = totalMonthlyRent + totalAdditionalMonthlyRevenue;
  
  // Calcul du revenu brut annuel
  const totalAnnualRevenue = totalMonthlyRevenue * 12;
  
  // Types d'unités courantes au Québec
  const unitTypes = [
    '1 1/2', '2 1/2', '3 1/2', '4 1/2', '5 1/2', '6 1/2', 
    'Studio', 'Loft', 'Maison', 'Autre'
  ];
  
  // Types de revenus additionnels courants
  const additionalRevenueTypes = [
    'Stationnement', 'Buanderie', 'Stockage', 'Antenne', 'Autre'
  ];
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Revenus de location
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Saisissez les revenus de loyer pour chaque unité ainsi que les revenus additionnels.
      </Typography>
      
      {/* Section des unités */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Unités locatives
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="15%">N° d'unité</TableCell>
                <TableCell width="20%">Type</TableCell>
                <TableCell width="20%">Loyer mensuel</TableCell>
                <TableCell width="15%">Occupé</TableCell>
                <TableCell width="30%">Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revenueData.units.map((unit, index) => (
                <TableRow key={unit.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={unit.unitNumber}
                      onChange={(e) => handleUnitChange(index, 'unitNumber', e.target.value)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      select
                      value={unit.type}
                      onChange={(e) => handleUnitChange(index, 'type', e.target.value)}
                      variant="outlined"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      {unitTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={unit.monthlyRent}
                      onChange={(e) => handleUnitChange(index, 'monthlyRent', e.target.value)}
                      variant="outlined"
                      InputProps={{
                        startAdornment: '$',
                        inputProps: { min: 0 }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={unit.isOccupied}
                          onChange={(e) => handleUnitChange(index, 'isOccupied', e.target.checked)}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={unit.notes || ''}
                      onChange={(e) => handleUnitChange(index, 'notes', e.target.value)}
                      variant="outlined"
                      placeholder="Notes optionnelles"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Taux d'inoccupation (%)"
                value={revenueData.vacancyRate}
                onChange={handleVacancyRateChange}
                type="number"
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 }
                }}
                helperText="Taux d'inoccupation prévu"
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Section des revenus additionnels */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Revenus additionnels
          </Typography>
          <Button 
            startIcon={<AddIcon />} 
            onClick={addAdditionalRevenue}
            color="primary"
            variant="outlined"
            size="small"
          >
            Ajouter
          </Button>
        </Box>
        
        {revenueData.additionalRevenues.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ my: 2, fontStyle: 'italic' }}>
            Aucun revenu additionnel. Cliquez sur "Ajouter" pour en ajouter.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="25%">Type</TableCell>
                  <TableCell width="20%">Revenu mensuel</TableCell>
                  <TableCell width="15%">Quantité</TableCell>
                  <TableCell width="30%">Notes</TableCell>
                  <TableCell width="10%">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revenueData.additionalRevenues.map((revenue, index) => (
                  <TableRow key={revenue.id}>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        select
                        value={revenue.type}
                        onChange={(e) => handleAdditionalRevenueChange(index, 'type', e.target.value)}
                        variant="outlined"
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="">Sélectionner...</option>
                        {additionalRevenueTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={revenue.monthlyRevenue}
                        onChange={(e) => handleAdditionalRevenueChange(index, 'monthlyRevenue', e.target.value)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: '$',
                          inputProps: { min: 0 }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={revenue.count}
                        onChange={(e) => handleAdditionalRevenueChange(index, 'count', e.target.value)}
                        variant="outlined"
                        InputProps={{
                          inputProps: { min: 1 }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={revenue.notes || ''}
                        onChange={(e) => handleAdditionalRevenueChange(index, 'notes', e.target.value)}
                        variant="outlined"
                        placeholder="Notes optionnelles"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => removeAdditionalRevenue(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Résumé des revenus */}
      <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" gutterBottom>
          Résumé des revenus
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Revenu de loyer mensuel:</strong>
            </Typography>
            <Typography variant="h6" color="primary.main">
              {formatNumberWithSpaces(totalMonthlyRent)} $
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Revenus additionnels:</strong>
            </Typography>
            <Typography variant="h6" color="primary.main">
              {formatNumberWithSpaces(totalAdditionalMonthlyRevenue)} $
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Revenu mensuel total:</strong>
            </Typography>
            <Typography variant="h6" color="primary.main">
              {formatNumberWithSpaces(totalMonthlyRevenue)} $
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2">
              <strong>Revenu annuel total:</strong>
            </Typography>
            <Typography variant="h6" color="primary.main">
              {formatNumberWithSpaces(totalAnnualRevenue)} $
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>Taux d'inoccupation prévu:</strong> {revenueData.vacancyRate}%
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RevenueForm;