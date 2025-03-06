/**
 * Calculateur de Liquidité
 * 
 * Ce module implémente le calculateur de liquidité selon la méthode des Secrets de l'Immobilier.
 * Il permet d'analyser en détail la rentabilité et les flux de trésorerie d'un investissement immobilier.
 */

/**
 * Structure des revenus pour le calculateur de liquidité
 * @typedef {Object} LiquidityRevenues
 * @property {number} baseRent - Revenus de loyers de base
 * @property {number} [parking] - Revenus de stationnement
 * @property {number} [storage] - Revenus d'espaces de rangement
 * @property {number} [laundry] - Revenus de buanderie
 * @property {number} [other] - Autres revenus
 */

/**
 * Structure des dépenses pour le calculateur de liquidité
 * @typedef {Object} LiquidityExpenses
 * @property {number} [municipalTax] - Taxes municipales
 * @property {number} [schoolTax] - Taxes scolaires
 * @property {number} [insurance] - Assurances
 * @property {number} [electricity] - Électricité
 * @property {number} [heating] - Chauffage
 * @property {number} [maintenance] - Entretien et réparations
 * @property {number} [management] - Frais de gestion
 * @property {number} [snowRemoval] - Déneigement
 * @property {number} [landscaping] - Aménagement paysager
 * @property {number} [vacancy] - Provision pour vacance (%)
 * @property {number} [badDebt] - Provision pour mauvaises créances (%)
 * @property {number} [other] - Autres dépenses
 */

/**
 * Structure du financement pour le calculateur de liquidité
 * @typedef {Object} LiquidityFinancing
 * @property {number} [purchasePrice] - Prix d'achat
 * @property {number} [downPayment] - Mise de fonds
 * @property {number} [firstMortgageAmount] - Montant de la première hypothèque
 * @property {number} [firstMortgageRate] - Taux d'intérêt de la première hypothèque (%)
 * @property {number} [firstMortgageTerm] - Durée du terme de la première hypothèque (ans)
 * @property {number} [firstMortgageAmortization] - Période d'amortissement de la première hypothèque (ans)
 * @property {number} [secondMortgageAmount] - Montant de la deuxième hypothèque (balance vendeur ou prêt privé)
 * @property {number} [secondMortgageRate] - Taux d'intérêt de la deuxième hypothèque (%)
 * @property {number} [secondMortgageTerm] - Durée du terme de la deuxième hypothèque (ans)
 * @property {number} [secondMortgageAmortization] - Période d'amortissement de la deuxième hypothèque (ans)
 */

/**
 * Structure des entrées du calculateur de liquidité
 * @typedef {Object} LiquidityCalculatorInput
 * @property {number} units - Nombre d'unités (portes)
 * @property {LiquidityRevenues} revenues - Revenus du bien immobilier
 * @property {LiquidityExpenses} expenses - Dépenses du bien immobilier
 * @property {LiquidityFinancing} financing - Détails du financement
 */

/**
 * Structure des résultats du calculateur de liquidité
 * @typedef {Object} LiquidityCalculatorResult
 * @property {number} grossRevenue - Revenus bruts totaux
 * @property {number} totalExpenses - Dépenses totales
 * @property {number} netOperatingIncome - Revenu net d'exploitation (RNE)
 * @property {number} totalMortgagePayment - Paiements hypothécaires totaux
 * @property {number} cashflow - Liquidité annuelle
 * @property {number} cashflowPerUnit - Liquidité par porte par mois
 * @property {number} capRate - Taux de capitalisation (%)
 * @property {number} cashOnCash - Rendement sur mise de fonds (%)
 * @property {boolean} isViable - Indique si le projet est viable (cashflow positif et minimum par porte)
 * @property {string} rating - Évaluation du projet (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 * @property {string} recommendation - Recommandation basée sur l'analyse
 * @property {Object} breakdown - Détail des calculs
 * @property {Object} optimizations - Suggestions d'optimisations potentielles
 */

/**
 * Seuils de rentabilité par porte
 * @const {Object}
 */
const PROFITABILITY_THRESHOLDS = {
  MINIMUM: 50,   // Seuil minimum acceptable pour un cashflow par porte ($/mois)
  TARGET: 75,    // Seuil cible pour un bon cashflow par porte ($/mois)
  EXCELLENT: 100 // Seuil excellent pour un cashflow par porte ($/mois)
};

