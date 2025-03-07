/**
 * Utilitaires pour les calculs des calculateurs Napkin
 */

/**
 * Calcule la liquidité et autres métriques pour un investissement MULTI
 * en utilisant la méthode PAR (Prix-Appartements-Revenus) et HIGH-5
 * 
 * @param {Object} params - Paramètres du calcul
 * @param {number} params.prixAchat - Prix d'achat de l'immeuble
 * @param {number} params.nombreAppartements - Nombre d'appartements
 * @param {number} params.revenusBruts - Revenus bruts annuels
 * @returns {Object} Résultats des calculs
 */
export const calculerMulti = ({ prixAchat, nombreAppartements, revenusBruts }) => {
  // Déterminer le % des dépenses selon le nombre d'appartements
  let pourcentageDeDependances = 0.30; // Par défaut

  if (nombreAppartements >= 3 && nombreAppartements <= 4) {
    pourcentageDeDependances = 0.35;
  } else if (nombreAppartements >= 5 && nombreAppartements <= 6) {
    pourcentageDeDependances = 0.45;
  } else if (nombreAppartements >= 7) {
    pourcentageDeDependances = 0.50;
  }

  // Calcul des dépenses d'opération
  const depensesOperation = revenusBruts * pourcentageDeDependances;
  
  // Calcul des revenus nets d'opération (RNO)
  const rno = revenusBruts - depensesOperation;
  
  // Calcul du financement annuel avec la méthode HIGH-5
  const financementMensuel = prixAchat * 0.005;
  const financementAnnuel = financementMensuel * 12;
  
  // Calcul de la liquidité
  const liquidite = rno - financementAnnuel;
  
  // Calcul de la liquidité par porte par mois
  const liquiditeParPorteMois = nombreAppartements > 0 
    ? liquidite / nombreAppartements / 12 
    : 0;
  
  // Est-ce que l'objectif de rentabilité est atteint? (75$ par porte par mois)
  const objectifAtteint = liquiditeParPorteMois >= 75;

  // Calcul du prix d'offre maximum pour atteindre 75$ par porte par mois
  const liquiditeCible = nombreAppartements * 75 * 12;
  const financementMaximum = rno - liquiditeCible;
  const prixOffreMaximum = financementMaximum > 0 
    ? (financementMaximum / 12) / 0.005 
    : 0;

  return {
    depensesOperation,
    pourcentageDeDependances: pourcentageDeDependances * 100, // Conversion en % pour l'affichage
    rno,
    financementMensuel,
    financementAnnuel,
    liquidite,
    liquiditeParPorteMois,
    objectifAtteint,
    prixOffreMaximum
  };
};

/**
 * Calcule le profit ou le prix d'offre maximum pour un investissement FLIP
 * en utilisant la méthode FIP10 (Final-Initial-Prix rénovations-10%)
 * 
 * @param {Object} params - Paramètres du calcul
 * @param {number} params.prixFinal - Prix de vente estimé après travaux
 * @param {number} params.prixInitial - Prix d'achat initial
 * @param {number} params.prixRenovations - Coût des rénovations
 * @param {number} params.profitVise - Profit visé (optionnel, pour calculer le prix d'offre)
 * @returns {Object} Résultats des calculs
 */
export const calculerFlip = ({ prixFinal, prixInitial, prixRenovations, profitVise }) => {
  // Calcul des frais divers (acquisition, possession, vente) estimés à 10% du prix final
  const fraisDivers = prixFinal * 0.10;
  
  if (profitVise) {
    // Mode calcul du prix d'offre maximum
    const prixOffreMaximum = prixFinal - prixRenovations - fraisDivers - profitVise;
    
    return {
      fraisDivers,
      prixOffreMaximum,
      modeCalcul: 'prixOffre'
    };
  } else {
    // Mode calcul du profit
    const profit = prixFinal - prixInitial - prixRenovations - fraisDivers;
    const profitSuffisant = profit >= 25000; // L'objectif généralement visé est de 25 000$ min
    
    return {
      fraisDivers,
      profit,
      profitSuffisant,
      modeCalcul: 'profit'
    };
  }
};
