import React, { useState, useEffect } from 'react';

const CalculateurMulti = () => {
  // État initial pour le formulaire
  const [formData, setFormData] = useState({
    prixAchat: '',
    nombreAppartements: '',
    revenusBruts: '',
    depensesPersonnalisees: false,
    tauxDepenses: '',
    depensesAnnuelles: '',
    financementPersonnalise: false,
    tauxInteret: 5.0,
    amortissement: 25,
    miseEnFonds: 20
  });

  // États pour les résultats
  const [resultats, setResultats] = useState({
    depensesAnnuelles: 0,
    revenusNetsOperation: 0,
    financementAnnuel: 0,
    liquidite: 0,
    liquiditeParPorte: 0,
    tauxRendementLiquidite: 0,
    prixAchatMaximal: 0
  });

  // État pour contrôler l'affichage des résultats
  const [afficherResultats, setAfficherResultats] = useState(false);
  
  // État pour le mode (rapide/détaillé)
  const [modeCalcul, setModeCalcul] = useState('rapide');
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Conversion en nombre pour les champs numériques
    const processedValue = type === 'checkbox' ? checked : 
                           (type === 'number' || name === 'prixAchat' || name === 'revenusBruts') ? 
                           (value === '' ? '' : parseFloat(value)) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  // Déterminer automatiquement le taux de dépenses en fonction du nombre d'appartements
  useEffect(() => {
    if (!formData.depensesPersonnalisees && formData.nombreAppartements) {
      let tauxCalcule;
      
      if (formData.nombreAppartements <= 2) {
        tauxCalcule = 30;
      } else if (formData.nombreAppartements <= 4) {
        tauxCalcule = 35;
      } else if (formData.nombreAppartements <= 6) {
        tauxCalcule = 45;
      } else {
        tauxCalcule = 50;
      }
      
      setFormData(prev => ({
        ...prev,
        tauxDepenses: tauxCalcule
      }));
    }
  }, [formData.nombreAppartements, formData.depensesPersonnalisees]);

  // Mettre à jour les dépenses annuelles quand les revenus bruts ou le taux de dépenses change
  useEffect(() => {
    if (formData.revenusBruts && formData.tauxDepenses && !formData.depensesPersonnalisees) {
      const depensesCalculees = formData.revenusBruts * (formData.tauxDepenses / 100);
      setFormData(prev => ({
        ...prev,
        depensesAnnuelles: depensesCalculees
      }));
    }
  }, [formData.revenusBruts, formData.tauxDepenses, formData.depensesPersonnalisees]);

  // Méthode HIGH-5 pour calculer le paiement hypothécaire mensuel
  const calculerPaiementHypothecaireMensuel = (prixAchat) => {
    if (formData.financementPersonnalise) {
      // Calcul détaillé du prêt hypothécaire si le financement personnalisé est activé
      const montantMiseEnFonds = prixAchat * (formData.miseEnFonds / 100);
      const montantHypotheque = prixAchat - montantMiseEnFonds;
      const tauxMensuel = formData.tauxInteret / 100 / 12;
      const nombrePaiements = formData.amortissement * 12;
      
      const paiementMensuel = montantHypotheque * 
        (tauxMensuel * Math.pow(1 + tauxMensuel, nombrePaiements)) / 
        (Math.pow(1 + tauxMensuel, nombrePaiements) - 1);
      
      return paiementMensuel;
    } else {
      // Méthode HIGH-5 simplifiée (0.5% du prix d'achat par mois)
      return prixAchat * 0.005;
    }
  };

  // Calculer les résultats
  const calculerResultats = () => {
    if (!formData.prixAchat || !formData.nombreAppartements || !formData.revenusBruts) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Calcul des dépenses d'opération
    let depensesAnnuelles = formData.depensesPersonnalisees ? 
                           formData.depensesAnnuelles : 
                           formData.revenusBruts * (formData.tauxDepenses / 100);

    // Calcul du Revenu Net d'Opération (RNO)
    const revenusNetsOperation = formData.revenusBruts - depensesAnnuelles;

    // Calcul du financement annuel selon la méthode HIGH-5
    const paiementMensuel = calculerPaiementHypothecaireMensuel(formData.prixAchat);
    const financementAnnuel = paiementMensuel * 12;

    // Calcul de la liquidité
    const liquidite = revenusNetsOperation - financementAnnuel;

    // Calcul de la liquidité par porte par mois
    const liquiditeParPorte = liquidite / formData.nombreAppartements / 12;

    // Calcul du taux de rendement sur la liquidité
    const montantMiseEnFonds = formData.prixAchat * (formData.miseEnFonds / 100);
    const tauxRendementLiquidite = (liquidite / montantMiseEnFonds) * 100;

    // Calcul du prix d'achat maximal pour 75$ par porte par mois
    const liquiditeCible = 75 * formData.nombreAppartements * 12; // 75$ par porte par mois
    const financementMaximal = revenusNetsOperation - liquiditeCible;
    // Utilisant la méthode HIGH-5 à l'inverse
    const prixAchatMaximal = financementMaximal > 0 ? (financementMaximal / 12) / 0.005 : 0;

    // Mise à jour des résultats
    setResultats({
      depensesAnnuelles,
      revenusNetsOperation,
      financementAnnuel,
      liquidite,
      liquiditeParPorte,
      tauxRendementLiquidite,
      prixAchatMaximal
    });

    setAfficherResultats(true);
  };

  // Fonction pour formater les montants en dollars
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };
  
  // Fonction pour formater les pourcentages
  const formatPercentage = (percentage) => {
    return new Intl.NumberFormat('fr-CA', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2