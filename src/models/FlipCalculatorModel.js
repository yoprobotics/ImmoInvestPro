/**
 * Modèle de données pour le calculateur de rendement FLIP 3.0
 * Basé sur la méthodologie "Les Secrets de l'Immobilier"
 */

/**
 * Structure principale du modèle de données du calculateur FLIP
 */
export class FlipCalculatorModel {
  constructor() {
    // Informations de base sur la propriété
    this.propertyInfo = {
      address: '',
      purchasePrice: 0,
      estimatedResaleValue: 0,
      acquisitionDate: null,
      expectedSaleDate: null,
      projectDuration: 0, // en mois
    };

    // Frais d'acquisition
    this.acquisitionCosts = {
      welcomeTax: 0,
      notaryFees: 0,
      inspectionFees: 0,
      evaluationFees: 0,
      legalFees: 0,
      otherAcquisitionCosts: 0,
    };

    // Financement
    this.financing = {
      downPayment: 0,
      mortgageAmount: 0,
      interestRate: 0,
      term: 0,
      amortization: 0,
      monthlyPayment: 0,
      totalInterestPaid: 0,
    };

    // Budget de rénovation (détaillé par pièce et catégorie)
    this.renovationBudget = {
      kitchen: {
        cabinets: 0,
        countertops: 0,
        appliances: 0,
        plumbing: 0,
        flooring: 0,
        electrical: 0,
        painting: 0,
        other: 0,
      },
      bathroom: {
        vanity: 0,
        toilet: 0,
        shower: 0,
        bathtub: 0,
        plumbing: 0,
        flooring: 0,
        electrical: 0,
        painting: 0,
        other: 0,
      },
      livingRoom: {
        flooring: 0,
        electrical: 0,
        painting: 0,
        other: 0,
      },
      bedrooms: {
        flooring: 0,
        electrical: 0,
        painting: 0,
        other: 0,
      },
      basement: {
        flooring: 0,
        electrical: 0,
        plumbing: 0,
        framing: 0,
        insulation: 0,
        drywall: 0,
        painting: 0,
        other: 0,
      },
      exterior: {
        roofing: 0,
        siding: 0,
        windows: 0,
        doors: 0,
        landscaping: 0,
        driveway: 0,
        other: 0,
      },
      general: {
        permits: 0,
        demolition: 0,
        cleanup: 0,
        other: 0,
      },
      // Contingence pour les imprévus (typiquement 10-15%)
      contingency: 0,
    };

    // Frais de possession pendant les travaux
    this.holdingCosts = {
      mortgage: 0,
      propertyTaxes: 0,
      utilities: 0,
      insurance: 0,
      maintenance: 0,
      otherHoldingCosts: 0,
    };

    // Frais de vente
    this.sellingCosts = {
      realEstateCommission: 0,
      marketingCosts: 0,
      stagingCosts: 0,
      legalFees: 0,
      otherSellingCosts: 0,
    };

    // Résultats calculés
    this.results = {
      totalPurchasePrice: 0,
      totalRenovationCosts: 0,
      totalHoldingCosts: 0,
      totalSellingCosts: 0,
      totalProjectCosts: 0,
      grossProfit: 0,
      netProfit: 0,
      returnOnInvestment: 0,
      cashOnCashReturn: 0,
      annualizedReturn: 0,
    };

    // Calendrier des travaux
    this.timeline = {
      acquisitionDate: null,
      renovationStartDate: null,
      renovationEndDate: null,
      listingDate: null,
      expectedSaleDate: null,
      actualSaleDate: null,
      milestones: [],
    };
  }

  /**
   * Calcule les résultats basés sur les données actuelles
   */
  calculateResults() {
    // Calcul des totaux
    this.calculateTotalAcquisitionCosts();
    this.calculateTotalRenovationCosts();
    this.calculateTotalHoldingCosts();
    this.calculateTotalSellingCosts();
    
    // Calcul du profit
    this.calculateProfits();
    
    // Calcul des rendements
    this.calculateReturns();
    
    return this.results;
  }

  /**
   * Calcule le coût total d'acquisition
   */
  calculateTotalAcquisitionCosts() {
    const acquisition = this.acquisitionCosts;
    const totalAcquisitionCosts = 
      acquisition.welcomeTax +
      acquisition.notaryFees +
      acquisition.inspectionFees +
      acquisition.evaluationFees +
      acquisition.legalFees +
      acquisition.otherAcquisitionCosts;
    
    this.results.totalPurchasePrice = this.propertyInfo.purchasePrice + totalAcquisitionCosts;
    return this.results.totalPurchasePrice;
  }

