import React, { useState, useEffect } from 'react';
import LiquidityCalculatorUtility from '../../utilities/LiquidityCalculatorUtility';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  ChevronRight as ChevronRightIcon,
  LocalAtm as LocalAtmIcon,
  TrendingUp as TrendingUpIcon,
  AssessmentOutlined as AssessmentIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';

// Composants d'affichage des tableaux
const ResultsTable = ({ title, data, formatter = val => val }) => (
  <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: 'primary.light' }}>
          <TableCell colSpan={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {title}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(data).map(([key, value]) => (
          <TableRow key={key} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
            <TableCell component="th" scope="row" width="60%">
              {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
            </TableCell>
            <TableCell align="right">{formatter(value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// Fonction d'aide pour formater les valeurs monétaires
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-CA', { 
    style: 'currency', 
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Fonction d'aide pour formater les pourcentages
const formatPercent = (value) => {
  return new Intl.NumberFormat('fr-CA', { 
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Composant pour afficher un tableau de résultats de sensibilité
const SensitivityTable = ({ title, data, valueKey, variationKey = 'variation' }) => (
  <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: 'primary.light' }}>
          <TableCell colSpan={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {title}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Variation</TableCell>
          <TableCell align="right">Résultat</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow 
            key={index} 
            sx={{ 
              '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
              bgcolor: item[variationKey] === 0 || item[variationKey] === '0' ? 'success.light' : ''
            }}
          >
            <TableCell component="th" scope="row">
              {typeof item[variationKey] === 'string' ? item[variationKey] : (item[variationKey] > 0 ? `+${item[variationKey]}` : item[variationKey])}
            </TableCell>
            <TableCell align="right">
              {valueKey === 'cashflowPerUnit' ? formatCurrency(item[valueKey]) + '/unité' : 
              valueKey === 'monthlyCashflow' ? formatCurrency(item[valueKey]) : 
              valueKey === 'dscr' ? item[valueKey].toFixed(2) : 
              valueKey === 'capRate' ? `${item[valueKey].toFixed(2)}%` : 
              item[valueKey]}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// Fonction pour créer un composant d'onglets dynamique
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ padding: '20px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// Composant principal du calculateur de liquidité
function LiquidityCalculatorComponent() {
  // État pour les données d'entrée
  const [propertyData, setPropertyData] = useState({
    purchasePrice: 500000,
    grossAnnualRent: 60000,
    units: 5,
    renovationCost: 10000,
    downPaymentRatio: 0.25,
    interestRate: 4.5,
    amortizationYears: 25,
    expenseRatio: 40,
    vacancyRate: 5,
    appreciationRate: 2,
    holdingPeriod: 5
  });

  // État pour les résultats des calculs
  const [results, setResults] = useState({
    liquidityResults: null,
    totalReturnResults: null,
    sensitivityResults: null,
    breakEvenResults: null,
    riskAnalysisResults: null
  });

  // État pour les erreurs
  const [error, setError] = useState(null);
  
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState(0);

  // État pour le chargement
  const [loading, setLoading] = useState(false);

  // Effectue les calculs lorsque les données d'entrée changent
  useEffect(() => {
    try {
      calculateAll();
    } catch (err) {
      // Les erreurs ne sont pas affichées automatiquement car on ne veut pas bloquer l'utilisateur
      // pendant qu'il entre des données
      console.error('Erreur de calcul:', err.message);
    }
  }, []);

  // Fonction pour traiter les changements dans les champs de saisie
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Conversion selon le type de champ
    if (['purchasePrice', 'grossAnnualRent', 'units', 'renovationCost', 'amortizationYears', 'holdingPeriod'].includes(name)) {
      parsedValue = parseInt(value) || 0;
    } else if (['downPaymentRatio', 'interestRate', 'expenseRatio', 'vacancyRate', 'appreciationRate'].includes(name)) {
      // Pour les pourcentages, on divise par 100 si nécessaire
      if (name === 'downPaymentRatio') {
        parsedValue = parseFloat(value) || 0;
      } else {
        parsedValue = parseFloat(value) || 0;
      }
    }
    
    setPropertyData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  // Fonction pour effectuer tous les calculs
  const calculateAll = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validation des données
      if (propertyData.purchasePrice <= 0) throw new Error('Le prix d\'achat doit être un nombre positif');
      if (propertyData.grossAnnualRent <= 0) throw new Error('Les revenus locatifs doivent être un nombre positif');
      if (propertyData.units <= 0) throw new Error('Le nombre d\'unités doit être un nombre positif');
      if (propertyData.interestRate <= 0) throw new Error('Le taux d\'intérêt doit être un nombre positif');
      if (propertyData.amortizationYears <= 0) throw new Error('La période d\'amortissement doit être un nombre positif');
      
      // Calculer la liquidité
      const liquidityResults = LiquidityCalculatorUtility.calculateLiquidity(propertyData);
      
      // Calculer le rendement total
      const totalReturnResults = LiquidityCalculatorUtility.calculateTotalReturn(propertyData);
      
      // Analyse de sensibilité
      const sensitivityResults = LiquidityCalculatorUtility.performSensitivityAnalysis(propertyData);
      
      // Calcul du point d'équilibre
      const breakEvenResults = LiquidityCalculatorUtility.calculateBreakeven(propertyData);
      
      // Analyse des risques
      const riskAnalysisResults = LiquidityCalculatorUtility.analyzeRisks(propertyData);
      
      // Mettre à jour les résultats
      setResults({
        liquidityResults,
        totalReturnResults,
        sensitivityResults,
        breakEvenResults,
        riskAnalysisResults
      });
      
    } catch (err) {
      console.error('Erreur lors des calculs:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser les données
  const resetData = () => {
    setPropertyData({
      purchasePrice: 500000,
      grossAnnualRent: 60000,
      units: 5,
      renovationCost: 10000,
      downPaymentRatio: 0.25,
      interestRate: 4.5,
      amortizationYears: 25,
      expenseRatio: 40,
      vacancyRate: 5,
      appreciationRate: 2,
      holdingPeriod: 5
    });
    
    // Recalculer avec les nouvelles valeurs
    setTimeout(() => calculateAll(), 100);
  };

  // Gestionnaire de changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Calculateur de Liquidité et de Rentabilité Immobilière
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Formulaire de saisie des données */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Informations de la propriété
              </Typography>
              
              <TextField
                fullWidth
                label="Prix d'achat ($)"
                name="purchasePrice"
                type="number"
                value={propertyData.purchasePrice}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ endAdornment: '$' }}
              />
              
              <TextField
                fullWidth
                label="Revenu locatif annuel brut ($)"
                name="grossAnnualRent"
                type="number"
                value={propertyData.grossAnnualRent}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ endAdornment: '$' }}
              />
              
              <TextField
                fullWidth
                label="Nombre d'unités"
                name="units"
                type="number"
                value={propertyData.units}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Coût des rénovations ($)"
                name="renovationCost"
                type="number"
                value={propertyData.renovationCost}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ endAdornment: '$' }}
              />
              
              <TextField
                fullWidth
                label="Mise de fonds (%)"
                name="downPaymentRatio"
                type="number"
                value={propertyData.downPaymentRatio * 100}
                onChange={(e) => handleInputChange({
                  target: {
                    name: 'downPaymentRatio',
                    value: parseFloat(e.target.value) / 100 || 0
                  }
                })}
                sx={{ mb: 2 }}
                InputProps={{ endAdornment: '%' }}
              />
              
              <TextField
                fullWidth
                label="Taux d'intérêt (%)"
                name="interestRate"
                type="number"
                value={propertyData.interestRate}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ endAdornment: '%' }}
              />
              
              <TextField
                fullWidth
                label="Période d'amortissement (années)"
                name="amortizationYears"
                type="number"
                value={propertyData.amortizationYears}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Ratio de dépenses (%)"
                name="expenseRatio"
                type="number"
                value={propertyData.expenseRatio}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ endAdornment: '%' }}
              />
              
              <TextField
                fullWidth
                label="Taux d'inoccupation (%)"
                name="vacancyRate"
                type="number"
                value={propertyData.vacancyRate}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ endAdornment: '%' }}
              />
              
              <TextField
                fullWidth
                label="Taux d'appréciation annuel (%)"
                name="appreciationRate"
                type="number"
                value={propertyData.appreciationRate}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{ endAdornment: '%' }}
              />
              
              <TextField
                fullWidth
                label="Période de détention (années)"
                name="holdingPeriod"
                type="number"
                value={propertyData.holdingPeriod}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
              />
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={calculateAll}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              >
                {loading ? 'Calcul en cours...' : 'Calculer'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                fullWidth 
                onClick={resetData}
                sx={{ mt: 1 }}
                startIcon={<RefreshIcon />}
              >
                Réinitialiser
              </Button>
            </Paper>
          </Grid>
          
          {/* Affichage des résultats */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab icon={<LocalAtmIcon />} label="Liquidité" />
                  <Tab icon={<TrendingUpIcon />} label="Rendement" />
                  <Tab icon={<AssessmentIcon />} label="Sensibilité" />
                  <Tab icon={<WarningIcon />} label="Risques" />
                </Tabs>
              </Box>
              
              <TabPanel value={activeTab} index={0}>
                {results.liquidityResults ? (
                  <>
                    <Typography variant="h6" gutterBottom color="primary">
                      Résultats de Liquidité
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <ResultsTable 
                          title="Analyse du Cashflow" 
                          data={{
                            'Revenu annuel (après inoccupation)': results.liquidityResults.cashflow.annualRevenueAfterVacancy,
                            'Dépenses annuelles': results.liquidityResults.cashflow.annualExpenses,
                            'Revenu net d\'exploitation (NOI)': results.liquidityResults.cashflow.netOperatingIncome,
                            'Paiement hypothécaire annuel': results.liquidityResults.cashflow.annualMortgagePayment,
                            'Cashflow annuel': results.liquidityResults.cashflow.annualCashflow,
                            'Cashflow mensuel': results.liquidityResults.cashflow.monthlyCashflow,
                            'Cashflow mensuel par unité': results.liquidityResults.cashflow.cashflowPerUnit
                          }}
                          formatter={formatCurrency}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <ResultsTable 
                          title="Ratios Financiers" 
                          data={{
                            'Taux de capitalisation (Cap Rate)': `${results.liquidityResults.ratios.capRate.toFixed(2)}%`,
                            'Ratio Loyer/Valeur': `${results.liquidityResults.ratios.rentToValue.toFixed(2)}%`,
                            'Ratio de couverture du service de la dette (DSCR)': results.liquidityResults.ratios.dscr.toFixed(2),
                            'Multiplicateur de revenu brut (GRM)': results.liquidityResults.ratios.grm.toFixed(2),
                            'Ratio MRB (1/GRM)': results.liquidityResults.ratios.mrb.toFixed(4)
                          }}
                        />
                      </Grid>
                    </Grid>
                    
                    {results.breakEvenResults && (
                      <>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                          Analyse du Point d'Équilibre
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <ResultsTable 
                              title="Points d'Équilibre" 
                              data={{
                                'Taux d\'occupation minimum': `${results.breakEvenResults.breakEvenPoints.occupancyRate}%`,
                                'Pourcentage du loyer actuel requis': `${results.breakEvenResults.breakEvenPoints.rentPercent}%`,
                                'Loyer mensuel minimum par unité': formatCurrency(results.breakEvenResults.breakEvenPoints.minimumMonthlyRentPerUnit),
                                'Taux d\'intérêt maximum': `${results.breakEvenResults.breakEvenPoints.maxInterestRate}%`
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <ResultsTable 
                              title="Marges de Sécurité" 
                              data={{
                                'Marge d\'occupation': `${results.breakEvenResults.safety.occupancyMargin}%`,
                                'Marge de loyer': `${results.breakEvenResults.safety.rentMargin}%`,
                                'Marge de taux d\'intérêt': `${results.breakEvenResults.safety.interestRateMargin}%`
                              }}
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Typography>Veuillez calculer les résultats</Typography>
                    )}
                  </Box>
                )}
              </TabPanel>
              
              <TabPanel value={activeTab} index={1}>
                {results.totalReturnResults ? (
                  <>
                    <Typography variant="h6" gutterBottom color="primary">
                      Analyse du Rendement Total
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <ResultsTable 
                          title="Investissement Initial" 
                          data={{
                            'Mise de fonds': results.totalReturnResults.initialInvestment.downPayment,
                            'Coût des rénovations': results.totalReturnResults.initialInvestment.renovationCost,
                            'Investissement total': results.totalReturnResults.initialInvestment.totalInvestment
                          }}
                          formatter={formatCurrency}
                        />
                        
                        <ResultsTable 
                          title="Valeur Future" 
                          data={{
                            'Valeur initiale de la propriété': results.totalReturnResults.futureValue.initialPropertyValue,
                            'Valeur finale de la propriété': results.totalReturnResults.futureValue.finalPropertyValue,
                            'Taux d\'appréciation annuel': `${results.totalReturnResults.futureValue.appreciationRate}%`
                          }}
                          formatter={(val) => typeof val === 'number' ? formatCurrency(val) : val}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <ResultsTable 
                          title="Gains" 
                          data={{
                            'Gain en capital': results.totalReturnResults.gains.capitalGain,
                            'Gain en équité (remboursement du prêt)': results.totalReturnResults.gains.equityGainFromLoanPaydown,
                            'Cashflow cumulé': results.totalReturnResults.gains.cumulativeCashflow,
                            'Gain total': results.totalReturnResults.gains.totalGain
                          }}
                          formatter={formatCurrency}
                        />
                        
                        <ResultsTable 
                          title="Rendements" 
                          data={{
                            'ROI total sur la période': `${results.totalReturnResults.returns.totalROI}%`,
                            'ROI annualisé': `${results.totalReturnResults.returns.annualizedROI}%`,
                            'Période de détention (années)': results.totalReturnResults.details.holdingPeriod,
                            'Cashflow mensuel': formatCurrency(results.totalReturnResults.details.monthlyCashflow),
                            'Cashflow annuel': formatCurrency(results.totalReturnResults.details.annualCashflow)
                          }}
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Typography>Veuillez calculer les résultats</Typography>
                    )}
                  </Box>
                )}
              </TabPanel>
              
              <TabPanel value={activeTab} index={2}>
                {results.sensitivityResults ? (
                  <>
                    <Typography variant="h6" gutterBottom color="primary">
                      Analyse de Sensibilité
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Cas de base: Taux d'intérêt {results.sensitivityResults.baseCase.interestRate}%, 
                      Inoccupation {results.sensitivityResults.baseCase.vacancyRate}%, 
                      Dépenses {results.sensitivityResults.baseCase.expenseRatio}%
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <SensitivityTable 
                          title="Sensibilité au Taux d'Intérêt" 
                          data={results.sensitivityResults.sensitivityResults.interestRate}
                          valueKey="cashflowPerUnit"
                        />
                        
                        <SensitivityTable 
                          title="Sensibilité au Taux d'Inoccupation" 
                          data={results.sensitivityResults.sensitivityResults.vacancyRate}
                          valueKey="cashflowPerUnit"
                          variationKey="vacancyRate"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <SensitivityTable 
                          title="Sensibilité au Ratio de Dépenses" 
                          data={results.sensitivityResults.sensitivityResults.expenseRatio}
                          valueKey="cashflowPerUnit"
                        />
                        
                        <SensitivityTable 
                          title="Sensibilité au Loyer" 
                          data={results.sensitivityResults.sensitivityResults.rent}
                          valueKey="cashflowPerUnit"
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Typography>Veuillez calculer les résultats</Typography>
                    )}
                  </Box>
                )}
              </TabPanel>
              
              <TabPanel value={activeTab} index={3}>
                {results.riskAnalysisResults ? (
                  <>
                    <Typography variant="h6" gutterBottom color="primary">
                      Analyse des Risques
                    </Typography>
                    
                    <Box sx={{ 
                      mb: 3, 
                      p: 2, 
                      bgcolor: 
                        results.riskAnalysisResults.overallRisk === 'Faible' ? 'success.light' : 
                        results.riskAnalysisResults.overallRisk === 'Modéré' ? 'warning.light' : 
                        'error.light',
                      borderRadius: 1
                    }}>
                      <Typography variant="h6">
                        Niveau de risque global: {results.riskAnalysisResults.overallRisk} ({results.riskAnalysisResults.riskScore}%)
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'primary.light' }}>
                                <TableCell>Facteur de risque</TableCell>
                                <TableCell>Niveau</TableCell>
                                <TableCell>Description</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(results.riskAnalysisResults.riskFactors).map(([key, risk]) => (
                                <TableRow 
                                  key={key}
                                  sx={{ 
                                    bgcolor: 
                                      risk.level === 'Élevé' ? 'error.light' : 
                                      risk.level === 'Moyen' ? 'warning.light' :
                                      risk.level === 'Faible' ? 'success.light' :
                                      'info.light'
                                  }}
                                >
                                  <TableCell>
                                    {key === 'cashflow' ? 'Cashflow' : 
                                    key === 'dscr' ? 'DSCR' :
                                    key === 'lvr' ? 'Ratio prêt/valeur' :
                                    key === 'vacancy' ? 'Inoccupation' :
                                    key === 'interestRate' ? 'Taux d\'intérêt' : key}
                                  </TableCell>
                                  <TableCell>{risk.level}</TableCell>
                                  <TableCell>{risk.description}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        
                        {results.riskAnalysisResults.recommendations.length > 0 && (
                          <Paper sx={{ p: 2, mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Recommandations
                            </Typography>
                            <ul>
                              {results.riskAnalysisResults.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </Paper>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Tests de Stress
                        </Typography>
                        
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'primary.light' }}>
                                <TableCell>Scénario</TableCell>
                                <TableCell align="right">Cashflow/unité</TableCell>
                                <TableCell align="right">DSCR</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Cas de base</TableCell>
                                <TableCell align="right">{formatCurrency(results.liquidityResults.cashflow.cashflowPerUnit)}</TableCell>
                                <TableCell align="right">{results.liquidityResults.ratios.dscr.toFixed(2)}</TableCell>
                              </TableRow>
                              <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell>Taux d'intérêt +3%</TableCell>
                                <TableCell align="right">{formatCurrency(results.riskAnalysisResults.stressTest.interestRateIncrease3.cashflowPerUnit)}</TableCell>
                                <TableCell align="right">{results.riskAnalysisResults.stressTest.interestRateIncrease3.dscr.toFixed(2)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Inoccupation 10%</TableCell>
                                <TableCell align="right">{formatCurrency(results.riskAnalysisResults.stressTest.vacancy10Percent.cashflowPerUnit)}</TableCell>
                                <TableCell align="right">{results.riskAnalysisResults.stressTest.vacancy10Percent.dscr.toFixed(2)}</TableCell>
                              </TableRow>
                              <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell>Dépenses +15%</TableCell>
                                <TableCell align="right">{formatCurrency(results.riskAnalysisResults.stressTest.expenseIncrease15Percent.cashflowPerUnit)}</TableCell>
                                <TableCell align="right">{results.riskAnalysisResults.stressTest.expenseIncrease15Percent.dscr.toFixed(2)}</TableCell>
                              </TableRow>
                              <TableRow sx={{ bgcolor: 'error.lighter' }}>
                                <TableCell>Combiné (Int+2%, Inoc 5%, Dép+10%)</TableCell>
                                <TableCell align="right">{formatCurrency(results.riskAnalysisResults.stressTest.combinedStress.cashflowPerUnit)}</TableCell>
                                <TableCell align="right">{results.riskAnalysisResults.stressTest.combinedStress.dscr.toFixed(2)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Typography>Veuillez calculer les résultats</Typography>
                    )}
                  </Box>
                )}
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default LiquidityCalculatorComponent;