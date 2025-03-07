/**
 * Calculateurs avancés pour l'évaluation des propriétés immobilières
 * Basés sur la méthodologie "Secrets de l'immobilier"
 */

// =================== CALCULATEURS NAPKIN ===================

/**
 * Calculateur Napkin FLIP (FIP10)
 * @param {number} prixFinal - Valeur de revente estimée après travaux (F)
 * @param {number} prixInitial - Prix d'achat (I)
 * @param {number} prixRenos - Coût des rénovations (P)
 * @param {number} pourcentageFrais - Pourcentage pour frais (par défaut: 10%)
 * @returns {object} - Résultats du calcul incluant le profit estimé
 */
export const calculNapkinFlip = (prixFinal, prixInitial, prixRenos, pourcentageFrais = 10) => {
  const frais = (prixFinal * pourcentageFrais) / 100;
  const profit = prixFinal - prixInitial - prixRenos - frais;
  
  return {
    prixFinal,
    prixInitial,
    prixRenos,
    frais,
    profit,
    rentable: profit >= 25000, // Seuil de rentabilité recommandé
  };
};

/**
 * Calculateur Napkin MULTI (PAR + HIGH-5)
 * @param {number} prixAchat - Prix d'achat de la propriété (P)
 * @param {number} nombreAppartements - Nombre de logements (A)
 * @param {number} revenusBruts - Revenus bruts annuels (R)
 * @returns {object} - Résultats du calcul incluant le cashflow par porte
 */
export const calculNapkinMulti = (prixAchat, nombreAppartements, revenusBruts) => {
  // Détermination du pourcentage de dépenses selon le nombre de logements
  let pourcentageDépenses;
  if (nombreAppartements <= 2) pourcentageDépenses = 30;
  else if (nombreAppartements <= 4) pourcentageDépenses = 35;
  else if (nombreAppartements <= 6) pourcentageDépenses = 45;
  else pourcentageDépenses = 50;
  
  // Calcul des dépenses d'opération
  const depensesOperation = (revenusBruts * pourcentageDépenses) / 100;
  
  // Revenus nets d'opération (RNO)
  const rno = revenusBruts - depensesOperation;
  
  // Calcul du financement annuel avec la méthode HIGH-5
  const paiementMensuel = prixAchat * 0.005;
  const paiementAnnuel = paiementMensuel * 12;
  
  // Liquidité (cashflow)
  const liquiditeAnnuelle = rno - paiementAnnuel;
  const liquiditeMensuelle = liquiditeAnnuelle / 12;
  const cashflowParPorteMois = liquiditeMensuelle / nombreAppartements;
  
  return {
    prixAchat,
    nombreAppartements,
    revenusBruts,
    pourcentageDépenses,
    depensesOperation,
    rno,
    paiementMensuel,
    paiementAnnuel,
    liquiditeAnnuelle,
    liquiditeMensuelle,
    cashflowParPorteMois,
    rentable: cashflowParPorteMois >= 75, // Seuil de rentabilité recommandé
  };
};

// =================== CALCULATEURS DE PRIX D'OFFRE ===================

/**
 * Calcule le prix d'offre maximum pour un FLIP avec profit cible
 * @param {number} valeurRevente - Valeur de revente estimée
 * @param {number} coutRenovations - Coût des rénovations
 * @param {number} profitCible - Profit minimal souhaité (par défaut: 25000)
 * @param {number} pourcentageFrais - Pourcentage pour frais (par défaut: 10%)
 * @returns {number} - Prix d'offre maximum recommandé
 */
export const calculPrixOffreFlip = (valeurRevente, coutRenovations, profitCible = 25000, pourcentageFrais = 10) => {
  const frais = (valeurRevente * pourcentageFrais) / 100;
  const prixOffreMax = valeurRevente - coutRenovations - frais - profitCible;
  return Math.max(0, prixOffreMax);
};

/**
 * Calcule le prix d'offre maximum pour un MULTI avec cashflow cible
 * @param {number} revenusBruts - Revenus bruts annuels
 * @param {number} nombreLogements - Nombre de logements
 * @param {number} cashflowCibleParPorteMois - Cashflow cible par porte/mois (par défaut: 75)
 * @returns {number} - Prix d'offre maximum recommandé
 */
