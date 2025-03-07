import React from 'react';
import { 
  Typography, Grid, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

/**
 * Formulaire pour saisir les informations de base d'un immeuble MULTI
 */
const PropertyInfoForm = ({ propertyData, updatePropertyData }) => {
  // Fonction pour mettre à jour une valeur simple
  const handleChange = (field, value) => {
    updatePropertyData(null, field, value);
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Informations générales
        </Typography>
      </Grid>
      
      {/* Adresse */}
      <Grid item xs={12}>
        <TextField
          label="Adresse complète de l'immeuble"
          variant="outlined"
          fullWidth
          value={propertyData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="123 rue Principale, Ville, Province, Code postal"
          helperText="Entrez l'adresse complète de l'immeuble"
        />
      </Grid>
      
      {/* Prix demandé */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Prix demandé"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          helperText="Prix demandé pour l'immeuble"
        />
      </Grid>
      
      {/* Nombre de logements */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Nombre de logements"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.units}
          onChange={(e) => handleChange('units', parseInt(e.target.value) || 0)}
          helperText="Nombre total de logements dans l'immeuble"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Caractéristiques de l'immeuble
        </Typography>
      </Grid>
      
      {/* Année de construction */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Année de construction"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.yearBuilt || ''}
          onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value) || 0)}
          helperText="Année de construction de l'immeuble"
        />
      </Grid>
      
      {/* Type d'immeuble */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="building-type-label">Type d'immeuble</InputLabel>
          <Select
            labelId="building-type-label"
            value={propertyData.buildingType || ''}
            onChange={(e) => handleChange('buildingType', e.target.value)}
            label="Type d'immeuble"
          >
            <MenuItem value="plex">Plex (2 à 5 logements)</MenuItem>
            <MenuItem value="apartment">Immeuble d'appartements (6+ logements)</MenuItem>
            <MenuItem value="mixed">Immeuble à usage mixte</MenuItem>
            <MenuItem value="other">Autre</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      {/* Superficie du terrain */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Superficie du terrain"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.landArea || ''}
          onChange={(e) => handleChange('landArea', parseFloat(e.target.value) || 0)}
          InputProps={{
            endAdornment: <InputAdornment position="end">pi²</InputAdornment>,
          }}
          helperText="Superficie du terrain en pieds carrés"
        />
      </Grid>
      
      {/* Superficie habitable */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Superficie habitable"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.livingArea || ''}
          onChange={(e) => handleChange('livingArea', parseFloat(e.target.value) || 0)}
          InputProps={{
            endAdornment: <InputAdornment position="end">pi²</InputAdornment>,
          }}
          helperText="Superficie habitable totale en pieds carrés"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Informations complémentaires
        </Typography>
      </Grid>
      
      {/* Nombre de stationnements */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Nombre de stationnements"
          type="number"
          variant="outlined"
          fullWidth
          value={propertyData.parkingSpaces || ''}
          onChange={(e) => handleChange('parkingSpaces', parseInt(e.target.value) || 0)}
          helperText="Nombre total de places de stationnement"
        />
      </Grid>
      
      {/* Zonage */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="zoning-label">Zonage</InputLabel>
          <Select
            labelId="zoning-label"
            value={propertyData.zoning || ''}
            onChange={(e) => handleChange('zoning', e.target.value)}
            label="Zonage"
          >
            <MenuItem value="residential">Résidentiel</MenuItem>
            <MenuItem value="commercial">Commercial</MenuItem>
            <MenuItem value="mixed">Mixte</MenuItem>
            <MenuItem value="industrial">Industriel</MenuItem>
            <MenuItem value="other">Autre</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      {/* Notes */}
      <Grid item xs={12}>
        <TextField
          label="Notes et particularités"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={propertyData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          helperText="Détails supplémentaires importants sur l'immeuble"
        />
      </Grid>
    </Grid>
  );
};

export default PropertyInfoForm;
