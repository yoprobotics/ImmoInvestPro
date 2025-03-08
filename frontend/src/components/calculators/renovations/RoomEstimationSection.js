import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Box,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { ROOM_TYPES, RENOVATION_ELEMENTS, EMPTY_ELEMENT } from './utils/constants';
import { calculateElementCost, calculateRoomCost, generateUniqueId, formatCurrency } from './utils/calculations';

/**
 * Composant pour l'estimation des rénovations d'une pièce spécifique
 */
const RoomEstimationSection = ({ room, onRoomUpdate, onDeleteRoom }) => {
  const [newElement, setNewElement] = useState({ ...EMPTY_ELEMENT, id: generateUniqueId() });

  // Met à jour un élément de la pièce
  const handleElementChange = (id, field, value) => {
    const updatedElements = room.elements.map(element => {
      if (element.id === id) {
        const updatedElement = { ...element, [field]: value };
        
        // Recalculer le coût total si la quantité ou le prix unitaire change
        if (field === 'quantity' || field === 'unitPrice') {
          updatedElement.totalPrice = calculateElementCost(updatedElement);
        }
        
        return updatedElement;
      }
      return element;
    });
    
    // Mettre à jour la pièce avec les éléments modifiés
    onRoomUpdate({
      ...room,
      elements: updatedElements,
      totalCost: calculateRoomCost({ ...room, elements: updatedElements })
    });
  };

  // Ajoute un nouvel élément à la pièce
  const handleAddElement = () => {
    // Vérifier que le type d'élément est bien renseigné
    if (!newElement.type) return;
    
    // Calculer le coût total de l'élément
    const elementWithTotal = {
      ...newElement,
      totalPrice: calculateElementCost(newElement)
    };
    
    // Ajouter l'élément à la pièce
    const updatedElements = [...room.elements, elementWithTotal];
    
    // Mettre à jour la pièce
    onRoomUpdate({
      ...room,
      elements: updatedElements,
      totalCost: calculateRoomCost({ ...room, elements: updatedElements })
    });
    
    // Réinitialiser le formulaire pour un nouvel élément
    setNewElement({ ...EMPTY_ELEMENT, id: generateUniqueId() });
  };

  // Supprime un élément de la pièce
  const handleDeleteElement = (elementId) => {
    const updatedElements = room.elements.filter(element => element.id !== elementId);
    
    // Mettre à jour la pièce
    onRoomUpdate({
      ...room,
      elements: updatedElements,
      totalCost: calculateRoomCost({ ...room, elements: updatedElements })
    });
  };

  // Met à jour les informations générales de la pièce
  const handleRoomInfoChange = (field, value) => {
    onRoomUpdate({
      ...room,
      [field]: value
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader 
        title={
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={11}>
              <Typography variant="h6">
                {room.name || `${room.type || 'Nouvelle pièce'}`}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton 
                color="error" 
                onClick={() => onDeleteRoom(room.id)}
                aria-label="Supprimer la pièce"
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        }
      />
      <CardContent>
        {/* Informations générales de la pièce */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id={`room-type-label-${room.id}`}>Type de pièce</InputLabel>
              <Select
                labelId={`room-type-label-${room.id}`}
                value={room.type}
                label="Type de pièce"
                onChange={(e) => handleRoomInfoChange('type', e.target.value)}
              >
                {Object.entries(ROOM_TYPES).map(([key, value]) => (
                  <MenuItem key={key} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom de la pièce"
              value={room.name}
              onChange={(e) => handleRoomInfoChange('name', e.target.value)}
              placeholder="ex: Cuisine principale"
            />
          </Grid>
        </Grid>

        {/* Liste des éléments de rénovation */}
        <Typography variant="subtitle1" gutterBottom>
          Éléments à rénover
        </Typography>
        
        {room.elements.length > 0 ? (
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantité</TableCell>
                  <TableCell align="right">Prix unitaire</TableCell>
                  <TableCell align="right">Prix total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {room.elements.map((element) => (
                  <TableRow key={element.id}>
                    <TableCell>{element.type}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={element.description}
                        onChange={(e) => handleElementChange(element.id, 'description', e.target.value)}
                        placeholder="Description"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="number"
                        value={element.quantity}
                        onChange={(e) => handleElementChange(element.id, 'quantity', Number(e.target.value))}
                        inputProps={{ min: 1 }}
                        sx={{ width: '80px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="number"
                        value={element.unitPrice}
                        onChange={(e) => handleElementChange(element.id, 'unitPrice', Number(e.target.value))}
                        inputProps={{ min: 0 }}
                        sx={{ width: '100px' }}
                        InputProps={{ startAdornment: '$' }}
                      />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(element.totalPrice)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteElement(element.id)}
                        aria-label="Supprimer l'élément"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Aucun élément ajouté. Utilisez le formulaire ci-dessous pour ajouter des éléments à rénover.
          </Typography>
        )}

        {/* Formulaire d'ajout d'un nouvel élément */}
        <Typography variant="subtitle2" gutterBottom>
          Ajouter un nouvel élément
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id={`element-type-label-${room.id}`}>Type d'élément</InputLabel>
              <Select
                labelId={`element-type-label-${room.id}`}
                value={newElement.type}
                label="Type d'élément"
                onChange={(e) => setNewElement({ ...newElement, type: e.target.value })}
              >
                {Object.entries(RENOVATION_ELEMENTS).map(([key, value]) => (
                  <MenuItem key={key} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Description"
              value={newElement.description}
              onChange={(e) => setNewElement({ ...newElement, description: e.target.value })}
              placeholder="ex: Porte en bois franc"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Quantité"
              value={newElement.quantity}
              onChange={(e) => setNewElement({ ...newElement, quantity: Number(e.target.value) })}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Prix unitaire"
              value={newElement.unitPrice}
              onChange={(e) => setNewElement({ ...newElement, unitPrice: Number(e.target.value) })}
              inputProps={{ min: 0 }}
              InputProps={{ startAdornment: '$' }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddElement}
              fullWidth
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Total de la pièce */}
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Typography variant="h6">
            Total pour cette pièce: {formatCurrency(room.totalCost)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomEstimationSection;
