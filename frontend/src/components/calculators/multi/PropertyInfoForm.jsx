import React from 'react';
import { Grid, TextField, MenuItem, Typography, Paper, Box, Divider } from '@mui/material';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Formulaire pour les informations de base de l'immeuble
 * @param {Object} propertyInfo - Les informations actuelles sur l'immeuble
 * @param {Function} setPropertyInfo - Fonction pour mettre à jour les informations
 */
const PropertyInfoForm = ({ propertyInfo, setPropertyInfo }) => {
  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Conversion en nombre pour les champs numériques
    if (name === 'purchasePrice' || name === 'numberOfUnits' || name === 'constructionYear') {
      const numberValue = value === '' ? '' : Number(value);
      setPropertyInfo(prev => ({ ...prev, [name]: numberValue }));
    } else {
      setPropertyInfo(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Types d'immeubles disponibles
  const propertyTypes = [
    { value: 'residential', label: 'Résidentiel' },
    { value: 'mixed', label: 'Mixte (résidentiel et commercial)' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industriel' }
  ];
  
  // Provinces canadiennes
  const provinces = [
    { value: 'QC', label: 'Québec' },
    { value: 'ON', label: 'Ontario' },
    { value: 'BC', label: 'Colombie-Britannique' },
    { value: 'AB', label: 'Alberta' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'NS', label: 'Nouvelle-Écosse' },
    { value: 'NB', label: 'Nouveau-Brunswick' },
    { value: 'NL', label: 'Terre-Neuve-et-Labrador' },
    { value: 'PE', label: 'Île-du-Prince-Édouard' },
    { value: 'NT', label: 'Territoires du Nord-Ouest' },
    { value: 'YT', label: 'Yukon' },
    { value: 'NU', label: 'Nunavut' }
  ];
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informations générales sur l'immeuble
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Saisissez les informations de base sur l'immeuble que vous souhaitez analyser.
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Prix d'achat */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Prix d'achat"
              name="purchasePrice"
              value={propertyInfo.purchasePrice}
              onChange={handleChange}
              type="number"
              InputProps={{
                startAdornment: '$',
                inputProps: { min: 0, step: 1000 }
              }}
              helperText="Prix d'achat total de l'immeuble"
              required
            />
          </Grid>
          
          {/* Nombre d'unités */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Nombre d'unités/logements"
              name="numberOfUnits"
              value={propertyInfo.numberOfUnits}
              onChange={handleChange}
              type="number"
              InputProps={{
                inputProps: { min: 1, max: 1000 }
              }}
              helperText="Nombre total d'unités locatives"
              required
            />
          </Grid>
          
          {/* Type d'immeuble */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Type d'immeuble"
              name="propertyType"
              value={propertyInfo.propertyType}
              onChange={handleChange}
              helperText="Type d'immeuble à revenus"
            >
              {propertyTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          {/* Année de construction */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Année de construction"
              name="constructionYear"
              value={propertyInfo.constructionYear}
              onChange={handleChange}
              type="number"
              InputProps={{
                inputProps: { min: 1800, max: new Date().getFullYear() }
              }}
              helperText="Année de construction de l'immeuble"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Adresse de l'immeuble
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Adresse */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse civique"
              name="address"
              value={propertyInfo.address}
              onChange={handleChange}
              helperText="Numéro et rue"
            />
          </Grid>
          
          {/* Ville */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Ville"
              name="city"
              value={propertyInfo.city}
              onChange={handleChange}
            />
          </Grid>
          
          {/* Province */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Province"
              name="province"
              value={propertyInfo.province}
              onChange={handleChange}
            >
              {provinces.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          {/* Code postal */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Code postal"
              name="postalCode"
              value={propertyInfo.postalCode}
              onChange={handleChange}
              inputProps={{ maxLength: 7 }}
              helperText="Format: A1A 1A1"
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Résumé des informations */}
      <Paper variant="outlined" sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" gutterBottom>
          Résumé des informations de base
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Prix d'achat:</strong> {formatNumberWithSpaces(propertyInfo.purchasePrice)} $
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Nombre d'unités:</strong> {propertyInfo.numberOfUnits}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Type d'immeuble:</strong> {propertyTypes.find(t => t.value === propertyInfo.propertyType)?.label || propertyInfo.propertyType}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Année de construction:</strong> {propertyInfo.constructionYear || 'Non spécifié'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>Adresse complète:</strong> {propertyInfo.address ? `${propertyInfo.address}, ${propertyInfo.city}, ${propertyInfo.province}, ${propertyInfo.postalCode}` : 'Non spécifiée'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PropertyInfoForm;