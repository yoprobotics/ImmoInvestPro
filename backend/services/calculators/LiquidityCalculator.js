/**
 * Service de calculateur de liquidité pour l'investissement immobilier
 * Permet des analyses détaillées de cashflow et de rentabilité
 */

class LiquidityCalculator {
  
  /**
   * Crée une nouvelle instance du calculateur de liquidité
   * 
   * @param {Object} options - Options de configuration
   * @param {number} options.purchasePrice - Prix d'achat du bien immobilier
   * @param {number} options.downPayment - Mise de fonds en dollars ou options.downPaymentPercentage pour un pourcentage
   * @param {number} options.downPaymentPercentage - Pourcentage de mise de fonds (optionnel, priorité à downPayment)
   * @param {number} options.grossRevenue - Revenus bruts annuels
   * @param {number} options.expenses - Dépenses annuelles ou pourcentage des revenus bruts
   * @param {boolean} options.expensesAsPercentage - Indique si les dépenses sont exprimées en pourcentage (défaut: false)
   * @param {number} options.interestRate - Taux d'intérêt annuel du prêt hypothécaire principal
   * @param {number} options.amortizationYears - Durée d'amortissement en années
   * @param {Array} options.otherFinancing - Autres financements (balance vendeur, prêt privé, etc.)
   */
  constructor(options) {
    // Valider les options essentielles
    if (!options) {
      throw new Error('Options requises pour initialiser le calculateur');
    }
    
    // Configuration avec valeurs par défaut
    this.purchasePrice = options.purchasePrice || 0;
    this.grossRevenue = options.grossRevenue || 0;
    this.interestRate = options.interestRate || 0;
    this.amortizationYears = options.amortizationYears || 25;
    this.expensesAsPercentage = options.expensesAsPercentage || false;
    
    // Gestion de la mise de fonds (montant ou pourcentage)
    if (options.downPayment !== undefined) {
      this.downPayment = options.downPayment;
    } else if (options.downPaymentPercentage !== undefined && options.purchasePrice) {
      this.downPayment = options.purchasePrice * (options.downPaymentPercentage / 100);
    } else {
      this.downPayment = 0;
    }
    
    // Gestion des dépenses (montant ou pourcentage des revenus)
    if (this.expensesAsPercentage && options.expenses !== undefined) {
      this.expenses = this.grossRevenue * (options.expenses / 100);
    } else {
      this.expenses = options.expenses || 0;
    }
    
    // Autres financements (balance vendeur, investisseur privé, etc.)
    this.otherFinancing = options.otherFinancing || [];
  }
  
  /**
   * Calcule le montant du prêt hypothécaire principal
   * 
   * @returns {number} Montant du prêt hypothécaire principal
   */
  calculateMortgageAmount() {
    // Si pas de prix d'achat, retourne 0
    if (!this.purchasePrice) return 0;
    
    // Calcul du montant total des autres financements
    const otherFinancingTotal = this.otherFinancing.reduce((sum, financing) => {
      return sum + (financing.amount || 0);
    }, 0);
    
    // Montant du prêt = prix d'achat - mise de fonds - autres financements
    return this.purchasePrice - this.downPayment - otherFinancingTotal;
  }
  
  /**
   * Calcule le paiement mensuel pour un prêt (formule PMT)
   * 
   * @param {number} principal - Capital du prêt
   * @param {number} annualRate - Taux d'intérêt annuel
   * @param {number} termYears - Durée en années
   * @returns {number} Paiement mensuel
   */
  calculateMonthlyPayment(principal, annualRate, termYears) {
    // Si pas de capital ou taux à 0, pas de paiement
    if (!principal || !annualRate) return 0;
    
    // Conversion des taux annuels en taux mensuels
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = termYears * 12;
    
    // Formule PMT pour calculer le paiement mensuel
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }
  
  /**
   * Calcule les paiements mensuels pour tous les financements
   * 
   * @returns {Object} Paiements mensuels détaillés
   */
  calculateMonthlyPayments() {
    // Calcul du paiement pour le prêt hypothécaire principal
    const mortgageAmount = this.calculateMortgageAmount();
    const mainMortgagePayment = this.calculateMonthlyPayment(
      mortgageAmount, 
      this.interestRate, 
      this.amortizationYears
    );
    
    // Calcul des paiements pour les autres financements
    const otherPayments = this.otherFinancing.map(financing => {
      const payment = this.calculateMonthlyPayment(
        financing.amount || 0,
        financing.interestRate || 0,
        financing.termYears || this.amortizationYears
      );
      
      return {
        type: financing.type || 'Autre financement',
        amount: financing.amount || 0,
        payment: payment
      };
    });
    
    // Total des paiements mensuels
    const totalMonthlyPayment = mainMortgagePayment + otherPayments.reduce((sum, financing) => {
      return sum + financing.payment;
    }, 0);
    
    return {
      mainMortgage: {
        amount: mortgageAmount,
        payment: mainMortgagePayment
      },
      otherFinancing: otherPayments,
      totalMonthlyPayment: totalMonthlyPayment,
      totalAnnualPayment: totalMonthlyPayment * 12
    };
  }
  