/**
 * Calcule la liquidité détaillée d'un investissement immobilier
 * @param {LiquidityCalculatorInput} input - Données d'entrée pour le calcul
 * @returns {LiquidityCalculatorResult} - Résultats de l'analyse
 */
function calculateLiquidity(input) {
  // Validation des entrées
  validateInput(input);
  
  // Extraction des valeurs
  const { units, revenues, expenses, financing } = input;
  
  // ----- CALCUL DES REVENUS -----
  // Somme des différentes sources de revenus
  const grossRevenue = calculateGrossRevenue(revenues);
  
  // ----- CALCUL DES DÉPENSES -----
  // Somme des différentes dépenses d'exploitation
  const totalExpenses = calculateTotalExpenses(expenses, grossRevenue);
  
  // ----- CALCUL DU REVENU NET D'EXPLOITATION -----
  const netOperatingIncome = grossRevenue - totalExpenses;
  
  // ----- CALCUL DES PAIEMENTS HYPOTHÉCAIRES -----
  const { 
    totalMortgagePayment, 
    firstMortgagePayment, 
    secondMortgagePayment 
  } = calculateMortgagePayments(financing);
  
  // ----- CALCUL DU CASHFLOW -----
  const cashflow = netOperatingIncome - totalMortgagePayment;
  
  // ----- CALCUL DU CASHFLOW PAR PORTE PAR MOIS -----
  const cashflowPerUnit = cashflow / units / 12;
  
  // ----- CALCUL DU TAUX DE CAPITALISATION -----
  const capRate = (netOperatingIncome / financing.purchasePrice) * 100;
  
  // ----- CALCUL DU RENDEMENT SUR MISE DE FONDS -----
  const cashOnCash = (cashflow / financing.downPayment) * 100;
  
  // ----- ÉVALUATION DU PROJET -----
  // Déterminer si le projet est viable
  const isViable = cashflow > 0 && cashflowPerUnit >= PROFITABILITY_THRESHOLDS.MINIMUM;
  
  // Évaluation du projet
  const rating = getRating(cashflowPerUnit);
  
  // Générer une recommandation
  const recommendation = generateRecommendation(cashflowPerUnit, capRate, cashOnCash, isViable);
  
  // ----- SUGGESTIONS D'OPTIMISATION -----
  const optimizations = generateOptimizations(input, grossRevenue, totalExpenses, cashflowPerUnit);
  
  // ----- RETOURNER LES RÉSULTATS -----
  return {
    grossRevenue: roundToTwo(grossRevenue),
    totalExpenses: roundToTwo(totalExpenses),
    netOperatingIncome: roundToTwo(netOperatingIncome),
    totalMortgagePayment: roundToTwo(totalMortgagePayment),
    cashflow: roundToTwo(cashflow),
    cashflowPerUnit: roundToTwo(cashflowPerUnit),
    capRate: roundToTwo(capRate),
    cashOnCash: roundToTwo(cashOnCash),
    isViable,
    rating,
    recommendation,
    breakdown: {
      revenues: {
        baseRent: roundToTwo(revenues.baseRent || 0),
        parking: roundToTwo(revenues.parking || 0),
        storage: roundToTwo(revenues.storage || 0),
        laundry: roundToTwo(revenues.laundry || 0),
        other: roundToTwo(revenues.other || 0),
        total: roundToTwo(grossRevenue)
      },
      expenses: {
        municipalTax: roundToTwo(expenses.municipalTax || 0),
        schoolTax: roundToTwo(expenses.schoolTax || 0),
        insurance: roundToTwo(expenses.insurance || 0),
        electricity: roundToTwo(expenses.electricity || 0),
        heating: roundToTwo(expenses.heating || 0),
        maintenance: roundToTwo(expenses.maintenance || 0),
        management: roundToTwo(expenses.management || 0),
        snowRemoval: roundToTwo(expenses.snowRemoval || 0),
        landscaping: roundToTwo(expenses.landscaping || 0),
        vacancy: roundToTwo((expenses.vacancy || 0) * grossRevenue / 100),
        badDebt: roundToTwo((expenses.badDebt || 0) * grossRevenue / 100),
        other: roundToTwo(expenses.other || 0),
        total: roundToTwo(totalExpenses)
      },
      financing: {
        firstMortgage: roundToTwo(firstMortgagePayment),
        secondMortgage: roundToTwo(secondMortgagePayment),
        total: roundToTwo(totalMortgagePayment)
      }
    },
    optimizations
  };
}

