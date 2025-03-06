import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Divider, Typography, Button, 
  TextField, InputAdornment, Box, Alert, Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Calculateur de liquidité pour analyse immobilière
 * Premier outil à utiliser selon la méthodologie des Secrets de l'Immobilier
 */
const CalculateurLiquidite = () => {
  // État initial des valeurs du formulaire
  const [formValues, setFormValues] = useState({
    // Informations générales
    adresse: '',
    prixDemande: 0,
    anneeConstruction: 0,
    superficieTerrain: 0,

    // Revenus
    loyers: [{ numero: 1, montant: 0, pieces: '3 1/2' }],
    revenuStationnement: 0,
    revenuBuanderie: 0,
    revenuAutres: 0,
    tauxInoccupation: 3, // 3% par défaut

    // Dépenses
    taxesMunicipales: 0,
    taxesScolaires: 0,
    assurances: 0,
    electricite: 0,
    chauffage: 0,
    entretienReparations: 0,
    conciergerie: 0,
    deneigementPaysagement: 0,
    fraisGestion: 0,
    reserveRenovations: 0,

    // Financement
    miseDefondsPorc: 20, // 20% par défaut
    tauxInteret: 5.5, // 5.5% par défaut
    termePret: 5, // 5 ans par défaut
    amortissement: 25, // 25 ans par défaut
    
    // Financement créatif
    balanceVendeurMontant: 0,
    balanceVendeurTaux: 7, // 7% par défaut
    balanceVendeurTerme: 5, // 5 ans par défaut
    balanceVendeurAmort: 5, // 5 ans par défaut
    
    investisseurPriveMontant: 0,
    investisseurPriveTaux: 10, // 10% par défaut
    investisseurPriveTerme: 3, // 3 ans par défaut
    investisseurPriveAmort: 3, // 3 ans par défaut
  });

  // État pour les résultats des calculs
  const [results, setResults] = useState({
    revenusPotentielsBruts: 0,
    revenusTotaux: 0,
    depensesTotales: 0,
    revenuNetExploitation: 0,
    paiementHypothecaire: 0,
    cashflowAnnuel: 0,
    cashflowMensuel: 0,
    cashflowParPorte: 0,
    tauxCapitalisation: 0,
    rendementMiseDeFonds: 0,
    rentable: false,
    ratioEndettement: 0,
    prixOffre: 0,
  });

  // État pour gérer l'affichage des résultats
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  // Mise à jour d'un champ du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Si c'est un champ numérique, convertir en nombre
    if (
      name !== 'adresse' && 
      !name.includes('pieces')
    ) {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setFormValues({
      ...formValues,
      [name]: parsedValue
    });
  };

  // Gestion des loyers (ajout/suppression/modification)
  const handleLoyerChange = (index, field, value) => {
    const updatedLoyers = [...formValues.loyers];
    updatedLoyers[index] = {
      ...updatedLoyers[index],
      [field]: field === 'montant' ? (value === '' ? 0 : parseFloat(value)) : value
    };
    
    setFormValues({
      ...formValues,
      loyers: updatedLoyers
    });
  };

  const addLoyer = () => {
    setFormValues({
      ...formValues,
      loyers: [
        ...formValues.loyers,
        { 
          numero: formValues.loyers.length + 1, 
          montant: 0, 
          pieces: '3 1/2' 
        }
      ]
    });
  };

  const removeLoyer = (index) => {
    const updatedLoyers = [...formValues.loyers];
    updatedLoyers.splice(index, 1);
    // Réindexer les numéros
    const reindexedLoyers = updatedLoyers.map((loyer, i) => ({
      ...loyer,
      numero: i + 1
    }));
    
    setFormValues({
      ...formValues,
      loyers: reindexedLoyers
    });
  };

  // Calcul du paiement hypothécaire mensuel
  const calculateMortgagePayment = (principal, rate, amortization) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = amortization * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    return principal * monthlyRate * x / (x - 1);
  };

  // Calcul de tous les résultats
  const calculateResults = () => {
    try {
      // 1. Calcul des revenus
      const loyersMensuels = formValues.loyers.reduce((sum, loyer) => sum + loyer.montant, 0);
      const revenusBrutsMensuels = loyersMensuels + 
        formValues.revenuStationnement + 
        formValues.revenuBuanderie + 
        formValues.revenuAutres;
        
      const revenusPotentielsBruts = revenusBrutsMensuels * 12;
      const perteInoccupation = revenusPotentielsBruts * (formValues.tauxInoccupation / 100);
      const revenusTotaux = revenusPotentielsBruts - perteInoccupation;
      
      // 2. Calcul des dépenses
      const depensesTotales = 
        formValues.taxesMunicipales +
        formValues.taxesScolaires +
        formValues.assurances +
        formValues.electricite +
        formValues.chauffage +
        formValues.entretienReparations +
        formValues.conciergerie +
        formValues.deneigementPaysagement +
        formValues.fraisGestion +
        formValues.reserveRenovations;
      
      // 3. Revenu net d'exploitation
      const revenuNetExploitation = revenusTotaux - depensesTotales;
      
      // 4. Calcul du financement
      const prixAchat = formValues.prixDemande;
      const miseDeFonds = prixAchat * (formValues.miseDefondsPorc / 100);
      
      // Montant hypothécaire principal
      const montantHypothecairePrincipal = prixAchat - miseDeFonds - 
        formValues.balanceVendeurMontant - 
        formValues.investisseurPriveMontant;
      
      // Calcul des paiements mensuels pour chaque financement
      const paiementHypothecaire = calculateMortgagePayment(
        montantHypothecairePrincipal,
        formValues.tauxInteret,
        formValues.amortissement
      );
      
      const paiementBalanceVendeur = formValues.balanceVendeurMontant > 0 
        ? calculateMortgagePayment(
            formValues.balanceVendeurMontant,
            formValues.balanceVendeurTaux,
            formValues.balanceVendeurAmort
          )
        : 0;
      
      const paiementInvestisseurPrive = formValues.investisseurPriveMontant > 0
        ? calculateMortgagePayment(
            formValues.investisseurPriveMontant,
            formValues.investisseurPriveTaux,
            formValues.investisseurPriveAmort
          )
        : 0;
      
      const paiementMensuelTotal = paiementHypothecaire + paiementBalanceVendeur + paiementInvestisseurPrive;
      const paiementAnnuelTotal = paiementMensuelTotal * 12;
      
      // 5. Cashflow
      const cashflowAnnuel = revenuNetExploitation - paiementAnnuelTotal;
      const cashflowMensuel = cashflowAnnuel / 12;
      const cashflowParPorte = formValues.loyers.length > 0 
        ? cashflowMensuel / formValues.loyers.length 
        : 0;
      
      // 6. Ratios et rendements
      const tauxCapitalisation = prixAchat > 0 
        ? (revenuNetExploitation / prixAchat) * 100 
        : 0;
      
      const rendementMiseDeFonds = miseDeFonds > 0 
        ? (cashflowAnnuel / miseDeFonds) * 100 
        : 0;
      
      const ratioEndettement = revenuNetExploitation > 0 
        ? paiementAnnuelTotal / revenuNetExploitation 
        : 0;
      
      // 7. Déterminer si l'investissement est rentable (cashflow positif par porte >= 75$)
      const rentable = cashflowParPorte >= 75;
      
      // 8. Calcul du prix d'offre optimal pour atteindre un cashflow de 75$ par porte
      // Déduire le prix maximum qu'on pourrait payer
      let prixOffre = 0;
      
      if (revenuNetExploitation > 0) {
        // On calcule combien de cashflow par porte on veut (75$)
        const cashflowCible = 75 * formValues.loyers.length * 12; // annuel
        
        // Combien on pourrait payer pour atteindre ce cashflow
        const capaciteTotaleRemboursement = revenuNetExploitation - cashflowCible;
        
        // En supposant les mêmes pourcentages de financement, on peut calculer le prix maximal
        const tauxMoyenPondere = 
          ((montantHypothecairePrincipal / prixAchat) * formValues.tauxInteret +
          (formValues.balanceVendeurMontant / prixAchat) * formValues.balanceVendeurTaux +
          (formValues.investisseurPriveMontant / prixAchat) * formValues.investisseurPriveTaux) || formValues.tauxInteret;
        
        // Estimation du prix d'achat maximum
        const tauxMensuel = tauxMoyenPondere / 100 / 12;
        const nombrePaiements = formValues.amortissement * 12;
        
        if (tauxMensuel > 0 && capaciteTotaleRemboursement > 0) {
          // Formule inverse du calcul de paiement hypothécaire
          const x = Math.pow(1 + tauxMensuel, nombrePaiements);
          prixOffre = capaciteTotaleRemboursement * 12 * (x - 1) / (tauxMensuel * x);
        }
      }
      
      // Mise à jour des résultats
      setResults({
        revenusPotentielsBruts,
        revenusTotaux,
        depensesTotales,
        revenuNetExploitation,
        paiementHypothecaire: paiementMensuelTotal,
        cashflowAnnuel,
        cashflowMensuel,
        cashflowParPorte,
        tauxCapitalisation,
        rendementMiseDeFonds,
        rentable,
        ratioEndettement,
        prixOffre: prixOffre > 0 ? prixOffre : 0,
      });
      
      setShowResults(true);
      setError('');
    } catch (err) {
      console.error('Erreur dans les calculs:', err);
      setError('Une erreur est survenue lors des calculs. Vérifiez vos données.');
    }
  };

  // Préparation des données pour le graphique
  const prepareChartData = () => {
    if (!showResults) return [];
    
    return [
      {
        name: 'Revenus et dépenses mensuels',
        'Revenus': results.revenusTotaux / 12,
        'Dépenses': (results.depensesTotales + results.paiementHypothecaire * 12) / 12,
        'Cashflow': results.cashflowMensuel
      }
    ];
  };

  // Modèle de données pour l'importation depuis une fiche Centris (placeholder)
  const importFromCentris = () => {
    alert('La fonctionnalité d\'importation depuis Centris sera disponible prochainement.');
  };

  // Rendu du composant
  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" component="h1" gutterBottom align="center" className="mb-6">
        Calculateur de liquidité - Analyse détaillée
      </Typography>
      
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Box className="mb-6">
        <Button
          variant="contained"
          color="primary"
          onClick={importFromCentris}
          className="mr-4"
        >
          Importer depuis Centris
        </Button>
      </Box>
      
      <Grid container spacing={4}>
        {/* Formulaire */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} className="mb-6">
            <CardHeader 
              title="Informations générales" 
              className="bg-blue-50"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresse de la propriété"
                    name="adresse"
                    value={formValues.adresse}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prix demandé"
                    name="prixDemande"
                    type="number"
                    value={formValues.prixDemande}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Année de construction"
                    name="anneeConstruction"
                    type="number"
                    value={formValues.anneeConstruction}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Superficie du terrain (pi²)"
                    name="superficieTerrain"
                    type="number"
                    value={formValues.superficieTerrain}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card elevation={3} className="mb-6">
            <CardHeader 
              title="Revenus" 
              className="bg-green-50"
            />
            <CardContent>
              <Typography variant="subtitle2" className="mb-2">
                Loyers mensuels
              </Typography>
              
              {formValues.loyers.map((loyer, index) => (
                <Grid container spacing={2} key={index} className="mb-2">
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="No."
                      value={loyer.numero}
                      disabled
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Pièces"
                      name={`loyers[${index}].pieces`}
                      value={loyer.pieces}
                      onChange={(e) => handleLoyerChange(index, 'pieces', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Montant"
                      name={`loyers[${index}].montant`}
                      type="number"
                      value={loyer.montant}
                      onChange={(e) => handleLoyerChange(index, 'montant', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button 
                      variant="outlined" 
                      color="error"
                      size="small"
                      onClick={() => removeLoyer(index)}
                      disabled={formValues.loyers.length <= 1}
                    >
                      X
                    </Button>
                  </Grid>
                </Grid>
              ))}
              
              <Button 
                variant="outlined" 
                color="primary"
                onClick={addLoyer}
                className="mt-2"
              >
                + Ajouter un loyer
              </Button>
              
              <Grid container spacing={2} className="mt-4">
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Revenus stationnement (mensuel)"
                    name="revenuStationnement"
                    type="number"
                    value={formValues.revenuStationnement}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Revenus buanderie (mensuel)"
                    name="revenuBuanderie"
                    type="number"
                    value={formValues.revenuBuanderie}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Autres revenus (mensuel)"
                    name="revenuAutres"
                    type="number"
                    value={formValues.revenuAutres}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taux d'inoccupation (%)"
                    name="tauxInoccupation"
                    type="number"
                    value={formValues.tauxInoccupation}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3} className="mb-6">
            <CardHeader 
              title="Dépenses (annuelles)" 
              className="bg-red-50"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taxes municipales"
                    name="taxesMunicipales"
                    type="number"
                    value={formValues.taxesMunicipales}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taxes scolaires"
                    name="taxesScolaires"
                    type="number"
                    value={formValues.taxesScolaires}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Assurances"
                    name="assurances"
                    type="number"
                    value={formValues.assurances}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Électricité (si propriétaire)"
                    name="electricite"
                    type="number"
                    value={formValues.electricite}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Chauffage (si propriétaire)"
                    name="chauffage"
                    type="number"
                    value={formValues.chauffage}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Entretien et réparations"
                    name="entretienReparations"
                    type="number"
                    value={formValues.entretienReparations}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Conciergerie"
                    name="conciergerie"
                    type="number"
                    value={formValues.conciergerie}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Déneigement et paysagement"
                    name="deneigementPaysagement"
                    type="number"
                    value={formValues.deneigementPaysagement}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Frais de gestion"
                    name="fraisGestion"
                    type="number"
                    value={formValues.fraisGestion}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Réserve pour rénovations"
                    name="reserveRenovations"
                    type="number"
                    value={formValues.reserveRenovations}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card elevation={3} className="mb-6">
            <CardHeader 
              title="Financement" 
              className="bg-purple-50"
            />
            <CardContent>
              <Typography variant="subtitle2" className="mb-2">
                Financement principal
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mise de fonds (%)"
                    name="miseDefondsPorc"
                    type="number"
                    value={formValues.miseDefondsPorc}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taux d'intérêt (%)"
                    name="tauxInteret"
                    type="number"
                    value={formValues.tauxInteret}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Terme (années)"
                    name="termePret"
                    type="number"
                    value={formValues.termePret}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amortissement (années)"
                    name="amortissement"
                    type="number"
                    value={formValues.amortissement}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" className="mt-4 mb-2">
                Financement créatif (optionnel)
              </Typography>
              <Typography variant="caption" className="block mb-3">
                Balance vendeur et investisseur privé peuvent compléter votre financement
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Balance vendeur ($)"
                    name="balanceVendeurMontant"
                    type="number"
                    value={formValues.balanceVendeurMontant}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taux balance vendeur (%)"
                    name="balanceVendeurTaux"
                    type="number"
                    value={formValues.balanceVendeurTaux}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Terme b. vendeur (années)"
                    name="balanceVendeurTerme"
                    type="number"
                    value={formValues.balanceVendeurTerme}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amort. b. vendeur (années)"
                    name="balanceVendeurAmort"
                    type="number"
                    value={formValues.balanceVendeurAmort}
                    onChange={handleInputChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Investisseur privé ($)"
                    name="investisseurPriveMontant"
                    type="number"
                    value={formValues.investisseurPriveMontant}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taux investisseur privé (%)"
                    name="investisseurPriveTaux"
                    type="number"
                    value={formValues.investisseurPriveTaux}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Terme inv. privé (années)"
                    name="investisseurPriveTerme"
                    type="number"
                    value={formValues.investisseurPriveTerme}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amort. inv. privé (années)"
                    name="investisseurPriveAmort"
                    type="number"
                    value={formValues.investisseurPriveAmort}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Box className="flex justify-center mb-6">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={calculateResults}
            >
              Calculer la rentabilité
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Résultats */}
      {showResults && (
        <Paper elevation={3} className="p-6 mt-8">
          <Typography variant="h5" component="h2" gutterBottom className="text-center mb-6">
            Résultats de l'analyse
          </Typography>
          
          <Box className="mb-6">
            <Alert severity={results.rentable ? "success" : "warning"} className="mb-4">
              <Typography variant="h6">
                Cet investissement est {results.rentable ? 'rentable' : 'non rentable'} selon les critères des Secrets de l'Immobilier.
              </Typography>
              <Typography>
                Le cashflow par porte est de {results.cashflowParPorte.toFixed(2)}$ par mois (objectif: 75$).
              </Typography>
              {!results.rentable && results.prixOffre > 0 && (
                <Typography className="mt-2">
                  Prix d'offre recommandé pour atteindre l'objectif: {results.prixOffre.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$
                </Typography>
              )}
            </Alert>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card className="mb-4">
                <CardHeader title="Revenus et dépenses" className="bg-blue-50" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Revenus potentiels bruts (annuels)</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">{results.revenusPotentielsBruts.toFixed(2)}$</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Revenus effectifs (après inoccupation)</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">{results.revenusTotaux.toFixed(2)}$</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Dépenses totales</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">{results.depensesTotales.toFixed(2)}$</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Revenu net d'exploitation (RNE)</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">{results.revenuNetExploitation.toFixed(2)}$</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card className="mb-4">
                <CardHeader title="Financement" className="bg-purple-50" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Paiement hypothécaire mensuel</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">{results.paiementHypothecaire.toFixed(2)}$</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Paiement hypothécaire annuel</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">{(results.paiementHypothecaire * 12).toFixed(2)}$</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Ratio d'endettement</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography 
                        variant="body1" 
                        align="right"
                        className={results.ratioEndettement < 0.8 ? "text-green-600" : "text-red-600"}
                      >
                        {(results.ratioEndettement * 100).toFixed(2)}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card className="mb-4">
                <CardHeader title="Cashflow et rendement" className="bg-green-50" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Cashflow annuel</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography 
                        variant="body1" 
                        align="right"
                        className={results.cashflowAnnuel > 0 ? "text-green-600" : "text-red-600"}
                      >
                        {results.cashflowAnnuel.toFixed(2)}$
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Cashflow mensuel</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography 
                        variant="body1" 
                        align="right"
                        className={results.cashflowMensuel > 0 ? "text-green-600" : "text-red-600"}
                      >
                        {results.cashflowMensuel.toFixed(2)}$
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Cashflow par porte (mensuel)</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography 
                        variant="body1" 
                        align="right"
                        className={results.cashflowParPorte >= 75 ? "text-green-600" : "text-red-600"}
                      >
                        {results.cashflowParPorte.toFixed(2)}$
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Taux de capitalisation</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography 
                        variant="body1" 
                        align="right"
                        className={results.tauxCapitalisation >= 5 ? "text-green-600" : "text-yellow-600"}
                      >
                        {results.tauxCapitalisation.toFixed(2)}%
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Rendement sur mise de fonds</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography 
                        variant="body1" 
                        align="right"
                        className={results.rendementMiseDeFonds > 0 ? "text-green-600" : "text-red-600"}
                      >
                        {results.rendementMiseDeFonds.toFixed(2)}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Revenus" fill="#4CAF50" />
                    <Bar dataKey="Dépenses" fill="#F44336" />
                    <Bar dataKey="Cashflow" fill="#2196F3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Information sur le calculateur */}
      <Box className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <Typography variant="h6" className="text-blue-800 mb-2">
          À propos du calculateur de liquidité
        </Typography>
        <Typography className="text-blue-700 mb-3">
          Ce calculateur est l'outil principal d'analyse selon la méthodologie des Secrets de l'Immobilier.
          Il vous permet d'évaluer en détail la rentabilité d'un investissement immobilier.
        </Typography>
        <Typography className="text-blue-700">
          <strong>Critère de rentabilité:</strong> Un cashflow minimum de 75$ par porte par mois.
          Ce critère assure une marge de sécurité contre les imprévus et garantit un rendement satisfaisant.
        </Typography>
      </Box>
    </div>
  );
};

export default CalculateurLiquidite;