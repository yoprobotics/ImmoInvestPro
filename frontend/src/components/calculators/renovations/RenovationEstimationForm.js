import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Slider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { EMPTY_ROOM } from './utils/constants';
import { generateUniqueId } from './utils/calculations';

/**
 * Formulaire principal du calculateur d'estimation des rénovations
 */
const RenovationEstimationForm = ({ renovationData, onDataChange }) => {
  // Types de propriétés disponibles
  const propertyTypes = [
    'Maison unifamiliale',
    'Duplex',
    'Triplex',
    'Quadruplex',
    'Immeuble à logements',
    'Condo',
    'Autre'
  ];

  // Met à jour les informations générales
  const handleGeneralInfoChange = (field, value) => {
    onDataChange({
      ...renovationData,
      generalInfo: {
        ...renovationData.generalInfo,
        [field]: value
      }
    });
  };

  // Met à jour le pourcentage de contingence
  const handleContingencyChange = (value) => {
    const contingencyAmount = renovationData.summary.totalRenovationCost * (value / 100);
    const grandTotal = renovationData.summary.totalRenovationCost + contingencyAmount;
    
    onDataChange({
      ...renovationData,
      summary: {
        ...renovationData.summary,
        contingencyPercentage: value,
        contingencyAmount,
        grandTotal
      }
    });
  };

  // Ajoute une nouvelle pièce
  const handleAddRoom = () => {
    const newRoom = {
      ...EMPTY_ROOM,
      id: generateUniqueId(),
      elements: []
    };
    
    onDataChange({
      ...renovationData,
      rooms: [...renovationData.rooms, newRoom]
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Informations générales" />
      <CardContent>
        <Grid container spacing={3}>
          {/* Nom du projet */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom du projet"
              value={renovationData.generalInfo.projectName}
              onChange={(e) => handleGeneralInfoChange('projectName', e.target.value)}
              placeholder="ex: Rénovation Duplex Rosemont"
            />
          </Grid>
          
          {/* Type de propriété */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="property-type-label">Type de propriété</InputLabel>
              <Select
                labelId="property-type-label"
                value={renovationData.generalInfo.propertyType}
                label="Type de propriété"
                onChange={(e) => handleGeneralInfoChange('propertyType', e.target.value)}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Adresse */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Adresse"
              value={renovationData.generalInfo.address}
              onChange={(e) => handleGeneralInfoChange('address', e.target.value)}
              placeholder="ex: 123 rue des Pins, Montréal, QC"
            />
          </Grid>
          
          {/* Superficie */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Superficie (pi²)"
              value={renovationData.generalInfo.squareFootage}
              onChange={(e) => handleGeneralInfoChange('squareFootage', Number(e.target.value))}
              inputProps={{ min: 0 }}
              placeholder="ex: 1500"
            />
          </Grid>
          
          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={renovationData.generalInfo.notes}
              onChange={(e) => handleGeneralInfoChange('notes', e.target.value)}
              placeholder="Ajoutez des notes supplémentaires concernant le projet"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Contingence */}
        <Typography variant="subtitle1" gutterBottom>
          Contingence
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, minWidth: '80px' }}>
                Pourcentage: {renovationData.summary.contingencyPercentage}%
              </Typography>
              <Slider
                value={renovationData.summary.contingencyPercentage}
                onChange={(e, value) => handleContingencyChange(value)}
                min={0}
                max={30}
                step={1}
                valueLabelDisplay="auto"
                aria-labelledby="contingency-slider"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              La contingence sert à couvrir les imprévus. Pour un projet de rénovation, il est recommandé de prévoir entre 10% et 20% de contingence.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bouton pour ajouter une pièce */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRoom}
            size="large"
          >
            Ajouter une pièce
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RenovationEstimationForm;