/**
 * Valide les entrées du calculateur
 * @param {LiquidityCalculatorInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
  if (!input) {
    throw new Error("Les données d'entrée sont requises");
  }
  
  if (!input.units || input.units <= 0 || !Number.isInteger(input.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!input.revenues) {
    throw new Error("Les données de revenus sont requises");
  }
  
  if (!input.revenues.baseRent && input.revenues.baseRent !== 0) {
    throw new Error("Le revenu de loyer de base est requis");
  }
  
  if (!input.expenses) {
    throw new Error("Les données de dépenses sont requises");
  }
  
  if (!input.financing) {
    throw new Error("Les données de financement sont requises");
  }
  
  if (!input.financing.purchasePrice || input.financing.purchasePrice <= 0) {
    throw new Error("Le prix d'achat doit être un nombre positif");
  }
  
  if (!input.financing.downPayment && input.financing.downPayment !== 0) {
    throw new Error("La mise de fonds est requise");
  }
  
  if (input.financing.downPayment < 0) {
    throw new Error("La mise de fonds doit être un nombre positif ou zéro");
  }
  
  const totalFinancing = (input.financing.firstMortgageAmount || 0) + (input.financing.secondMortgageAmount || 0);
  const expectedFinancing = input.financing.purchasePrice - input.financing.downPayment;
  
  if (Math.abs(totalFinancing - expectedFinancing) > 1) { // Tolérance de 1$ pour les erreurs d'arrondi
    throw new Error("Le total du financement (hypothèques) + mise de fonds doit être égal au prix d'achat");
  }
}

/**
 * Calcule le revenu brut total
 * @param {LiquidityRevenues} revenues - Données de revenus
 * @returns {number} - Revenu brut total
 */
function calculateGrossRevenue(revenues) {
  const baseRent = revenues.baseRent || 0;
  const parking = revenues.parking || 0;
  const storage = revenues.storage || 0;
  const laundry = revenues.laundry || 0;
  const other = revenues.other || 0;
  
  return baseRent + parking + storage + laundry + other;
}

/**
 * Calcule les dépenses totales
 * @param {LiquidityExpenses} expenses - Données de dépenses
 * @param {number} grossRevenue - Revenu brut total
 * @returns {number} - Dépenses totales
 */
function calculateTotalExpenses(expenses, grossRevenue) {
  const municipalTax = expenses.municipalTax || 0;
  const schoolTax = expenses.schoolTax || 0;
  const insurance = expenses.insurance || 0;
  const electricity = expenses.electricity || 0;
  const heating = expenses.heating || 0;
  const maintenance = expenses.maintenance || 0;
  const management = expenses.management || 0;
  const snowRemoval = expenses.snowRemoval || 0;
  const landscaping = expenses.landscaping || 0;
  
  // Provisions calculées comme pourcentage du revenu brut
  const vacancy = grossRevenue * (expenses.vacancy || 0) / 100;
  const badDebt = grossRevenue * (expenses.badDebt || 0) / 100;
  
  const other = expenses.other || 0;
  
  return municipalTax + schoolTax + insurance + electricity + heating + 
         maintenance + management + snowRemoval + landscaping + 
         vacancy + badDebt + other;
}

/**
 * Calcule les paiements hypothécaires
 * @param {LiquidityFinancing} financing - Données de financement
 * @returns {Object} - Paiements hypothécaires
 */
function calculateMortgagePayments(financing) {
  let firstMortgagePayment = 0;
  let secondMortgagePayment = 0;
  
  // Calcul du paiement de la première hypothèque
  if (financing.firstMortgageAmount && financing.firstMortgageAmount > 0) {
    if (financing.firstMortgageRate && financing.firstMortgageAmortization) {
      firstMortgagePayment = calculateMortgagePayment(
        financing.firstMortgageAmount,
        financing.firstMortgageRate,
        financing.firstMortgageAmortization
      );
    } else {
      // Méthode HIGH-5 simplifiée si le détail du prêt n'est pas disponible
      firstMortgagePayment = financing.firstMortgageAmount * 0.005 * 12;
    }
  }
  
  // Calcul du paiement de la deuxième hypothèque (si applicable)
  if (financing.secondMortgageAmount && financing.secondMortgageAmount > 0) {
    if (financing.secondMortgageRate && financing.secondMortgageAmortization) {
      secondMortgagePayment = calculateMortgagePayment(
        financing.secondMortgageAmount,
        financing.secondMortgageRate,
        financing.secondMortgageAmortization
      );
    } else {
      // Méthode HIGH-5 simplifiée si le détail du prêt n'est pas disponible
      secondMortgagePayment = financing.secondMortgageAmount * 0.005 * 12;
    }
  }
  
  const totalMortgagePayment = firstMortgagePayment + secondMortgagePayment;
  
  return {
    totalMortgagePayment,
    firstMortgagePayment,
    secondMortgagePayment
  };
}

