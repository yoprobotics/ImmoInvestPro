import React from 'react';
import { 
  Typography, Grid, Paper, Box, Divider, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Alert,
  LinearProgress
} from '@mui/material';
import { 
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

/**
 * Composant pour afficher les résultats de l'analyse d'un immeuble MULTI
 */
const ResultsAnalysis = ({ propertyData }) => {
  // Calculer les résultats financiers
  const calculateResults = () => {
    // Total des revenus
    const totalRevenue = (propertyData.grossRevenue || 0) + (propertyData.otherRevenue || 0);
    
    // Total des dépenses
    const totalExpenses = Object.values(propertyData.expenses || {}).reduce((sum, value) => sum + (value || 0), 0);
    
    // Revenu net d'opération (RNO)
    const netOperatingIncome = totalRevenue - totalExpenses;
    
    // Calcul du paiement hypothécaire mensuel
    const monthlyInterestRate = (propertyData.financing?.interestRate || 0) / 100 / 12;
    const numberOfPayments = (propertyData.financing?.amortizationYears || 25) * 12;
    const loanAmount = propertyData.financing?.loanAmount || 0;
    
    let monthlyBankPayment = 0;
    if (monthlyInterestRate > 0) {
      monthlyBankPayment = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyBankPayment = loanAmount / numberOfPayments;
    }
    
    // Paiements pour le financement créatif
    let vendorPayment = 0;
    let investorPayment = 0;
    
    if (propertyData.creativeFinancing?.enabled) {
      // Balance de vente
      const vendorAmount = propertyData.creativeFinancing.vendorBalance || 0;
      const vendorRate = propertyData.creativeFinancing.vendorBalanceRate || 0;
      if (vendorAmount > 0 && vendorRate > 0) {
        vendorPayment = (vendorAmount * (vendorRate / 100)) / 12;
      }
      
      // Investisseur privé
      const investorAmount = propertyData.creativeFinancing.privateInvestor || 0;
      const investorRate = propertyData.creativeFinancing.privateInvestorRate || 0;
      if (investorAmount > 0 && investorRate > 0) {
        investorPayment = (investorAmount * (investorRate / 100)) / 12;
      }
    }
    
    const totalMonthlyPayment = monthlyBankPayment + vendorPayment + investorPayment;
    const annualPayment = totalMonthlyPayment * 12;
    
    // Cashflow annuel
    const annualCashflow = netOperatingIncome - annualPayment;
    
    // Cashflow mensuel par porte
    const units = propertyData.units || 0;
    const monthlyCashflowPerUnit = units > 0 ? annualCashflow / units / 12 : 0;
    
    // Taux de rendement
    const totalInvestment = (propertyData.financing?.downPayment || 0);
    const cashOnCashReturn = totalInvestment > 0 ? (annualCashflow / totalInvestment) * 100 : 0;
    
    // Multiplicateur de revenu brut (MRB)
    const grossRevenuMultiplier = totalRevenue > 0 ? propertyData.price / totalRevenue : 0;
    
    // Ratio de couverture de la dette (DCR)
    const debtCoverageRatio = annualPayment > 0 ? netOperatingIncome / annualPayment : 0;
    
    // Taux de capitalisation (Cap Rate)
    const capRate = propertyData.price > 0 ? (netOperatingIncome / propertyData.price) * 100 : 0;
    
    // Valeur basée sur le taux de capitalisation
    const marketCapRate = 5.5; // Taux de capitalisation moyen du marché (à ajuster selon le marché)
    const marketValueBasedOnCapRate = netOperatingIncome > 0 ? netOperatingIncome / (marketCapRate / 100) : 0;
    
    // Équité potentielle (différence entre valeur basée sur le cap rate et prix d'achat)
    const potentialEquity = marketValueBasedOnCapRate - propertyData.price;
    
    return {
      totalRevenue,
      totalExpenses,
      netOperatingIncome,
      annualPayment,
      annualCashflow,
      monthlyCashflowPerUnit,
      cashOnCashReturn,
      grossRevenuMultiplier,
      debtCoverageRatio,
      capRate,
      marketValueBasedOnCapRate,
      potentialEquity,
      expenseRatio: totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0
    };
  };
  
  const results = calculateResults();
  
  // Fonction pour évaluer les indicateurs
  const evaluateIndicator = (value, thresholds) => {
    if (value >= thresholds.good) return { status: 'good', color: 'success.main', icon: <CheckIcon color="success" /> };
    if (value >= thresholds.fair) return { status: 'fair', color: 'warning.main', icon: <WarningIcon color="warning" /> };
    return { status: 'poor', color: 'error.main', icon: <ErrorIcon color="error" /> };
  };
  
  // Fonction pour évaluer les indicateurs inversés (plus petit = meilleur)
  const evaluateReverseIndicator = (value, thresholds) => {
    if (value <= thresholds.good) return { status: 'good', color: 'success.main', icon: <CheckIcon color="success" /> };
    if (value <= thresholds.fair) return { status: 'fair', color: 'warning.main', icon: <WarningIcon color="warning" /> };
    return { status: 'poor', color: 'error.main', icon: <ErrorIcon color="error" /> };
  };
  
  // Évaluation des indicateurs clés
  const indicatorEvaluations = {
    cashflow: evaluateIndicator(results.monthlyCashflowPerUnit, { good: 75, fair: 40 }),
    cashOnCash: evaluateIndicator(results.cashOnCashReturn, { good: 10, fair: 5 }),
    capRate: evaluateIndicator(results.capRate, { good: 6, fair: 4 }),
    dcr: evaluateIndicator(results.debtCoverageRatio, { good: 1.25, fair: 1.1 }),
    grm: evaluateReverseIndicator(results.grossRevenuMultiplier, { good: 8, fair: 10 }),
    expenseRatio: evaluateReverseIndicator(results.expenseRatio, { good: 40, fair: 50 })
  };
  
  // Score global de l'investissement (sur 100)
  const calculateOverallScore = () => {
    const weights = {
      cashflow: 30,
      cashOnCash: 20,
      capRate: 15,
      dcr: 15,
      grm: 10,
      expenseRatio: 10
    };
    
    let totalScore = 0;
    
    // Cashflow par porte
    if (results.monthlyCashflowPerUnit >= 75) totalScore += weights.cashflow;
    else if (results.monthlyCashflowPerUnit >= 40) totalScore += weights.cashflow * 0.7;
    else if (results.monthlyCashflowPerUnit >= 0) totalScore += weights.cashflow * 0.4;
    
    // Cash-on-cash return
    if (results.cashOnCashReturn >= 10) totalScore += weights.cashOnCash;
    else if (results.cashOnCashReturn >= 5) totalScore += weights.cashOnCash * 0.7;
    else if (results.cashOnCashReturn >= 0) totalScore += weights.cashOnCash * 0.4;
    
    // Cap Rate
    if (results.capRate >= 6) totalScore += weights.capRate;
    else if (results.capRate >= 4) totalScore += weights.capRate * 0.7;
    else if (results.capRate >= 0) totalScore += weights.capRate * 0.4;
    
    // DCR
    if (results.debtCoverageRatio >= 1.25) totalScore += weights.dcr;
    else if (results.debtCoverageRatio >= 1.1) totalScore += weights.dcr * 0.7;
    else if (results.debtCoverageRatio >= 1) totalScore += weights.dcr * 0.4;
    
    // GRM
    if (results.grossRevenuMultiplier <= 8) totalScore += weights.grm;
    else if (results.grossRevenuMultiplier <= 10) totalScore += weights.grm * 0.7;
    else if (results.grossRevenuMultiplier <= 12) totalScore += weights.grm * 0.4;
    
    // Expense Ratio
    if (results.expenseRatio <= 40) totalScore += weights.expenseRatio;
    else if (results.expenseRatio <= 50) totalScore += weights.expenseRatio * 0.7;
    else totalScore += weights.expenseRatio * 0.4;
    
    return Math.round(totalScore);
  };
  
  const overallScore = calculateOverallScore();
  
  // Fonction pour déterminer la couleur du score global
  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };
  
  // Fonction pour déterminer le message d'évaluation global
  const getScoreEvaluation = (score) => {
    if (score >= 80) return "Excellent investissement potentiel !";
    if (score >= 60) return "Bon investissement avec quelques points d'amélioration.";
    return "Investissement à risque qui nécessite des optimisations.";
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.subtle' }}>
          <Typography variant="h6" gutterBottom>
            Analyse de l'immeuble: {propertyData.address || 'Non spécifié'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {propertyData.units || 0} logements | Prix: {(propertyData.price || 0).toLocaleString()} $ | Prix par porte: {propertyData.units > 0 ? (propertyData.price / propertyData.units).toLocaleString() : 0} $
          </Typography>
          
          <Box sx={{ my: 2, p: 2, bgcolor: getScoreColor(overallScore), color: 'white', borderRadius: 1 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Score d'investissement: {overallScore}/100
            </Typography>
            <Typography variant="body1" align="center">
              {getScoreEvaluation(overallScore)}
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
          <Typography variant="subtitle1" gutterBottom>
            Revenus et dépenses
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Revenus bruts</TableCell>
                  <TableCell align="right">{results.totalRevenue.toLocaleString()} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dépenses d'exploitation</TableCell>
                  <TableCell align="right">{results.totalExpenses.toLocaleString()} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Revenu net d'opération (RNO)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{results.netOperatingIncome.toLocaleString()} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ratio de dépenses</TableCell>
                  <TableCell align="right" sx={{ color: indicatorEvaluations.expenseRatio.color }}>{results.expenseRatio.toFixed(1)} %</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Financement et cashflow
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Paiement annuel du financement</TableCell>
                  <TableCell align="right">{results.annualPayment.toLocaleString()} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ratio de couverture de la dette (DCR)</TableCell>
                  <TableCell align="right" sx={{ color: indicatorEvaluations.dcr.color }}>{results.debtCoverageRatio.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cashflow annuel</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{results.annualCashflow.toLocaleString()} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cashflow mensuel par porte</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: indicatorEvaluations.cashflow.color }}>
                    {results.monthlyCashflowPerUnit.toFixed(2)} $
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
          <Typography variant="subtitle1" gutterBottom>
            Indicateurs de performance
          </Typography>
          
          {/* Indicateurs sous forme de barres de progression */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Cashflow mensuel par porte</Typography>
              <Typography variant="body2" sx={{ color: indicatorEvaluations.cashflow.color }}>
                {results.monthlyCashflowPerUnit.toFixed(2)} $
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, (results.monthlyCashflowPerUnit / 100) * 100)}
              color={results.monthlyCashflowPerUnit >= 75 ? "success" : results.monthlyCashflowPerUnit >= 40 ? "warning" : "error"}
              sx={{ height: 10, borderRadius: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Objectif: 75$ et plus
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Rendement sur investissement</Typography>
              <Typography variant="body2" sx={{ color: indicatorEvaluations.cashOnCash.color }}>
                {results.cashOnCashReturn.toFixed(2)} %
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, (results.cashOnCashReturn / 15) * 100)}
              color={results.cashOnCashReturn >= 10 ? "success" : results.cashOnCashReturn >= 5 ? "warning" : "error"}
              sx={{ height: 10, borderRadius: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Objectif: 10% et plus
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Taux de capitalisation</Typography>
              <Typography variant="body2" sx={{ color: indicatorEvaluations.capRate.color }}>
                {results.capRate.toFixed(2)} %
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, (results.capRate / 8) * 100)}
              color={results.capRate >= 6 ? "success" : results.capRate >= 4 ? "warning" : "error"}
              sx={{ height: 10, borderRadius: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Objectif: 6% et plus
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Valeur et équité potentielle
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Multiplicateur de revenu brut (MRB)</TableCell>
                  <TableCell align="right" sx={{ color: indicatorEvaluations.grm.color }}>{results.grossRevenuMultiplier.toFixed(2)}x</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Prix d'achat</TableCell>
                  <TableCell align="right">{propertyData.price.toLocaleString()} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Valeur basée sur le taux de capitalisation du marché (5.5%)</TableCell>
                  <TableCell align="right">{results.marketValueBasedOnCapRate.toLocaleString()} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Équité potentielle</TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: results.potentialEquity > 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    {results.potentialEquity.toLocaleString()} $
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Optimisations recommandées
          </Typography>
          <Grid container spacing={2}>
            {results.monthlyCashflowPerUnit < 75 && (
              <Grid item xs={12} sm={6}>
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Augmenter le cashflow</Typography>
                  <Typography variant="body2">
                    Le cashflow actuel de {results.monthlyCashflowPerUnit.toFixed(2)} $ par porte est inférieur à l'objectif recommandé de 75 $.
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">Suggestions:</Typography>
                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                      <li>Augmenter les loyers aux prix du marché</li>
                      <li>Ajouter des revenus additionnels (stationnement, buanderie)</li>
                      <li>Réduire les dépenses d'exploitation</li>
                    </ul>
                  </Box>
                </Alert>
              </Grid>
            )}
            
            {results.expenseRatio > 45 && (
              <Grid item xs={12} sm={6}>
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Réduire le ratio de dépenses</Typography>
                  <Typography variant="body2">
                    Le ratio de dépenses actuel de {results.expenseRatio.toFixed(1)}% est élevé pour un immeuble de {propertyData.units} logements.
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">Suggestions:</Typography>
                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                      <li>Négocier les contrats d'entretien</li>
                      <li>Installer des équipements économes en énergie</li>
                      <li>Revoir les assurances et taxes</li>
                    </ul>
                  </Box>
                </Alert>
              </Grid>
            )}
            
            {results.cashOnCashReturn < 8 && (
              <Grid item xs={12} sm={6}>
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Améliorer le rendement sur investissement</Typography>
                  <Typography variant="body2">
                    Le rendement sur investissement actuel de {results.cashOnCashReturn.toFixed(2)}% est inférieur à un bon objectif de 8-10%.
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">Suggestions:</Typography>
                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                      <li>Utiliser le financement créatif pour réduire la mise de fonds</li>
                      <li>Négocier un meilleur prix d'achat</li>
                      <li>Augmenter les revenus (loyers, sources additionnelles)</li>
                    </ul>
                  </Box>
                </Alert>
              </Grid>
            )}
            
            {results.debtCoverageRatio < 1.2 && (
              <Grid item xs={12} sm={6}>
                <Alert severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Améliorer le ratio de couverture de la dette</Typography>
                  <Typography variant="body2">
                    Le DCR actuel de {results.debtCoverageRatio.toFixed(2)} est faible, les prêteurs préfèrent un ratio de 1.2 et plus.
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">Suggestions:</Typography>
                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                      <li>Négocier un meilleur taux d'intérêt</li>
                      <li>Augmenter la période d'amortissement</li>
                      <li>Augmenter le revenu net d'exploitation</li>
                    </ul>
                  </Box>
                </Alert>
              </Grid>
            )}
            
            {Object.values(indicatorEvaluations).every(eval => eval.status === 'good') && (
              <Grid item xs={12}>
                <Alert severity="success">
                  <Typography variant="subtitle2">Excellent investissement!</Typography>
                  <Typography variant="body2">
                    Tous les indicateurs sont bons. Cet immeuble présente un potentiel d'investissement solide. Envisagez de procéder rapidement avec une offre d'achat.
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ResultsAnalysis;