export const calculPrixOffreMulti = (revenusBruts, nombreLogements, cashflowCibleParPorteMois = 75) => {
  // Détermination du pourcentage de dépenses selon le nombre de logements
  let pourcentageDépenses;
  if (nombreLogements <= 2) pourcentageDépenses = 30;
  else if (nombreLogements <= 4) pourcentageDépenses = 35;
  else if (nombreLogements <= 6) pourcentageDépenses = 45;
  else pourcentageDépenses = 50;
  
  // Calcul des dépenses d'opération
  const depensesOperation = (revenusBruts * pourcentageDépenses) / 100;
  
  // Revenus nets d'opération (RNO)
  const rno = revenusBruts - depensesOperation;
  
  // Liquidité cible
  const liquiditeCibleAnnuelle = cashflowCibleParPorteMois * nombreLogements * 12;
  
  // Paiement maximum acceptable
  const paiementAnnuelMax = rno - liquiditeCibleAnnuelle;
  const paiementMensuelMax = paiementAnnuelMax / 12;
  
  // Prix d'achat maximum (basé sur la méthode HIGH-5 inversée)
  const prixAchatMax = paiementMensuelMax / 0.005;
  
  return Math.max(0, prixAchatMax);
};

// =================== CALCULATEUR DE LIQUIDITÉ COMPLET ===================

/**
 * Calculateur de liquidité détaillé pour MULTI avec financement créatif
 * 
 * @param {Object} params Paramètres du calcul
 * @param {number} params.prixAchat - Prix d'achat de l'immeuble
 * @param {number} params.revenusBruts - Revenus bruts annuels
 * @param {number} params.nombreLogements - Nombre de logements
 * @param {Array} params.depenses - Liste des dépenses d'opération
 * @param {Object} params.financement - Structure de financement
 * @returns {Object} Résultats détaillés du calcul de liquidité
 */
export const calculLiquiditeMulti = ({
  prixAchat,
  revenusBruts,
  nombreLogements,
  depenses = null,
  financement = {
    bancaire: { pourcentage: 75, taux: 5, terme: 25 },
    vendeur: { pourcentage: 15, taux: 8, terme: 5 },
    prive: { pourcentage: 0, taux: 10, terme: 3 },
    miseDeFonds: 10
  }
}) => {
  // REVENUS - Calcul détaillé des revenus
  const revenusMensuels = revenusBruts / 12;
  
  // DÉPENSES - Estimation ou utilisation des dépenses fournies
  let depensesTotal = 0;
  let depensesDetaillees = {};
  
  if (depenses) {
    // Utilisation des dépenses détaillées fournies
    depensesTotal = Object.values(depenses).reduce((sum, val) => sum + val, 0);
    depensesDetaillees = { ...depenses };
  } else {
    // Estimation des dépenses selon le nombre de logements
    let pourcentageDépenses;
    if (nombreLogements <= 2) pourcentageDépenses = 30;
    else if (nombreLogements <= 4) pourcentageDépenses = 35;
    else if (nombreLogements <= 6) pourcentageDépenses = 45;
    else pourcentageDépenses = 50;
    
    depensesTotal = (revenusBruts * pourcentageDépenses) / 100;
    
    // Répartition estimée des dépenses
    depensesDetaillees = {
      taxesMunicipales: depensesTotal * 0.35,
      taxesScolaires: depensesTotal * 0.05,
      assurances: depensesTotal * 0.15,
      entretienReparations: depensesTotal * 0.15,
      electriciteChauffage: depensesTotal * 0.10,
      gestion: depensesTotal * 0.10,
      autres: depensesTotal * 0.10
    };
  }
  
  // FINANCEMENT - Calcul des paiements mensuels pour chaque source de financement
  const calculPaiementMensuel = (montant, tauxAnnuel, termeMois) => {
    const tauxMensuel = tauxAnnuel / 100 / 12;
    return montant * (tauxMensuel * Math.pow(1 + tauxMensuel, termeMois)) / (Math.pow(1 + tauxMensuel, termeMois) - 1);
  };
  
  const financementDetails = {};
  let paiementMensuelTotal = 0;
  
  // Financement bancaire
  if (financement.bancaire.pourcentage > 0) {
    const montant = prixAchat * (financement.bancaire.pourcentage / 100);
    const paiementMensuel = calculPaiementMensuel(montant, financement.bancaire.taux, financement.bancaire.terme * 12);
    financementDetails.bancaire = {
      montant,
      paiementMensuel,
      paiementAnnuel: paiementMensuel * 12
    };
    paiementMensuelTotal += paiementMensuel;
  }
  
  // Balance vendeur
  if (financement.vendeur.pourcentage > 0) {
    const montant = prixAchat * (financement.vendeur.pourcentage / 100);
    const paiementMensuel = calculPaiementMensuel(montant, financement.vendeur.taux, financement.vendeur.terme * 12);
    financementDetails.vendeur = {
      montant,
      paiementMensuel,
      paiementAnnuel: paiementMensuel * 12
    };
    paiementMensuelTotal += paiementMensuel;
  }
  
  // Prêteur privé
  if (financement.prive.pourcentage > 0) {
    const montant = prixAchat * (financement.prive.pourcentage / 100);
    const paiementMensuel = calculPaiementMensuel(montant, financement.prive.taux, financement.prive.terme * 12);
    financementDetails.prive = {
      montant,
      paiementMensuel,
      paiementAnnuel: paiementMensuel * 12
    };
    paiementMensuelTotal += paiementMensuel;
  }
  
  // Mise de fonds
  const miseDeFonds = prixAchat * (financement.miseDeFonds / 100);
  financementDetails.miseDeFonds = {
    montant: miseDeFonds,
    pourcentage: financement.miseDeFonds
  };
  
  // Calcul du RNO (Revenus Nets d'Opération)
  const rno = revenusBruts - depensesTotal;
  const rnoMensuel = rno / 12;
  
  // Calcul de la liquidité (cashflow)
  const liquiditeMensuelle = rnoMensuel - paiementMensuelTotal;
  const liquiditeAnnuelle = liquiditeMensuelle * 12;
  const cashflowParPorteMois = liquiditeMensuelle / nombreLogements;
  
  // Calcul des ratios d'évaluation
  const tauxCapitalisation = (rno / prixAchat) * 100; // Cap Rate en pourcentage
  const multiplicateur = prixAchat / revenusBruts; // GRM (Gross Rent Multiplier)
  const ratioCouvertureDette = rno / (paiementMensuelTotal * 12); // DCR (Debt Coverage Ratio)
  
  return {
    // Informations de base
    prixAchat,
    revenusBruts,
    revenusMensuels,
    nombreLogements,
    
    // Dépenses
    depensesTotal,
    depensesDetaillees,
    
    // RNO
    rno,
    rnoMensuel,
    
    // Financement
    financementDetails,
    paiementMensuelTotal,
    paiementAnnuelTotal: paiementMensuelTotal * 12,
    
    // Liquidité
    liquiditeMensuelle,
    liquiditeAnnuelle,
    cashflowParPorteMois,
    
    // Ratios
    tauxCapitalisation,
    multiplicateur,
    ratioCouvertureDette,
    
    // Indicateurs de rentabilité
    rentable: cashflowParPorteMois >= 75,
    rendementMiseDeFonds: (liquiditeAnnuelle / miseDeFonds) * 100
  };
};