/**
 * Calcule le paiement mensuel d'un prêt hypothécaire
 * @param {number} principal - Montant du prêt
 * @param {number} annualRate - Taux d'intérêt annuel (%)
 * @param {number} amortizationYears - Période d'amortissement (années)
 * @returns {number} - Paiement annuel
 */
function calculateMortgagePayment(principal, annualRate, amortizationYears) {
  const monthlyRate = (annualRate / 100) / 12;
  const totalPayments = amortizationYears * 12;
  
  // Formule du paiement mensuel: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyPayment = 
    principal * 
    monthlyRate * 
    Math.pow(1 + monthlyRate, totalPayments) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1);
  
  // Convertir en paiement annuel
  return monthlyPayment * 12;
}

/**
 * Évalue la qualité du projet en fonction du cashflow par porte
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @returns {string} - Évaluation (EXCELLENT, GOOD, ACCEPTABLE, POOR)
 */
function getRating(cashflowPerUnit) {
  if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return "EXCELLENT";
  } else if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.TARGET) {
    return "GOOD";
  } else if (cashflowPerUnit >= PROFITABILITY_THRESHOLDS.MINIMUM) {
    return "ACCEPTABLE";
  } else {
    return "POOR";
  }
}

/**
 * Génère une recommandation basée sur les résultats de l'analyse
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @param {number} capRate - Taux de capitalisation (%)
 * @param {number} cashOnCash - Rendement sur mise de fonds (%)
 * @param {boolean} isViable - Indique si le projet est viable
 * @returns {string} - Recommandation
 */
function generateRecommendation(cashflowPerUnit, capRate, cashOnCash, isViable) {
  if (!isViable) {
    if (cashflowPerUnit <= 0) {
      return "Ce projet générera un cashflow négatif. Il est fortement déconseillé d'investir à moins de pouvoir négocier un prix d'achat plus bas, optimiser les revenus ou réduire les dépenses.";
    } else {
      return `Ce projet génère un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, ce qui est inférieur au seuil minimum recommandé de ${PROFITABILITY_THRESHOLDS.MINIMUM}$. Envisagez de négocier un meilleur prix ou d'optimiser la structure de revenus et dépenses.`;
    }
  }
  
  if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.TARGET) {
    return `Ce projet est acceptable avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, mais reste sous le seuil cible de ${PROFITABILITY_THRESHOLDS.TARGET}$. Le taux de capitalisation est de ${capRate.toFixed(2)}% et le rendement sur mise de fonds est de ${cashOnCash.toFixed(2)}%. Vérifiez si vous pouvez améliorer la rentabilité.`;
  } else if (cashflowPerUnit < PROFITABILITY_THRESHOLDS.EXCELLENT) {
    return `Ce projet est bon avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, un taux de capitalisation de ${capRate.toFixed(2)}% et un rendement sur mise de fonds de ${cashOnCash.toFixed(2)}%. Procédez à une analyse plus détaillée et évaluez les possibilités d'optimisation.`;
  } else {
    return `Ce projet est excellent avec un cashflow de ${cashflowPerUnit.toFixed(2)}$ par porte par mois, un taux de capitalisation de ${capRate.toFixed(2)}% et un rendement sur mise de fonds de ${cashOnCash.toFixed(2)}%. Fortement recommandé pour investissement.`;
  }
}

/**
 * Génère des suggestions d'optimisations potentielles
 * @param {LiquidityCalculatorInput} input - Données d'entrée
 * @param {number} grossRevenue - Revenu brut total
 * @param {number} totalExpenses - Dépenses totales
 * @param {number} cashflowPerUnit - Cashflow par porte par mois
 * @returns {Object} - Suggestions d'optimisations
 */
