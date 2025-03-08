import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { PictureAsPdf as PdfIcon, Save as SaveIcon } from '@mui/icons-material';
import { formatCurrency } from './utils/calculations';

/**
 * Composant pour afficher les résultats du calculateur d'estimation des rénovations
 */
const RenovationResultsSection = ({ renovationData, onExportPdf, onSave }) => {
  const { rooms, summary, generalInfo } = renovationData;

  // Pas de résultats à afficher si aucune pièce n'a été ajoutée
  if (!rooms || rooms.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Résultats" />
        <CardContent>
          <Alert severity="info">
            Ajoutez des pièces et des éléments à rénover pour voir les résultats ici.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader 
        title="Résultats de l'estimation"
        action={
          <Box sx={{ display: 'flex' }}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={onSave}
              sx={{ mr: 1 }}
            >
              Sauvegarder
            </Button>
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={onExportPdf}
            >
              Exporter en PDF
            </Button>
          </Box>
        }
      />
      <CardContent>
        {/* Informations générales du projet */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Informations du projet
            </Typography>
            <Typography variant="body2">
              <strong>Nom du projet:</strong> {generalInfo.projectName || 'Non spécifié'}
            </Typography>
            <Typography variant="body2">
              <strong>Adresse:</strong> {generalInfo.address || 'Non spécifiée'}
            </Typography>
            <Typography variant="body2">
              <strong>Type de propriété:</strong> {generalInfo.propertyType || 'Non spécifié'}
            </Typography>
            <Typography variant="body2">
              <strong>Superficie:</strong> {generalInfo.squareFootage > 0 ? `${generalInfo.squareFootage} pi²` : 'Non spécifiée'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Résumé
            </Typography>
            <Typography variant="body2">
              <strong>Nombre de pièces:</strong> {rooms.length}
            </Typography>
            <Typography variant="body2">
              <strong>Coût total des rénovations:</strong> {formatCurrency(summary.totalRenovationCost)}
            </Typography>
            <Typography variant="body2">
              <strong>Contingence ({summary.contingencyPercentage}%):</strong> {formatCurrency(summary.contingencyAmount)}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              <strong>Grand total:</strong> {formatCurrency(summary.grandTotal)}
            </Typography>
          </Grid>
        </Grid>

        {/* Tableau détaillé des coûts par pièce */}
        <Typography variant="subtitle1" gutterBottom>
          Détail des coûts par pièce
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pièce</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Nombre d'éléments</TableCell>
                <TableCell align="right">Coût total</TableCell>
                <TableCell align="right">% du budget</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name || 'Sans nom'}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell align="right">{room.elements ? room.elements.length : 0}</TableCell>
                  <TableCell align="right">{formatCurrency(room.totalCost)}</TableCell>
                  <TableCell align="right">
                    {summary.totalRenovationCost > 0
                      ? `${((room.totalCost / summary.totalRenovationCost) * 100).toFixed(1)}%`
                      : '0%'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Résumé des coûts */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Notes
            </Typography>
            <Typography variant="body2">
              {generalInfo.notes || 'Aucune note'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2">
                <strong>Sous-total des rénovations:</strong> {formatCurrency(summary.totalRenovationCost)}
              </Typography>
              <Typography variant="body2">
                <strong>Contingence ({summary.contingencyPercentage}%):</strong> {formatCurrency(summary.contingencyAmount)}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                <strong>Grand total:</strong> {formatCurrency(summary.grandTotal)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RenovationResultsSection;
