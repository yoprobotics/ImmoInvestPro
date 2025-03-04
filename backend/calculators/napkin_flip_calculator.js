/**
 * Calculateur Napkin pour les projets FLIP (FIP10)
 * 
 * Ce module implémente la méthode rapide d'analyse de rentabilité
 * pour les projets de type FLIP (achat-rénovation-revente).
 * 
 * La méthode "FIP10" est basée sur la formule suivante:
 * Profit = Prix Final - Prix Initial - Prix des Rénovations - 10% du Prix Final
 */

/**
 * Structure des entrées du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipInput
 * @property {number} initialPrice - Prix d'achat initial
 * @property {number} finalPrice - Prix de revente estimé
 * @property {number} renovationCost - Coût estimé des rénovations
 */

/**
 * Structure des résultats du calculateur Napkin FLIP
 * @typedef {Object} NapkinFlipResult
 * @property {number} profit - Profit estimé
 * @property {number} roi - Retour sur investissement (%)
 * @property {number} expenses - Dépenses totales
 * @property {Object} breakdown - Détail des calculs
 * @property {boolean} isViable - Indique si le projet est viable
 * @property {string} recommendation - Recommandation basée sur l'analyse
 */

/**
 * Calcule la rentabilité d'un projet FLIP avec la méthode Napkin (FIP10)
 * @param {NapkinFlipInput} input - Données d'entrée pour le calcul
 * @returns {NapkinFlipResult} - Résultats de l'analyse
 */
