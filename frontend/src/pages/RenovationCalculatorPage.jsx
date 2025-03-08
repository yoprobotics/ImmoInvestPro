import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  FileCopy as DuplicateIcon
} from '@mui/icons-material';

import RenovationCalculator from '../components/calculators/renovations/RenovationCalculator';
import { INITIAL_RENOVATION_STATE } from '../components/calculators/renovations/utils/constants';
import { formatCurrency } from '../components/calculators/renovations/utils/calculations';

/**
 * Page principale du calculateur d'estimation des rénovations
 */
const RenovationCalculatorPage = () => {
  // État pour gérer les estimations sauvegardées
  const [savedEstimations, setSavedEstimations] = useState([]);
  
  // État pour gérer l'estimation active dans le calculateur
  const [currentEstimation, setCurrentEstimation] = useState(null);
  
  // État pour gérer l'ouverture/fermeture du calculateur
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  
  // État pour gérer les notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // État pour gérer la boîte de dialogue de confirmation de suppression
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    estimationId: null
  });

  // Charger les estimations sauvegardées au chargement de la page
  useEffect(() => {
    const loadSavedEstimations = () => {
      const savedData = localStorage.getItem('renovationEstimations');
      if (savedData) {
        try {
          setSavedEstimations(JSON.parse(savedData));
        } catch (error) {
          console.error('Erreur lors du chargement des estimations:', error);
          setSavedEstimations([]);
        }
      }
    };
    
    loadSavedEstimations();
  }, []);

  // Sauvegarder les estimations quand elles changent
  useEffect(() => {
    if (savedEstimations.length > 0) {
      localStorage.setItem('renovationEstimations', JSON.stringify(savedEstimations));
    }
  }, [savedEstimations]);

  // Ouvrir le calculateur pour créer une nouvelle estimation
  const handleNewEstimation = () => {
    setCurrentEstimation({
      ...INITIAL_RENOVATION_STATE,
      id: Date.now().toString()
    });
    setIsCalculatorOpen(true);
  };

  // Ouvrir le calculateur pour éditer une estimation existante
  const handleEditEstimation = (estimation) => {
    setCurrentEstimation(estimation);
    setIsCalculatorOpen(true);
  };

  // Dupliquer une estimation existante
  const handleDuplicateEstimation = (estimation) => {
    const duplicatedEstimation = {
      ...estimation,
      id: Date.now().toString(),
      generalInfo: {
        ...estimation.generalInfo,
        projectName: `${estimation.generalInfo.projectName} (copie)`
      }
    };
    
    setSavedEstimations([...savedEstimations, duplicatedEstimation]);
    
    setNotification({
      open: true,
      message: 'Estimation dupliquée avec succès',
      severity: 'success'
    });
  };

  // Fermer le calculateur
  const handleCloseCalculator = () => {
    setIsCalculatorOpen(false);
    setCurrentEstimation(null);
  };

  // Sauvegarder une estimation
  const handleSaveEstimation = (estimationData) => {
    const updatedEstimations = estimationData.id 
      ? savedEstimations.map(est => est.id === estimationData.id ? estimationData : est)
      : [...savedEstimations, { ...estimationData, id: Date.now().toString() }];
    
    setSavedEstimations(updatedEstimations);
    setIsCalculatorOpen(false);
    
    setNotification({
      open: true,
      message: 'Estimation sauvegardée avec succès',
      severity: 'success'
    });
  };

  // Ouvrir la boîte de dialogue de confirmation de suppression
  const handleDeleteConfirmOpen = (estimationId) => {
    setDeleteConfirm({
      open: true,
      estimationId
    });
  };

  // Fermer la boîte de dialogue de confirmation de suppression
  const handleDeleteConfirmClose = () => {
    setDeleteConfirm({
      open: false,
      estimationId: null
    });
  };

  // Supprimer une estimation
  const handleDeleteEstimation = () => {
    if (deleteConfirm.estimationId) {
      const updatedEstimations = savedEstimations.filter(
        est => est.id !== deleteConfirm.estimationId
      );
      
      setSavedEstimations(updatedEstimations);
      handleDeleteConfirmClose();
      
      setNotification({
        open: true,
        message: 'Estimation supprimée',
        severity: 'info'
      });
    }
  };

  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Calculateur d'estimation des rénovations
        </Typography>
        
        <Typography variant="body1" paragraph>
          Estimez rapidement et précisément le coût des rénovations pour vos projets immobiliers grâce à la méthode des 500$ des Secrets de l'immobilier.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNewEstimation}
          sx={{ mb: 3 }}
        >
          Nouvelle estimation
        </Button>
      </Box>
      
      {savedEstimations.length > 0 ? (
        <Grid container spacing={3}>
          {savedEstimations.map((estimation) => (
            <Grid item xs={12} md={6} lg={4} key={estimation.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {estimation.generalInfo.projectName || 'Estimation sans nom'}
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Type de propriété" 
                        secondary={estimation.generalInfo.propertyType || 'Non spécifié'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Adresse" 
                        secondary={estimation.generalInfo.address || 'Non spécifiée'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Nombre de pièces" 
                        secondary={estimation.rooms.length} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Coût total" 
                        secondary={formatCurrency(estimation.summary.grandTotal)} 
                      />
                    </ListItem>
                  </List>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <IconButton 
                      color="default" 
                      onClick={() => handleDuplicateEstimation(estimation)}
                      title="Dupliquer"
                    >
                      <DuplicateIcon />
                    </IconButton>
                    
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditEstimation(estimation)}
                      title="Modifier"
                    >
                      <EditIcon />
                    </IconButton>
                    
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteConfirmOpen(estimation.id)}
                      title="Supprimer"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Aucune estimation sauvegardée
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Cliquez sur "Nouvelle estimation" pour commencer
          </Typography>
        </Box>
      )}
      
      {/* Calculateur en mode dialog */}
      <Dialog
        open={isCalculatorOpen}
        onClose={handleCloseCalculator}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 0 }}>
          <RenovationCalculator
            initialData={currentEstimation}
            onSaveEstimation={handleSaveEstimation}
            onClose={handleCloseCalculator}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmation pour la suppression */}
      <Dialog
        open={deleteConfirm.open}
        onClose={handleDeleteConfirmClose}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette estimation? Cette action ne peut pas être annulée.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteEstimation} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RenovationCalculatorPage;