function generateOptimizations(input, grossRevenue, totalExpenses, cashflowPerUnit) {
  const optimizations = {
    revenue: [],
    expenses: [],
    financing: []
  };
  
  // ----- OPTIMISATIONS DES REVENUS -----
  
  // Si pas de revenus de stationnement
  if (!input.revenues.parking || input.revenues.parking === 0) {
    optimizations.revenue.push({
      type: "PARKING",
      description: "Ajouter des revenus de stationnement",
      potential: `~${input.units * 25}$ par mois`,
      impact: "Moyen"
    });
  }
  
  // Si pas de revenus de buanderie
  if (!input.revenues.laundry || input.revenues.laundry === 0) {
    optimizations.revenue.push({
      type: "LAUNDRY",
      description: "Installer des machines à laver/sécher payantes",
      potential: `~${Math.round(input.units * 17.5)}$ par mois`,
      impact: "Moyen"
    });
  }
  
  // Si le loyer semble bas (estimation simplifiée)
  const avgRentPerUnit = (input.revenues.baseRent || 0) / input.units / 12;
  if (avgRentPerUnit < 850) {
    optimizations.revenue.push({
      type: "RENT_INCREASE",
      description: "Augmenter progressivement les loyers pour atteindre le prix du marché",
      potential: "Variable selon l'écart avec le marché",
      impact: "Élevé"
    });
  }
  
  // ----- OPTIMISATIONS DES DÉPENSES -----
  
  // Ratio dépenses/revenus élevé
  const expenseRatio = totalExpenses / grossRevenue;
  if (expenseRatio > 0.45) {
    optimizations.expenses.push({
      type: "EXPENSE_RATIO",
      description: "Le ratio dépenses/revenus est élevé",
      potential: "Réduire les dépenses de 5-10%",
      impact: "Élevé"
    });
  }
  
  // Dépenses d'entretien élevées
  if (input.expenses.maintenance && input.expenses.maintenance > grossRevenue * 0.1) {
    optimizations.expenses.push({
      type: "HIGH_MAINTENANCE",
      description: "Les frais d'entretien sont anormalement élevés",
      potential: "Évaluer les causes et réduire",
      impact: "Moyen"
    });
  }
  
  // ----- OPTIMISATIONS DU FINANCEMENT -----
  
  // Taux d'intérêt élevé sur la première hypothèque
  if (input.financing.firstMortgageRate && input.financing.firstMortgageRate > 5) {
    optimizations.financing.push({
      type: "HIGH_INTEREST_RATE",
      description: "Taux d'intérêt de la première hypothèque élevé",
      potential: "Renégocier ou refinancer pour obtenir un meilleur taux",
      impact: "Élevé"
    });
  }
  
  // Deuxième hypothèque avec taux élevé
  if (input.financing.secondMortgageRate && input.financing.secondMortgageRate > 7) {
    optimizations.financing.push({
      type: "HIGH_SECOND_MORTGAGE_RATE",
      description: "Taux d'intérêt de la deuxième hypothèque très élevé",
      potential: "Chercher d'autres sources de financement",
      impact: "Moyen"
    });
  }
  
  // Mise de fonds élevée
  const downPaymentRatio = input.financing.downPayment / input.financing.purchasePrice;
  if (downPaymentRatio > 0.25) {
    optimizations.financing.push({
      type: "HIGH_DOWN_PAYMENT",
      description: "La mise de fonds représente plus de 25% du prix d'achat",
      potential: "Optimiser la structure de financement pour améliorer le levier financier",
      impact: "Moyen"
    });
  }
  
  return optimizations;
}

/**
 * Arrondit un nombre à deux décimales
 * @param {number} num - Nombre à arrondir
 * @returns {number} - Nombre arrondi
 */
function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

/**
 * Calcule le prix d'achat maximum pour atteindre un cashflow cible par porte
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.units - Nombre d'unités (portes)
 * @param {LiquidityRevenues} params.revenues - Revenus du bien immobilier
 * @param {LiquidityExpenses} params.expenses - Dépenses du bien immobilier
 * @param {Object} params.mortgageTerms - Conditions du prêt hypothécaire
 * @param {number} params.mortgageTerms.downPaymentRatio - Ratio de mise de fonds (%)
 * @param {number} params.mortgageTerms.interestRate - Taux d'intérêt (%)
 * @param {number} params.mortgageTerms.amortizationYears - Période d'amortissement (années)
 * @param {number} params.targetCashflowPerUnit - Cashflow cible par porte par mois (par défaut: 75)
 * @returns {Object} - Résultats du calcul
 */