/**
 * Calculateur de liquidité détaillé pour FLIP avec financement créatif
 * 
 * @param {Object} params Paramètres du calcul
 * @param {number} params.prixAchat - Prix d'achat de la propriété
 * @param {number} params.valeurApresRenovation - Valeur estimée après rénovation
 * @param {number} params.coutRenovations - Coût des rénovations
 * @param {number} params.dureeProjetMois - Durée du projet en mois
 * @param {Object} params.fraisAcquisition - Frais d'acquisition (notaire, taxes, etc.)
 * @param {Object} params.fraisPossession - Frais de possession pendant les travaux
 * @param {Object} params.fraisVente - Frais de vente
 * @param {Object} params.financement - Structure de financement
 * @returns {Object} Résultats détaillés du calcul pour un FLIP
 */
export const calculLiquiditeFlip = ({
  prixAchat,
  valeurApresRenovation,
  coutRenovations,
  dureeProjetMois = 3,
  fraisAcquisition = null,
  fraisPossession = null,
  fraisVente = null,
  financement = {
    bancaire: { pourcentage: 75, taux: 5 },
    vendeur: { pourcentage: 15, taux: 8 },
    prive: { pourcentage: 0, taux: 10 },
    miseDeFonds: 10
  }
}) => {
  // FRAIS D'ACQUISITION
  let totalFraisAcquisition = 0;
  const fraisAcquisitionDetailles = {};
  
  if (fraisAcquisition) {
    // Utilisation des frais détaillés fournis
    totalFraisAcquisition = Object.values(fraisAcquisition).reduce((sum, val) => sum + val, 0);
    Object.assign(fraisAcquisitionDetailles, fraisAcquisition);
  } else {
    // Estimation des frais d'acquisition
    fraisAcquisitionDetailles.droitsMutation = prixAchat * 0.015; // Taxes de mutation (approximatif)
    fraisAcquisitionDetailles.fraisNotaire = Math.min(1500, prixAchat * 0.01); // Frais de notaire
    fraisAcquisitionDetailles.fraisInspection = 500; // Inspection pré-achat
    fraisAcquisitionDetailles.autresFrais = 500; // Autres frais divers
    
    totalFraisAcquisition = Object.values(fraisAcquisitionDetailles).reduce((sum, val) => sum + val, 0);
  }
  
  // FRAIS DE POSSESSION
  let totalFraisPossession = 0;
  const fraisPossessionDetailles = {};
  
  if (fraisPossession) {
    // Utilisation des frais détaillés fournis
    totalFraisPossession = Object.values(fraisPossession).reduce((sum, val) => sum + val, 0);
    Object.assign(fraisPossessionDetailles, fraisPossession);
  } else {
    // Estimation des frais de possession mensuels
    const fraisAssurancesMensuel = prixAchat * 0.0005; // 0.6% du prix annuellement
    const fraisTaxesMensuel = prixAchat * 0.001; // 1.2% du prix annuellement
    const fraisUtilitesMensuel = 150; // Électricité, eau, etc.
    
    fraisPossessionDetailles.assurances = fraisAssurancesMensuel * dureeProjetMois;
    fraisPossessionDetailles.taxes = fraisTaxesMensuel * dureeProjetMois;
    fraisPossessionDetailles.utilites = fraisUtilitesMensuel * dureeProjetMois;
    
    // Intérêts sur financement
    let interetsFinancement = 0;
    if (financement.bancaire.pourcentage > 0) {
      const montantBancaire = prixAchat * (financement.bancaire.pourcentage / 100);
      const tauxMensuel = financement.bancaire.taux / 100 / 12;
      interetsFinancement += montantBancaire * tauxMensuel * dureeProjetMois;
    }
    
    if (financement.vendeur.pourcentage > 0) {
      const montantVendeur = prixAchat * (financement.vendeur.pourcentage / 100);
      const tauxMensuel = financement.vendeur.taux / 100 / 12;
      interetsFinancement += montantVendeur * tauxMensuel * dureeProjetMois;
    }
    
    if (financement.prive.pourcentage > 0) {
      const montantPrive = prixAchat * (financement.prive.pourcentage / 100);
      const tauxMensuel = financement.prive.taux / 100 / 12;
      interetsFinancement += montantPrive * tauxMensuel * dureeProjetMois;
    }
    
    fraisPossessionDetailles.interetsFinancement = interetsFinancement;
    
    totalFraisPossession = Object.values(fraisPossessionDetailles).reduce((sum, val) => sum + val, 0);
  }
  
  // FRAIS DE VENTE
  let totalFraisVente = 0;
  const fraisVenteDetailles = {};
  
  if (fraisVente) {
    // Utilisation des frais détaillés fournis
    totalFraisVente = Object.values(fraisVente).reduce((sum, val) => sum + val, 0);
    Object.assign(fraisVenteDetailles, fraisVente);
  } else {
    // Estimation des frais de vente
    fraisVenteDetailles.commissionsCourtier = valeurApresRenovation * 0.05; // Commission courtier (5%)
    fraisVenteDetailles.fraisNotaire = Math.min(1500, valeurApresRenovation * 0.01); // Frais de notaire
    fraisVenteDetailles.marketing = 1000; // Marketing, photos, etc.
    fraisVenteDetailles.autresFrais = 500; // Autres frais
    
    totalFraisVente = Object.values(fraisVenteDetailles).reduce((sum, val) => sum + val, 0);
  }
  
  // FINANCEMENT
  const miseDeFonds = prixAchat * (financement.miseDeFonds / 100);
  const totalEmprunt = prixAchat - miseDeFonds;
  
  // CALCUL DU PROFIT
  const coutTotal = prixAchat + coutRenovations + totalFraisAcquisition + totalFraisPossession + totalFraisVente;
  const profitBrut = valeurApresRenovation - coutTotal;
  const profitNet = profitBrut; // À ajuster si on considère les impôts
  
  // CALCUL DES RATIOS
  const rendementMiseDeFonds = (profitNet / miseDeFonds) * 100;
  const rapportProfit = (profitNet / coutTotal) * 100;
  const ROI = (profitNet / (prixAchat + coutRenovations)) * 100;
  
  return {
    // Informations de base
    prixAchat,
    valeurApresRenovation,
    coutRenovations,
    dureeProjetMois,
    
    // Frais détaillés
    fraisAcquisition: {
      total: totalFraisAcquisition,
      details: fraisAcquisitionDetailles
    },
    fraisPossession: {
      total: totalFraisPossession,
      details: fraisPossessionDetailles
    },
    fraisVente: {
      total: totalFraisVente,
      details: fraisVenteDetailles
    },
    
    // Financement
    financement: {
      miseDeFonds,
      pourcentageMiseDeFonds: financement.miseDeFonds,
      totalEmprunt,
      pourcentageEmprunt: 100 - financement.miseDeFonds
    },
    
    // Coût et profits
    coutTotal,
    profitBrut,
    profitNet,
    
    // Ratios et rentabilité
    rendementMiseDeFonds,
    rapportProfit,
    ROI,
    rentable: profitNet >= 25000, // Seuil de rentabilité recommandé pour un FLIP
    
    // Métriques temporelles
    profitParMois: profitNet / dureeProjetMois,
    rendementAnnualise: (profitNet / miseDeFonds) * (12 / dureeProjetMois) * 100
  };
};
