import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Divider,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Line } from 'react-chartjs-2';
import { 
  calculateYearlyAcquisitionStrategy,
  calculateRequiredUnits,
  generateAcquisitionModel
} from '../services/yearlyAcquisitionService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrement des composants nécessaires à Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * Composant de la page du calculateur Un immeuble par AN
 */
const YearlyAcquisitionCalculatorPage = () => {
  // État des différents onglets
  const [activeTab, setActiveTab] = useState(0);

  // État des formulaires
  const [requiredUnitsForm, setRequiredUnitsForm] = useState({
    targetMonthlyIncome: 5000,
    cashflowPerDoor: 75,
  });

  const [acquisitionStrategyForm, setAcquisitionStrategyForm] = useState({
    numberOfYears: 10,
    targetMonthlyIncome: 5000,
    initialProperty: {
      purchasePrice: 500000,
      unitCount: 5,
      cashflowPerDoor: 75,
      downPaymentPercentage: 0.2,
      appreciationRate: 0.03
    },
    subsequentProperties: {
      pricePerUnit: 100000,
      unitCountIncrement: 1,
      cashflowPerDoor: 75,
      downPaymentPercentage: 0.2,
      appreciationRate: 0.03
    }
  });

  // État des résultats
  const [requiredUnitsResult, setRequiredUnitsResult] = useState(null);
  const [acquisitionStrategyResult, setAcquisitionStrategyResult] = useState(null);
  
  // États de chargement et d'erreur
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gestionnaire de changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Gestionnaire de changement pour le formulaire du nombre d'unités requises
  const handleRequiredUnitsChange = (e) => {
    const { name, value } = e.target;
    setRequiredUnitsForm((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Gestionnaire de changement pour le formulaire de stratégie d'acquisition
  const handleAcquisitionStrategyChange = (section, field, e) => {
    const { value } = e.target;
    setAcquisitionStrategyForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: field === 'appreciationRate' || field === 'downPaymentPercentage' 
          ? parseFloat(value) / 100 
          : parseFloat(value) || 0
      }
    }));
  };

  // Calcul du nombre d'unités requises
  const handleCalculateRequiredUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await calculateRequiredUnits(requiredUnitsForm);
      setRequiredUnitsResult(result);
    } catch (err) {
      setError('Erreur lors du calcul: ' + (err.message || 'Veuillez vérifier vos données'));
    } finally {
      setLoading(false);
    }
  };

  // Calcul de la stratégie d'acquisition
  const handleCalculateStrategy = async () => {
    try {
      setLoading(true);
      setError(null);

      // Préparation des données à envoyer au service
      const properties = Array(acquisitionStrategyForm.numberOfYears).fill(0).map((_, index) => {
        if (index === 0) {
          // Première propriété (utiliser initialProperty)
          return {
            year: index + 1,
            purchasePrice: acquisitionStrategyForm.initialProperty.purchasePrice,
            unitCount: acquisitionStrategyForm.initialProperty.unitCount,
            cashflowPerDoor: acquisitionStrategyForm.initialProperty.cashflowPerDoor,
            downPaymentPercentage: acquisitionStrategyForm.initialProperty.downPaymentPercentage,
            appreciationRate: acquisitionStrategyForm.initialProperty.appreciationRate
          };
        } else {
          // Propriétés subséquentes (calculer en fonction des incréments)
          const unitCount = acquisitionStrategyForm.initialProperty.unitCount + 
            (index * acquisitionStrategyForm.subsequentProperties.unitCountIncrement);
          
          return {
            year: index + 1,
            purchasePrice: unitCount * acquisitionStrategyForm.subsequentProperties.pricePerUnit,
            unitCount,
            cashflowPerDoor: acquisitionStrategyForm.subsequentProperties.cashflowPerDoor,
            downPaymentPercentage: acquisitionStrategyForm.subsequentProperties.downPaymentPercentage,
            appreciationRate: acquisitionStrategyForm.subsequentProperties.appreciationRate
          };
        }
      });

      const data = {
        numberOfYears: acquisitionStrategyForm.numberOfYears,
        targetMonthlyIncome: acquisitionStrategyForm.targetMonthlyIncome,
        properties
      };

      const result = await calculateYearlyAcquisitionStrategy(data);
      setAcquisitionStrategyResult(result);
    } catch (err) {
      setError('Erreur lors du calcul: ' + (err.message || 'Veuillez vérifier vos données'));
    } finally {
      setLoading(false);
    }
  };

  // Préparation des données pour le graphique
  const prepareChartData = () => {
    if (!acquisitionStrategyResult || !acquisitionStrategyResult.yearlySnapshots) {
      return {
        labels: [],
        datasets: []
      };
    }

    const snapshots = acquisitionStrategyResult.yearlySnapshots;
    
    return {
      labels: snapshots.map(snapshot => `Année ${snapshot.year}`),
      datasets: [
        {
          label: 'Valeur du portefeuille ($)',
          data: snapshots.map(snapshot => snapshot.totalPortfolioValue),
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Équité ($)',
          data: snapshots.map(snapshot => snapshot.totalEquity),
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Cashflow mensuel ($)',
          data: snapshots.map(snapshot => snapshot.monthlyCashflow),
          borderColor: '#f57c00',
          backgroundColor: 'rgba(245, 124, 0, 0.1)',
          yAxisID: 'y1',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Valeur ($)'
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Cashflow mensuel ($)'
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Évolution du portefeuille immobilier'
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calculateur Un immeuble par AN
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Planifiez votre stratégie d'acquisition annuelle et calculez les projections pour atteindre votre indépendance financière
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Nombre de portes requises" />
        <Tab label="Stratégie d'acquisition" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Calculez combien de portes vous avez besoin
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Déterminez le nombre d'unités nécessaires pour atteindre votre revenu mensuel cible
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Revenu mensuel cible"
                    name="targetMonthlyIncome"
                    value={requiredUnitsForm.targetMonthlyIncome}
                    onChange={handleRequiredUnitsChange}
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cashflow par porte"
                    name="cashflowPerDoor"
                    value={requiredUnitsForm.cashflowPerDoor}
                    onChange={handleRequiredUnitsChange}
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={handleCalculateRequiredUnits}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Calculer'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {requiredUnitsResult && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Résultats
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Revenu mensuel cible
                      </Typography>
                      <Typography variant="h5">
                        {requiredUnitsResult.targetMonthlyIncome.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Cashflow par porte
                      </Typography>
                      <Typography variant="h5">
                        {requiredUnitsResult.cashflowPerDoor.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Nombre de portes requises
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {requiredUnitsResult.requiredUnits}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Temps estimé pour atteindre l'objectif
                      </Typography>
                      <Typography variant="h5">
                        {requiredUnitsResult.estimatedAchievementTime} ans
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Estimation basée sur l'acquisition d'un immeuble de 5 portes par an en moyenne.
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Paramètres de la stratégie d'acquisition
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre d'années"
                    name="numberOfYears"
                    value={acquisitionStrategyForm.numberOfYears}
                    onChange={(e) => setAcquisitionStrategyForm({
                      ...acquisitionStrategyForm,
                      numberOfYears: parseInt(e.target.value) || 0
                    })}
                    type="number"
                    inputProps={{ min: 1, max: 30 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Revenu mensuel cible"
                    name="targetMonthlyIncome"
                    value={acquisitionStrategyForm.targetMonthlyIncome}
                    onChange={(e) => setAcquisitionStrategyForm({
                      ...acquisitionStrategyForm,
                      targetMonthlyIncome: parseFloat(e.target.value) || 0
                    })}
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Premier immeuble (Année 1)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Prix d'achat"
                            value={acquisitionStrategyForm.initialProperty.purchasePrice}
                            onChange={(e) => handleAcquisitionStrategyChange('initialProperty', 'purchasePrice', e)}
                            type="number"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Nombre d'unités"
                            value={acquisitionStrategyForm.initialProperty.unitCount}
                            onChange={(e) => handleAcquisitionStrategyChange('initialProperty', 'unitCount', e)}
                            type="number"
                            inputProps={{ min: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Cashflow par porte"
                            value={acquisitionStrategyForm.initialProperty.cashflowPerDoor}
                            onChange={(e) => handleAcquisitionStrategyChange('initialProperty', 'cashflowPerDoor', e)}
                            type="number"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Mise de fonds (%)"
                            value={acquisitionStrategyForm.initialProperty.downPaymentPercentage * 100}
                            onChange={(e) => handleAcquisitionStrategyChange('initialProperty', 'downPaymentPercentage', e)}
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Taux d'appréciation annuel (%)"
                            value={acquisitionStrategyForm.initialProperty.appreciationRate * 100}
                            onChange={(e) => handleAcquisitionStrategyChange('initialProperty', 'appreciationRate', e)}
                            type="number"
                            inputProps={{ min: 0, max: 20, step: 0.1 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                
                <Grid item xs={12}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Immeubles subséquents (Années 2+)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Prix par unité"
                            value={acquisitionStrategyForm.subsequentProperties.pricePerUnit}
                            onChange={(e) => handleAcquisitionStrategyChange('subsequentProperties', 'pricePerUnit', e)}
                            type="number"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Incrément du nombre d'unités"
                            value={acquisitionStrategyForm.subsequentProperties.unitCountIncrement}
                            onChange={(e) => handleAcquisitionStrategyChange('subsequentProperties', 'unitCountIncrement', e)}
                            type="number"
                            inputProps={{ min: 0 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Cashflow par porte"
                            value={acquisitionStrategyForm.subsequentProperties.cashflowPerDoor}
                            onChange={(e) => handleAcquisitionStrategyChange('subsequentProperties', 'cashflowPerDoor', e)}
                            type="number"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Mise de fonds (%)"
                            value={acquisitionStrategyForm.subsequentProperties.downPaymentPercentage * 100}
                            onChange={(e) => handleAcquisitionStrategyChange('subsequentProperties', 'downPaymentPercentage', e)}
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Taux d'appréciation annuel (%)"
                            value={acquisitionStrategyForm.subsequentProperties.appreciationRate * 100}
                            onChange={(e) => handleAcquisitionStrategyChange('subsequentProperties', 'appreciationRate', e)}
                            type="number"
                            inputProps={{ min: 0, max: 20, step: 0.1 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={handleCalculateStrategy}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Calculer la stratégie'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {acquisitionStrategyResult && (
              <>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Résultats de la stratégie
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Valeur finale du portefeuille
                        </Typography>
                        <Typography variant="h5">
                          {acquisitionStrategyResult.summary.finalPortfolioValue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Équité finale
                        </Typography>
                        <Typography variant="h5">
                          {acquisitionStrategyResult.summary.finalEquity.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Cashflow mensuel final
                        </Typography>
                        <Typography variant="h5">
                          {acquisitionStrategyResult.summary.finalMonthlyCashflow.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Capital total investi
                        </Typography>
                        <Typography variant="h5">
                          {acquisitionStrategyResult.summary.totalInvestedCapital.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Rendement sur investissement
                        </Typography>
                        <Typography variant="h5">
                          {acquisitionStrategyResult.summary.returnOnInvestment.toFixed(2)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Taux de croissance annuel composé
                        </Typography>
                        <Typography variant="h5">
                          {acquisitionStrategyResult.summary.portfolioGrowthRate.toFixed(2)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Objectif de revenu mensuel
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h5" sx={{ mr: 2 }}>
                            {acquisitionStrategyResult.summary.targetAchieved ? 'Atteint' : 'Non atteint'}
                          </Typography>
                          {acquisitionStrategyResult.summary.targetAchieved && (
                            <Typography variant="body1">
                              en {acquisitionStrategyResult.summary.yearsToTarget} ans
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Box sx={{ height: 400, mb: 3 }}>
                  <Line data={prepareChartData()} options={chartOptions} />
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Année</TableCell>
                        <TableCell>Nouvelles unités</TableCell>
                        <TableCell>Unités totales</TableCell>
                        <TableCell>Valeur du portefeuille</TableCell>
                        <TableCell>Équité</TableCell>
                        <TableCell>Cashflow mensuel</TableCell>
                        <TableCell>Objectif</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {acquisitionStrategyResult.yearlySnapshots.map((snapshot) => (
                        <TableRow key={snapshot.year}>
                          <TableCell>{snapshot.year}</TableCell>
                          <TableCell>{snapshot.newUnitCount}</TableCell>
                          <TableCell>{snapshot.totalUnitCount}</TableCell>
                          <TableCell>
                            {snapshot.totalPortfolioValue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </TableCell>
                          <TableCell>
                            {snapshot.totalEquity.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </TableCell>
                          <TableCell>
                            {snapshot.monthlyCashflow.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </TableCell>
                          <TableCell>
                            {snapshot.yearlyKPI.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default YearlyAcquisitionCalculatorPage;
