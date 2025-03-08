import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import RenovationEstimationForm from './RenovationEstimationForm';
import RoomEstimationSection from './RoomEstimationSection';
import RenovationResultsSection from './RenovationResultsSection';

import { INITIAL_RENOVATION_STATE } from './utils/constants';
import { 
  calculateTotalRenovationCost,
  calculateContingencyAmount,
  calculateGrandTotal
} from './utils/calculations';

/**
 * Calculateur complet d'estimation des rénovations 
 * Basé sur la méthode des 500$ des Secrets de l'immobilier
 */
const RenovationCalculator = ({ initialData, onSaveEstimation, onClose }) => {
  // État principal du calculateur
  const [renovationData, setRenovationData] = useState(initialData || INITIAL_RENOVATION_STATE);
  
  // Étape active du processus
  const [activeStep, setActiveStep] = useState(0);
  
  // Étapes du processus
  const steps = ['Informations générales', 'Estimation par pièce', 'Résultats'];

  // Mettre à jour les calculs chaque fois que les données changent
  useEffect(() => {
    const totalRenovationCost = calculateTotalRenovationCost(renovationData.rooms);
    const contingencyAmount = calculateContingencyAmount(
      totalRenovationCost,
      renovationData.summary.contingencyPercentage
    );
    const grandTotal = calculateGrandTotal(totalRenovationCost, contingencyAmount);
    
    setRenovationData({
      ...renovationData,
      summary: {
        ...renovationData.summary,
        totalRenovationCost,
        contingencyAmount,
        grandTotal
      }
    });
  }, [renovationData.rooms, renovationData.summary.contingencyPercentage]);

  // Gérer la mise à jour d'une pièce
  const handleRoomUpdate = (updatedRoom) => {
    const updatedRooms = renovationData.rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    );
    
    setRenovationData({
      ...renovationData,
      rooms: updatedRooms
    });
  };

  // Gérer la suppression d'une pièce
  const handleRoomDelete = (roomId) => {
    const updatedRooms = renovationData.rooms.filter(room => room.id !== roomId);
    
    setRenovationData({
      ...renovationData,
      rooms: updatedRooms
    });
  };

  // Gérer l'exportation en PDF
  const handleExportPdf = () => {
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(16);
    doc.text('Estimation des coûts de rénovation', 14, 20);
    
    // Informations générales
    doc.setFontSize(12);
    doc.text('Informations du projet', 14, 30);
    
    doc.setFontSize(10);
    doc.text(`Nom du projet: ${renovationData.generalInfo.projectName || 'Non spécifié'}`, 14, 40);
    doc.text(`Adresse: ${renovationData.generalInfo.address || 'Non spécifiée'}`, 14, 45);
    doc.text(`Type de propriété: ${renovationData.generalInfo.propertyType || 'Non spécifié'}`, 14, 50);
    doc.text(`Superficie: ${renovationData.generalInfo.squareFootage > 0 ? renovationData.generalInfo.squareFootage + ' pi²' : 'Non spécifiée'}`, 14, 55);
    
    // Tableau des pièces
    doc.setFontSize(12);
    doc.text('Détail des coûts par pièce', 14, 65);
    
    const tableData = renovationData.rooms.map(room => [
      room.name || 'Sans nom',
      room.type,
      room.elements ? room.elements.length : 0,
      `$${room.totalCost.toLocaleString('fr-CA')}`,
      `${((room.totalCost / renovationData.summary.totalRenovationCost) * 100).toFixed(1)}%`
    ]);
    
    doc.autoTable({
      startY: 70,
      head: [['Pièce', 'Type', 'Éléments', 'Coût total', '% du budget']],
      body: tableData,
    });
    
    // Résumé
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.text('Résumé des coûts', 14, finalY);
    
    doc.setFontSize(10);
    doc.text(`Sous-total des rénovations: $${renovationData.summary.totalRenovationCost.toLocaleString('fr-CA')}`, 14, finalY + 10);
    doc.text(`Contingence (${renovationData.summary.contingencyPercentage}%): $${renovationData.summary.contingencyAmount.toLocaleString('fr-CA')}`, 14, finalY + 15);
    
    doc.setFontSize(12);
    doc.text(`Grand total: $${renovationData.summary.grandTotal.toLocaleString('fr-CA')}`, 14, finalY + 25);
    
    // Notes
    if (renovationData.generalInfo.notes) {
      doc.setFontSize(12);
      doc.text('Notes', 14, finalY + 35);
      
      doc.setFontSize(10);
      doc.text(renovationData.generalInfo.notes, 14, finalY + 45);
    }
    
    // Pied de page
    doc.setFontSize(8);
    doc.text('Estimation générée avec ImmoInvestPro - Calculateur de rénovations', 14, 280);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-CA')}`, 14, 285);
    
    // Télécharger le PDF
    doc.save(`Estimation_Renovations_${renovationData.generalInfo.projectName || 'Projet'}.pdf`);
  };

  // Gérer la sauvegarde de l'estimation
  const handleSaveEstimation = () => {
    if (onSaveEstimation) {
      onSaveEstimation(renovationData);
    }
  };

  // Passer à l'étape suivante
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Revenir à l'étape précédente
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Rendre l'étape active
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <RenovationEstimationForm 
            renovationData={renovationData}
            onDataChange={setRenovationData}
          />
        );
      case 1:
        return (
          <Box>
            {renovationData.rooms.map((room) => (
              <RoomEstimationSection
                key={room.id}
                room={room}
                onRoomUpdate={handleRoomUpdate}
                onDeleteRoom={handleRoomDelete}
              />
            ))}
            
            {renovationData.rooms.length === 0 && (
              <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
                Aucune pièce ajoutée. Retournez à l'étape précédente pour ajouter des pièces.
              </Typography>
            )}
          </Box>
        );
      case 2:
        return (
          <RenovationResultsSection
            renovationData={renovationData}
            onExportPdf={handleExportPdf}
            onSave={handleSaveEstimation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Calculateur d'estimation des rénovations
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Basé sur la méthode des 500$ des Secrets de l'immobilier
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={activeStep === 0 ? onClose : handleBack}
            sx={{ mr: 1 }}
          >
            {activeStep === 0 ? 'Fermer' : 'Précédent'}
          </Button>
          
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSaveEstimation : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RenovationCalculator;