function calculateNapkinFlip(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des valeurs
  const { initialPrice, finalPrice, renovationCost } = input;
  
  // Calcul des frais (10% du prix final)
  const fees = finalPrice * 0.1;
  
  // Calcul du profit
  const profit = finalPrice - initialPrice - renovationCost - fees;
  
  // Calcul du ROI (retour sur investissement)
  const totalInvestment = initialPrice + renovationCost;
  const roi = (profit / totalInvestment) * 100;
  
  // Déterminer si le projet est viable (profit minimum de 25 000$)
  const isViable = profit >= 25000;
  
  // Générer une recommandation
  const recommendation = generateRecommendation(profit, roi, isViable);
  
  // Retourner les résultats
  return {
    profit: Math.round(profit * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    expenses: Math.round((initialPrice + renovationCost + fees) * 100) / 100,
    breakdown: {
      initialPrice,
      finalPrice,
      renovationCost,
      fees: Math.round(fees * 100) / 100,
      profit: Math.round(profit * 100) / 100
    },
    isViable,
    recommendation
  };
}

/**
 * Calcule le prix d'achat maximum pour atteindre un profit cible
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.finalPrice - Prix de revente estimé
 * @param {number} params.renovationCost - Coût estimé des rénovations
 * @param {number} params.targetProfit - Profit cible (par défaut: 25000)
 * @returns {number} - Prix d'achat maximum recommandé
 */
function calculateMaxPurchasePrice(params) {
  // Validation des entrées
  if (!params.finalPrice || params.finalPrice <= 0) {
    throw new Error("Le prix final doit être un nombre positif");
  }
  
  if (!params.renovationCost || params.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être un nombre positif ou zéro");
  }
  
  const targetProfit = params.targetProfit || 25000;
  
  if (targetProfit <= 0) {
    throw new Error("Le profit cible doit être un nombre positif");
  }
  
  // Calcul des frais (10% du prix final)
  const fees = params.finalPrice * 0.1;
  
  // Calcul du prix d'achat maximum
  const maxPurchasePrice = params.finalPrice - params.renovationCost - fees - targetProfit;
  
  // Vérifier si le prix maximum est cohérent
  if (maxPurchasePrice <= 0) {
    throw new Error("Impossible d'atteindre le profit cible avec ces paramètres. Réduisez le coût des rénovations ou augmentez le prix final.");
  }
  
  return Math.round(maxPurchasePrice * 100) / 100;
}

/**
 * Valide les entrées du calculateur
 * @param {NapkinFlipInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
  if (!input) {
    throw new Error("Les données d'entrée sont requises");
  }
  
  if (!input.initialPrice || input.initialPrice <= 0) {
    throw new Error("Le prix initial doit être un nombre positif");
  }
  
  if (!input.finalPrice || input.finalPrice <= 0) {
    throw new Error("Le prix final doit être un nombre positif");
  }
  
  if (!input.renovationCost && input.renovationCost !== 0) {
    throw new Error("Le coût des rénovations est requis");
  }
  
  if (input.renovationCost < 0) {
    throw new Error("Le coût des rénovations doit être un nombre positif ou zéro");
  }
  
  if (input.finalPrice <= input.initialPrice) {
    throw new Error("Le prix final doit être supérieur au prix initial");
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} profit - Profit estimé
 * @param {number} roi - Retour sur investissement (%)
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(profit, roi, isViable) {
  if (!isViable) {
    if (profit <= 0) {
      return "Ce projet n'est pas rentable. Évitez cet investissement à moins de pouvoir négocier un prix d'achat plus bas ou de réduire les coûts de rénovation.";
    } else {
      return `Ce projet génère un profit de ${profit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}, ce qui est inférieur au seuil recommandé de 25 000$. Considérez de négocier un meilleur prix d'achat.`;
    }
  }
  
  if (roi < 15) {
    return `Ce projet est viable avec un profit de ${profit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}, mais le ROI de ${roi.toFixed(1)}% est relativement faible. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (roi < 30) {
    return `Ce projet est intéressant avec un profit de ${profit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} et un ROI de ${roi.toFixed(1)}%. Procédez à une analyse plus détaillée.`;
  } else {
    return `Ce projet est très prometteur avec un profit de ${profit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} et un excellent ROI de ${roi.toFixed(1)}%. Recommandé pour investissement.`;
  }
}

/**
 * Analyse la sensibilité du profit en fonction de différents scénarios
 * @param {NapkinFlipInput} baseInput - Données d'entrée de base
 * @param {Object} scenarios - Pourcentages de variation pour chaque paramètre
 * @returns {Object} - Résultats de l'analyse de sensibilité
 */
function performSensitivityAnalysis(baseInput, scenarios = {}) {
  // Scénarios par défaut si non spécifiés
  const variationScenarios = {
    initialPrice: scenarios.initialPrice || [-5, 0, 5],  // % de variation du prix initial
    finalPrice: scenarios.finalPrice || [-5, 0, 5],      // % de variation du prix final
    renovationCost: scenarios.renovationCost || [-10, 0, 20] // % de variation du coût des rénovations
  };
  
  const results = {
    baseCase: calculateNapkinFlip(baseInput),
    scenarios: []
  };
  
  // Analyse pour le prix initial
  variationScenarios.initialPrice.forEach(initialPriceVar => {
    if (initialPriceVar === 0) return; // Ignorer le cas de base
    
    const newInitialPrice = baseInput.initialPrice * (1 + initialPriceVar / 100);
    const scenario = {
      name: `Prix d'achat ${initialPriceVar > 0 ? '+' : ''}${initialPriceVar}%`,
      input: { ...baseInput, initialPrice: newInitialPrice },
      result: calculateNapkinFlip({ ...baseInput, initialPrice: newInitialPrice })
    };
    
    results.scenarios.push(scenario);
  });
  
  // Analyse pour le prix final
  variationScenarios.finalPrice.forEach(finalPriceVar => {
    if (finalPriceVar === 0) return; // Ignorer le cas de base
    
    const newFinalPrice = baseInput.finalPrice * (1 + finalPriceVar / 100);
    const scenario = {
      name: `Prix de vente ${finalPriceVar > 0 ? '+' : ''}${finalPriceVar}%`,
      input: { ...baseInput, finalPrice: newFinalPrice },
      result: calculateNapkinFlip({ ...baseInput, finalPrice: newFinalPrice })
    };
    
    results.scenarios.push(scenario);
  });
  
  // Analyse pour le coût des rénovations
  variationScenarios.renovationCost.forEach(renovationCostVar => {
    if (renovationCostVar === 0) return; // Ignorer le cas de base
    
    const newRenovationCost = baseInput.renovationCost * (1 + renovationCostVar / 100);
    const scenario = {
      name: `Coût des rénovations ${renovationCostVar > 0 ? '+' : ''}${renovationCostVar}%`,
      input: { ...baseInput, renovationCost: newRenovationCost },
      result: calculateNapkinFlip({ ...baseInput, renovationCost: newRenovationCost })
    };
    
    results.scenarios.push(scenario);
  });
  
  // Trier les scénarios par profit décroissant
  results.scenarios.sort((a, b) => b.result.profit - a.result.profit);
  
  return results;
}

module.exports = {
  calculateNapkinFlip,
  calculateMaxPurchasePrice,
  performSensitivityAnalysis
};