function calculateMaxPurchasePrice(params) {
  // Validation des entrées
  if (!params.units || params.units <= 0 || !Number.isInteger(params.units)) {
    throw new Error("Le nombre d'unités doit être un entier positif");
  }
  
  if (!params.revenues) {
    throw new Error("Les données de revenus sont requises");
  }
  
  if (!params.expenses) {
    throw new Error("Les données de dépenses sont requises");
  }
  
  if (!params.mortgageTerms) {
    throw new Error("Les conditions du prêt hypothécaire sont requises");
  }
  
  const targetCashflowPerUnit = params.targetCashflowPerUnit || PROFITABILITY_THRESHOLDS.TARGET;
  
  // Calcul du revenu brut
  const grossRevenue = calculateGrossRevenue(params.revenues);
  
  // Calcul des dépenses (sans considérer les provisions basées sur le revenu)
  let baseExpenses = 0;
  Object.keys(params.expenses).forEach(key => {
    if (key !== 'vacancy' && key !== 'badDebt') {
      baseExpenses += params.expenses[key] || 0;
    }
  });
  
  // Ajouter les provisions basées sur le revenu
  const provisions = grossRevenue * (((params.expenses.vacancy || 0) + (params.expenses.badDebt || 0)) / 100);
  const totalExpenses = baseExpenses + provisions;
  
  // Revenu net d'exploitation (RNE)
  const netOperatingIncome = grossRevenue - totalExpenses;
  
  // Cashflow annuel cible
  const targetAnnualCashflow = targetCashflowPerUnit * params.units * 12;
  
  // Paiement hypothécaire maximum possible
  const maxMortgagePayment = netOperatingIncome - targetAnnualCashflow;
  
  // Vérifier si le paiement hypothécaire maximum est cohérent
  if (maxMortgagePayment <= 0) {
    throw new Error("Impossible d'atteindre le cashflow cible avec ces paramètres. Réduisez le cashflow cible, augmentez les revenus ou réduisez les dépenses.");
  }
  
  let maxMortgageAmount;
  
  // Si les détails du prêt sont disponibles, calculer le montant maximum plus précisément
  if (params.mortgageTerms.interestRate && params.mortgageTerms.amortizationYears) {
    const monthlyRate = (params.mortgageTerms.interestRate / 100) / 12;
    const totalPayments = params.mortgageTerms.amortizationYears * 12;
    const monthlyPayment = maxMortgagePayment / 12;
    
    // Formule: P = PMT * ((1 - (1 + r)^-n) / r)
    maxMortgageAmount = monthlyPayment * ((1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate);
  } else {
    // Méthode HIGH-5 simplifiée
    maxMortgageAmount = maxMortgagePayment / (0.005 * 12);
  }
  
  // Calculer le prix d'achat maximum en fonction de la mise de fonds
  const downPaymentRatio = params.mortgageTerms.downPaymentRatio / 100;
  const maxPurchasePrice = maxMortgageAmount / (1 - downPaymentRatio);
  
  // Calculer la mise de fonds correspondante
  const downPayment = maxPurchasePrice * downPaymentRatio;
  
  return {
    maxPurchasePrice: roundToTwo(maxPurchasePrice),
    downPayment: roundToTwo(downPayment),
    mortgageAmount: roundToTwo(maxMortgageAmount),
    annualMortgagePayment: roundToTwo(maxMortgagePayment),
    netOperatingIncome: roundToTwo(netOperatingIncome),
    cashflow: roundToTwo(targetAnnualCashflow),
    cashflowPerUnit: roundToTwo(targetCashflowPerUnit)
  };
}

/**
 * Analyse la sensibilité du cashflow en fonction de différents scénarios
 * @param {LiquidityCalculatorInput} baseInput - Données d'entrée de base
 * @param {Object} scenarios - Pourcentages de variation pour chaque paramètre
 * @returns {Object} - Résultats de l'analyse de sensibilité
 */
function performSensitivityAnalysis(baseInput, scenarios = {}) {
  // Scénarios par défaut si non spécifiés
  const variationScenarios = {
    purchasePrice: scenarios.purchasePrice || [-5, 0, 5],    // % de variation du prix d'achat
    baseRent: scenarios.baseRent || [-5, 0, 5],              // % de variation des loyers
    expenses: scenarios.expenses || [-10, 0, 10],            // % de variation des dépenses
    interestRate: scenarios.interestRate || [-0.5, 0, 0.5]   // points de % de variation du taux d'intérêt
  };
  
  const results = {
    baseCase: calculateLiquidity(baseInput),
    scenarios: []
  };
  
  // ----- ANALYSE POUR LE PRIX D'ACHAT -----
  variationScenarios.purchasePrice.forEach(purchasePriceVar => {
    if (purchasePriceVar === 0) return; // Ignorer le cas de base
    
    const newPurchasePrice = baseInput.financing.purchasePrice * (1 + purchasePriceVar / 100);
    const newDownPayment = baseInput.financing.downPayment * (1 + purchasePriceVar / 100);
    const newFirstMortgage = baseInput.financing.firstMortgageAmount * (1 + purchasePriceVar / 100);
    const newSecondMortgage = baseInput.financing.secondMortgageAmount ? baseInput.financing.secondMortgageAmount * (1 + purchasePriceVar / 100) : 0;
    
    const newInput = {
      ...baseInput,
      financing: {
        ...baseInput.financing,
        purchasePrice: newPurchasePrice,
        downPayment: newDownPayment,
        firstMortgageAmount: newFirstMortgage,
        secondMortgageAmount: newSecondMortgage
      }
    };
    
    const scenario = {
      name: `Prix d'achat ${purchasePriceVar > 0 ? '+' : ''}${purchasePriceVar}%`,
      input: newInput,
      result: calculateLiquidity(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // ----- ANALYSE POUR LES LOYERS -----
  variationScenarios.baseRent.forEach(baseRentVar => {
    if (baseRentVar === 0) return; // Ignorer le cas de base
    
    const newBaseRent = baseInput.revenues.baseRent * (1 + baseRentVar / 100);
    
    const newInput = {
      ...baseInput,
      revenues: {
        ...baseInput.revenues,
        baseRent: newBaseRent
      }
    };
    
    const scenario = {
      name: `Loyers ${baseRentVar > 0 ? '+' : ''}${baseRentVar}%`,
      input: newInput,
      result: calculateLiquidity(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // ----- ANALYSE POUR LES DÉPENSES -----
  variationScenarios.expenses.forEach(expensesVar => {
    if (expensesVar === 0) return; // Ignorer le cas de base
    
    const newExpenses = {};
    
    // Appliquer la variation à toutes les dépenses sauf les provisions (vacancy, badDebt)
    Object.keys(baseInput.expenses).forEach(key => {
      if (key !== 'vacancy' && key !== 'badDebt') {
        newExpenses[key] = (baseInput.expenses[key] || 0) * (1 + expensesVar / 100);
      } else {
        newExpenses[key] = baseInput.expenses[key] || 0;
      }
    });
    
    const newInput = {
      ...baseInput,
      expenses: newExpenses
    };
    
    const scenario = {
      name: `Dépenses ${expensesVar > 0 ? '+' : ''}${expensesVar}%`,
      input: newInput,
      result: calculateLiquidity(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // ----- ANALYSE POUR LE TAUX D'INTÉRÊT -----
  variationScenarios.interestRate.forEach(interestRateVar => {
    if (interestRateVar === 0) return; // Ignorer le cas de base
    
    const newInput = {
      ...baseInput,
      financing: {
        ...baseInput.financing
      }
    };
    
    // Appliquer la variation au taux d'intérêt de la première hypothèque
    if (newInput.financing.firstMortgageRate) {
      newInput.financing.firstMortgageRate += interestRateVar;
    }
    
    const scenario = {
      name: `Taux d'intérêt ${interestRateVar > 0 ? '+' : ''}${interestRateVar}%`,
      input: newInput,
      result: calculateLiquidity(newInput)
    };
    
    results.scenarios.push(scenario);
  });
  
  // Trier les scénarios par cashflow par porte décroissant
  results.scenarios.sort((a, b) => b.result.cashflowPerUnit - a.result.cashflowPerUnit);
  
  return results;
}

module.exports = {
  PROFITABILITY_THRESHOLDS,
  calculateLiquidity,
  calculateMaxPurchasePrice,
  performSensitivityAnalysis
};