  /**
   * Calcule la liquidité (cashflow) de l'investissement
   * 
   * @returns {Object} Résultats détaillés incluant la liquidité
   */
  calculateLiquidity() {
    // Calcul du Revenu Net d'Opération (RNO)
    const netOperatingIncome = this.grossRevenue - this.expenses;
    
    // Calcul des paiements de financement
    const financingPayments = this.calculateMonthlyPayments();
    const annualFinancingPayment = financingPayments.totalAnnualPayment;
    
    // Calcul de la liquidité annuelle et mensuelle
    const annualCashflow = netOperatingIncome - annualFinancingPayment;
    const monthlyCashflow = annualCashflow / 12;
    
    // Calcul du rendement sur investissement (ROI)
    const investment = this.downPayment + this.otherFinancing.reduce((sum, financing) => {
      // Ne compter que les financements considérés comme faisant partie de l'investissement initial
      if (financing.includeInInvestment) {
        return sum + (financing.amount || 0);
      }
      return sum;
    }, 0);
    
    const roi = investment > 0 ? (annualCashflow / investment) * 100 : 0;
    
    return {
      purchasePrice: this.purchasePrice,
      downPayment: this.downPayment,
      mortgageAmount: financingPayments.mainMortgage.amount,
      otherFinancing: financingPayments.otherFinancing,
      grossRevenue: this.grossRevenue,
      expenses: this.expenses,
      netOperatingIncome: netOperatingIncome,
      annualFinancingPayment: annualFinancingPayment,
      annualCashflow: annualCashflow,
      monthlyCashflow: monthlyCashflow,
      roi: roi,
      investment: investment
    };
  }
  
  /**
   * Calcule le prix d'achat maximum pour obtenir un cashflow cible
   * 
   * @param {number} targetCashflow - Cashflow annuel cible
   * @returns {number} Prix d'achat maximum
   */
  calculateMaxPurchasePrice(targetCashflow) {
    // Convertir en cashflow annuel si c'est un cashflow mensuel
    const annualTargetCashflow = targetCashflow * (targetCashflow < 1000 ? 12 : 1);
    
    // Calcul du Revenu Net d'Opération
    const netOperatingIncome = this.grossRevenue - this.expenses;
    
    // Capacité de remboursement maximale = RNO - Cashflow cible
    const maxAnnualPayment = netOperatingIncome - annualTargetCashflow;
    
    // Conversion en paiement mensuel
    const maxMonthlyPayment = maxAnnualPayment / 12;
    
    // Si le paiement mensuel est négatif ou nul, aucun financement possible
    if (maxMonthlyPayment <= 0) return 0;
    
    // Calcul du montant de prêt maximum (formule inverse de PMT)
    const monthlyRate = this.interestRate / 100 / 12;
    const numberOfPayments = this.amortizationYears * 12;
    
    // Si taux d'intérêt nul, calcul simplifié
    if (monthlyRate === 0) {
      return maxMonthlyPayment * numberOfPayments;
    }
    
    // Formule inverse de PMT
    const maxLoanAmount = maxMonthlyPayment * 
                          (1 - Math.pow(1 + monthlyRate, -numberOfPayments)) /
                          monthlyRate;
    
    // Calcul du total des financements autres
    const otherFinancingTotal = this.otherFinancing.reduce((sum, financing) => {
      return sum + (financing.amount || 0);
    }, 0);
    
    // Prix d'achat maximum = prêt maximum + mise de fonds + autres financements
    // Si downPaymentPercentage est défini, alors recalculer avec le pourcentage
    if (this.downPaymentPercentage) {
      // Si mise de fonds en pourcentage, alors:
      // maxPrice = maxLoanAmount / (1 - downPaymentPercentage/100)
      return maxLoanAmount / (1 - this.downPaymentPercentage/100) + otherFinancingTotal;
    } else {
      // Sinon, simplement additionner
      return maxLoanAmount + this.downPayment + otherFinancingTotal;
    }
  }
  
  /**
   * Effectue une analyse de sensibilité pour comprendre l'impact des variations de paramètres
   * 
   * @param {Array} parameters - Liste des paramètres à faire varier
   * @param {number} variationPercentage - Pourcentage de variation
   * @param {number} steps - Nombre d'étapes de variation
   * @returns {Object} Résultats de l'analyse de sensibilité
   */
  performSensitivityAnalysis(parameters = ['interestRate'], variationPercentage = 10, steps = 5) {
    // Résultats pour chaque paramètre
    const results = {};
    
    // Pour chaque paramètre demandé
    parameters.forEach(param => {
      // Vérifier que le paramètre est valide
      if (!this.hasOwnProperty(param)) {
        results[param] = { error: `Paramètre invalide: ${param}` };
        return;
      }
      
      // Valeur d'origine
      const originalValue = this[param];
      
      // Tableau pour stocker les résultats de variation
      const variations = [];
      
      // Calculer l'incrément pour chaque étape
      const increment = (originalValue * variationPercentage / 100) / steps;
      
      // Calculer pour différentes valeurs (diminution et augmentation)
      for (let i = -steps; i <= steps; i++) {
        // Nouvelle valeur avec variation
        const newValue = originalValue + (i * increment);
        
        // Ne pas utiliser de valeurs négatives pour certains paramètres
        if ((param === 'purchasePrice' || param === 'downPayment' || param === 'grossRevenue') && newValue < 0) {
          continue;
        }
        
        // Créer une copie du calculateur avec la nouvelle valeur
        const calculatorCopy = new LiquidityCalculator({
          ...this,
          [param]: newValue
        });
        
        // Calculer la liquidité avec cette variation
        const liquidityResult = calculatorCopy.calculateLiquidity();
        
        // Ajouter le résultat au tableau
        variations.push({
          variationValue: newValue,
          variationPercentage: i * (variationPercentage / steps),
          liquidityResult
        });
      }
      
      // Stocker les résultats pour ce paramètre
      results[param] = {
        originalValue,
        variations
      };
    });
    
    return {
      baselineResult: this.calculateLiquidity(),
      parametersAnalyzed: parameters,
      variationPercentage,
      steps,
      results
    };
  }
}

module.exports = LiquidityCalculator;