  /**
   * Calcule le coût total des rénovations
   */
  calculateTotalRenovationCosts() {
    let totalRenovation = 0;
    
    // Additionner toutes les catégories de rénovation
    Object.keys(this.renovationBudget).forEach(category => {
      if (typeof this.renovationBudget[category] === 'object') {
        Object.keys(this.renovationBudget[category]).forEach(subcategory => {
          totalRenovation += this.renovationBudget[category][subcategory];
        });
      } else {
        totalRenovation += this.renovationBudget[category];
      }
    });
    
    this.results.totalRenovationCosts = totalRenovation;
    return totalRenovation;
  }

  /**
   * Calcule les frais de possession totaux
   */
  calculateTotalHoldingCosts() {
    const holding = this.holdingCosts;
    const projectDuration = this.propertyInfo.projectDuration;
    
    // Calculer les frais mensuels
    const monthlyHoldingCosts = 
      holding.mortgage +
      holding.propertyTaxes / 12 +
      holding.utilities +
      holding.insurance / 12 +
      holding.maintenance +
      holding.otherHoldingCosts;
    
    this.results.totalHoldingCosts = monthlyHoldingCosts * projectDuration;
    return this.results.totalHoldingCosts;
  }

  /**
   * Calcule les frais de vente totaux
   */
  calculateTotalSellingCosts() {
    const selling = this.sellingCosts;
    const resaleValue = this.propertyInfo.estimatedResaleValue;
    
    // Calculer la commission immobilière (typiquement un pourcentage)
    const commission = selling.realEstateCommission;
    
    this.results.totalSellingCosts = 
      commission +
      selling.marketingCosts +
      selling.stagingCosts +
      selling.legalFees +
      selling.otherSellingCosts;
    
    return this.results.totalSellingCosts;
  }

  /**
   * Calcule les profits bruts et nets
   */
  calculateProfits() {
    const resaleValue = this.propertyInfo.estimatedResaleValue;
    
    // Profit brut = Prix de revente - Prix d'achat
    this.results.grossProfit = resaleValue - this.propertyInfo.purchasePrice;
    
    // Profit net = Prix de revente - Tous les coûts
    this.results.netProfit = resaleValue - (
      this.results.totalPurchasePrice +
      this.results.totalRenovationCosts +
      this.results.totalHoldingCosts +
      this.results.totalSellingCosts
    );
    
    return this.results.netProfit;
  }

  /**
   * Calcule les différents rendements
   */
  calculateReturns() {
    // Mise de fonds = Down payment + Frais d'acquisition
    const totalInvestment = this.financing.downPayment + 
                           (this.results.totalPurchasePrice - this.propertyInfo.purchasePrice);
    
    // ROI = Profit net / Investissement total
    this.results.returnOnInvestment = (this.results.netProfit / totalInvestment) * 100;
    
    // Rendement annualisé (si projet > 1 an)
    const projectYears = this.propertyInfo.projectDuration / 12;
    if (projectYears > 0) {
      this.results.annualizedReturn = (Math.pow(1 + this.results.returnOnInvestment / 100, 1 / projectYears) - 1) * 100;
    } else {
      this.results.annualizedReturn = this.results.returnOnInvestment;
    }
    
    return {
      roi: this.results.returnOnInvestment,
      annualized: this.results.annualizedReturn
    };
  }

  /**
   * Valide si le projet est viable selon les critères FLIP
   * Critère typique: profit minimum de 25 000$
   */
  isViable(minimumProfit = 25000) {
    return this.results.netProfit >= minimumProfit;
  }

  /**
   * Calcule le prix d'achat maximum pour atteindre un profit cible
   */
  calculateMaximumPurchasePrice(targetProfit = 25000) {
    // Profit net désiré = Prix de revente - (Prix d'achat + Rénovations + Frais de possession + Frais de vente)
    // Donc: Prix d'achat max = Prix de revente - (Profit désiré + Rénovations + Frais de possession + Frais de vente)
    
    // On recalcule d'abord avec le prix actuel pour avoir des estimations à jour
    this.calculateResults();
    
    // On garde en mémoire les coûts qui ne dépendent pas directement du prix d'achat
    const nonPurchaseCosts = 
      this.results.totalRenovationCosts +
      this.results.totalHoldingCosts +
      this.results.totalSellingCosts;
    
    // On calcule le prix d'achat maximum
    const maxPurchasePrice = this.propertyInfo.estimatedResaleValue - (targetProfit + nonPurchaseCosts);
    
    return maxPurchasePrice > 0 ? maxPurchasePrice : 0;
  }
}

export default FlipCalculatorModel;
