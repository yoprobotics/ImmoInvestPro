/**
 * Calculateur détaillé pour les projets FLIP
 * Basé sur le calculateur FLIP 3.0
 */

const FlipDetailedModel = require('../models/FlipDetailedModel');

class FlipDetailedCalculator {
  constructor(data = {}) {
    this.data = this._initializeData(data);
    // Initialiser les 3 scénarios
    this.scenarios = {
      1: { ...this.data, generalInfo: { ...this.data.generalInfo, scenario: 1 } },
      2: { ...this.data, generalInfo: { ...this.data.generalInfo, scenario: 2 } },
      3: { ...this.data, generalInfo: { ...this.data.generalInfo, scenario: 3 } }
    };
    this.currentScenario = 1;
  }

  /**
   * Initialise les données en fusionnant le modèle par défaut avec les données fournies
   * @param {Object} data - Données fournies par l'utilisateur
   * @returns {Object} - Données initialisées
   */
  _initializeData(data) {
    // Créer une copie profonde du modèle
    const defaultModel = JSON.parse(JSON.stringify(FlipDetailedModel));
    
    // Fusionner les données fournies avec le modèle par défaut
    const mergedData = { ...defaultModel };
    
    // Parcourir toutes les sections du modèle
    Object.keys(defaultModel).forEach(section => {
      if (data[section]) {
        mergedData[section] = {
          ...defaultModel[section],
          ...data[section]
        };
      }
    });
    
    return mergedData;
  }

  /**
   * Définit le scénario actif
   * @param {number} scenarioNumber - Numéro du scénario (1, 2 ou 3)
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  setScenario(scenarioNumber) {
    if (scenarioNumber < 1 || scenarioNumber > 3) {
      throw new Error('Le numéro de scénario doit être entre 1 et 3');
    }
    this.currentScenario = scenarioNumber;
    return this;
  }

  /**
   * Récupère les données du scénario actif
   * @returns {Object} - Données du scénario actif
   */
  getCurrentScenarioData() {
    return this.scenarios[this.currentScenario];
  }

  /**
   * Met à jour les données du scénario actif
   * @param {Object} newData - Nouvelles données à fusionner
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  updateCurrentScenario(newData) {
    const currentData = this.getCurrentScenarioData();
    
    // Fusionner section par section pour conserver la structure
    Object.keys(newData).forEach(section => {
      if (typeof newData[section] === 'object' && !Array.isArray(newData[section])) {
        this.scenarios[this.currentScenario][section] = {
          ...currentData[section],
          ...newData[section]
        };
      } else {
        this.scenarios[this.currentScenario][section] = newData[section];
      }
    });
    
    return this;
  }

  /**
   * Calcule les frais d'acquisition
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateAcquisitionCosts() {
    const data = this.getCurrentScenarioData();
    const { 
      purchasePrice, 
      transferTax, 
      legalFees, 
      inspectionFees, 
      appraisalFees, 
      mortgageInsurance,
      mortgageSetupFees,
      otherAcquisitionFees 
    } = data.acquisitionCosts;

    // Calculer le total des frais d'acquisition
    const totalAcquisitionCosts = 
      purchasePrice + 
      transferTax + 
      legalFees + 
      inspectionFees + 
      appraisalFees + 
      mortgageInsurance + 
      mortgageSetupFees + 
      otherAcquisitionFees;

    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      acquisitionCosts: {
        ...data.acquisitionCosts,
        totalAcquisitionCosts
      }
    });

    return this;
  }

  /**
   * Calcule les frais de rénovation
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateRenovationCosts() {
    const data = this.getCurrentScenarioData();
    const { 
      kitchen, 
      bathroom, 
      flooring, 
      painting, 
      windows, 
      doors, 
      roofing, 
      electrical, 
      plumbing, 
      hvac, 
      foundation, 
      exterior, 
      landscape, 
      permits, 
      laborCosts, 
      materials,
      contingency,
      otherRenovationCosts 
    } = data.renovationCosts;

    // Calculer le total des frais de rénovation
    const totalRenovationCosts = 
      kitchen + 
      bathroom + 
      flooring + 
      painting + 
      windows + 
      doors + 
      roofing + 
      electrical + 
      plumbing + 
      hvac + 
      foundation + 
      exterior + 
      landscape + 
      permits + 
      laborCosts + 
      materials + 
      contingency + 
      otherRenovationCosts;

    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      renovationCosts: {
        ...data.renovationCosts,
        totalRenovationCosts
      }
    });

    return this;
  }

  /**
   * Calcule les frais de vente
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateSellingCosts() {
    const data = this.getCurrentScenarioData();
    const { 
      realEstateCommission, 
      legalFeesForSale, 
      marketingCosts, 
      stagingCosts, 
      prepaymentPenalty, 
      otherSellingCosts 
    } = data.sellingCosts;

    // Calculer le total des frais de vente
    const totalSellingCosts = 
      realEstateCommission + 
      legalFeesForSale + 
      marketingCosts + 
      stagingCosts + 
      prepaymentPenalty + 
      otherSellingCosts;

    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      sellingCosts: {
        ...data.sellingCosts,
        totalSellingCosts
      }
    });

    return this;
  }

  /**
   * Calcule les revenus
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateRevenues() {
    const data = this.getCurrentScenarioData();
    const { 
      expectedSalePrice, 
      rentalIncome, 
      otherRevenues 
    } = data.revenues;

    // Calculer le total des revenus
    const totalRevenues = 
      expectedSalePrice + 
      rentalIncome + 
      otherRevenues;

    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      revenues: {
        ...data.revenues,
        totalRevenues
      }
    });

    return this;
  }

  /**
   * Calcule les frais de détention
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateHoldingCosts() {
    const data = this.getCurrentScenarioData();
    const { 
      propertyTaxes, 
      insurance, 
      utilities, 
      maintenance, 
      otherHoldingCosts 
    } = data.holdingCosts;
    
    // Obtenir la période de détention en mois
    const holdingPeriodMonths = data.actions.holdingPeriodMonths || 6; // 6 mois par défaut

    // Calculer le total mensuel des frais de détention
    const monthlyHoldingCosts = 
      (propertyTaxes / 12) + 
      (insurance / 12) + 
      utilities + 
      maintenance + 
      otherHoldingCosts;

    // Calculer le total des frais de détention pour toute la période
    const totalHoldingCosts = monthlyHoldingCosts * holdingPeriodMonths;

    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      holdingCosts: {
        ...data.holdingCosts,
        totalHoldingCosts
      }
    });

    return this;
  }

  /**
   * Calcule les frais de maintenance
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateMaintenanceCosts() {
    const data = this.getCurrentScenarioData();
    const { 
      repairs, 
      cleaning, 
      landscaping, 
      snowRemoval, 
      otherMaintenanceCosts 
    } = data.maintenanceCosts;

    // Obtenir la période de détention en mois
    const holdingPeriodMonths = data.actions.holdingPeriodMonths || 6; // 6 mois par défaut

    // Calculer le total mensuel des frais de maintenance
    const monthlyMaintenanceCosts = 
      repairs + 
      cleaning + 
      landscaping + 
      snowRemoval + 
      otherMaintenanceCosts;

    // Calculer le total des frais de maintenance pour toute la période
    const totalMaintenanceCosts = monthlyMaintenanceCosts * holdingPeriodMonths;

    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      maintenanceCosts: {
        ...data.maintenanceCosts,
        totalMaintenanceCosts
      }
    });

    return this;
  }

  /**
   * Calcule les paramètres de financement de la propriété
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculatePropertyFinancing() {
    const data = this.getCurrentScenarioData();
    const { 
      downPayment, 
      downPaymentPercentage, 
      firstMortgageAmount, 
      firstMortgageRate, 
      firstMortgageTerm, 
      firstMortgageAmortization,
      secondMortgageAmount, 
      secondMortgageRate, 
      secondMortgageTerm, 
      secondMortgageAmortization,
      privateLoanAmount, 
      privateLoanRate, 
      privateLoanTerm,
      vendorTakeBackAmount, 
      vendorTakeBackRate, 
      vendorTakeBackTerm 
    } = data.propertyFinancing;

    // Obtenir la période de détention en mois
    const holdingPeriodMonths = data.actions.holdingPeriodMonths || 6; // 6 mois par défaut

    // Calculer les paiements mensuels pour chaque type de financement
    const monthlyPaymentFirstMortgage = this._calculateMonthlyPayment(
      firstMortgageAmount, 
      firstMortgageRate, 
      firstMortgageAmortization
    );

    const monthlyPaymentSecondMortgage = this._calculateMonthlyPayment(
      secondMortgageAmount, 
      secondMortgageRate, 
      secondMortgageAmortization
    );

    const monthlyPaymentPrivateLoan = this._calculateMonthlyPayment(
      privateLoanAmount, 
      privateLoanRate, 
      privateLoanTerm
    );

    const monthlyPaymentVendorTakeBack = this._calculateMonthlyPayment(
      vendorTakeBackAmount, 
      vendorTakeBackRate, 
      vendorTakeBackTerm
    );

    // Calculer le paiement mensuel total
    const totalMonthlyPayment = 
      monthlyPaymentFirstMortgage + 
      monthlyPaymentSecondMortgage + 
      monthlyPaymentPrivateLoan + 
      monthlyPaymentVendorTakeBack;

    // Calculer les intérêts totaux payés pendant la période de détention
    const totalInterestPaid = this._calculateTotalInterestPaid(
      [
        { 
          principal: firstMortgageAmount, 
          rate: firstMortgageRate, 
          payment: monthlyPaymentFirstMortgage 
        },
        { 
          principal: secondMortgageAmount, 
          rate: secondMortgageRate, 
          payment: monthlyPaymentSecondMortgage 
        },
        { 
          principal: privateLoanAmount, 
          rate: privateLoanRate, 
          payment: monthlyPaymentPrivateLoan 
        },
        { 
          principal: vendorTakeBackAmount, 
          rate: vendorTakeBackRate, 
          payment: monthlyPaymentVendorTakeBack 
        }
      ],
      holdingPeriodMonths
    );

    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      propertyFinancing: {
        ...data.propertyFinancing,
        monthlyPaymentFirstMortgage,
        monthlyPaymentSecondMortgage,
        monthlyPaymentPrivateLoan,
        monthlyPaymentVendorTakeBack,
        totalMonthlyPayment,
        totalInterestPaid
      }
    });

    return this;
  }

  /**
   * Calcule les paramètres de financement des rénovations
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateRenovationFinancing() {
    const data = this.getCurrentScenarioData();
    const { 
      personalFunds, 
      creditLineAmount, 
      creditLineRate, 
      renovationLoanAmount, 
      renovationLoanRate, 
      renovationLoanTerm 
    } = data.renovationFinancing;

    // Obtenir la période de détention en mois
    const holdingPeriodMonths = data.actions.holdingPeriodMonths || 6; // 6 mois par défaut

    // Calculer les paiements mensuels pour chaque type de financement
    const monthlyPaymentCreditLine = this._calculateMonthlyPayment(
      creditLineAmount, 
      creditLineRate, 
      renovationLoanTerm || holdingPeriodMonths // Utiliser la période de détention si le terme n'est pas spécifié
    );

    const monthlyPaymentRenovationLoan = this._calculateMonthlyPayment(
      renovationLoanAmount, 
      renovationLoanRate, 
      renovationLoanTerm || holdingPeriodMonths // Utiliser la période de détention si le terme n'est pas spécifié
    );

    // Calculer le paiement mensuel total
    const totalMonthlyPaymentRenovation = 
      monthlyPaymentCreditLine + 
      monthlyPaymentRenovationLoan;

    // Calculer les intérêts totaux payés pendant la période de détention
    const totalInterestPaidRenovation = this._calculateTotalInterestPaid(
      [
        { 
          principal: creditLineAmount, 
          rate: creditLineRate, 
          payment: monthlyPaymentCreditLine 
        },
        { 
          principal: renovationLoanAmount, 
          rate: renovationLoanRate, 
          payment: monthlyPaymentRenovationLoan 
        }
      ],
      Math.min(holdingPeriodMonths, renovationLoanTerm || holdingPeriodMonths)
    );

    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      renovationFinancing: {
        ...data.renovationFinancing,
        monthlyPaymentCreditLine,
        monthlyPaymentRenovationLoan,
        totalMonthlyPaymentRenovation,
        totalInterestPaidRenovation
      }
    });

    return this;
  }

  /**
   * Calcule l'analyse de rentabilité
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateProfitabilityAnalysis() {
    const data = this.getCurrentScenarioData();
    
    // Récupérer les totaux des différentes sections
    const { totalAcquisitionCosts } = data.acquisitionCosts;
    const { totalRenovationCosts } = data.renovationCosts;
    const { totalSellingCosts } = data.sellingCosts;
    const { totalRevenues } = data.revenues;
    const { totalHoldingCosts } = data.holdingCosts;
    const { totalMaintenanceCosts } = data.maintenanceCosts;
    const { totalInterestPaid } = data.propertyFinancing;
    const { totalInterestPaidRenovation } = data.renovationFinancing;
    
    // Récupérer les montants investis en liquidités
    const { downPayment } = data.propertyFinancing;
    const { personalFunds } = data.renovationFinancing;
    
    // Calculer le coût total d'acquisition
    const acquisitionCost = totalAcquisitionCosts;
    
    // Calculer le coût total de rénovation
    const renovationCost = totalRenovationCosts;
    
    // Calculer l'investissement total
    const totalInvestment = acquisitionCost + renovationCost;
    
    // Calculer le total des liquidités investies
    const totalCashInvested = downPayment + personalFunds;
    
    // Calculer le profit brut
    const grossProfit = totalRevenues - acquisitionCost - renovationCost;
    
    // Calculer les coûts de détention totaux
    const holdingCosts = totalHoldingCosts + totalMaintenanceCosts;
    
    // Calculer les coûts de financement totaux
    const financingCosts = totalInterestPaid + totalInterestPaidRenovation;
    
    // Calculer le profit net
    const netProfit = grossProfit - holdingCosts - totalSellingCosts - financingCosts;
    
    // Calculer le retour sur investissement (ROI)
    const roi = totalCashInvested > 0 ? (netProfit / totalCashInvested) * 100 : 0;
    
    // Obtenir la période de détention en années
    const holdingPeriodMonths = data.actions.holdingPeriodMonths || 6; // 6 mois par défaut
    const holdingPeriodYears = holdingPeriodMonths / 12;
    
    // Calculer le ROI annualisé
    const annualizedRoi = holdingPeriodYears > 0 ? 
      (Math.pow(1 + (roi / 100), 1 / holdingPeriodYears) - 1) * 100 : 
      roi;
    
    // Calculer le Cash-on-Cash Return
    const cashOnCash = totalCashInvested > 0 ? (netProfit / totalCashInvested) * 100 : 0;
    
    // Mettre à jour le scénario actif
    this.updateCurrentScenario({
      profitabilityAnalysis: {
        acquisitionCost,
        renovationCost,
        totalInvestment,
        totalRevenue: totalRevenues,
        grossProfit,
        holdingCosts,
        sellingCosts: totalSellingCosts,
        financingCosts,
        netProfit,
        roi,
        annualizedRoi,
        cashOnCash,
        totalCashInvested
      }
    });
    
    return this;
  }

  /**
   * Calcule le paiement mensuel pour un prêt
   * @param {number} principal - Montant du prêt
   * @param {number} annualRate - Taux d'intérêt annuel (%)
   * @param {number} termYears - Durée du prêt en années
   * @returns {number} - Paiement mensuel
   */
  _calculateMonthlyPayment(principal, annualRate, termYears) {
    if (!principal || !annualRate || !termYears) return 0;
    
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = termYears * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    return principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  /**
   * Calcule les intérêts totaux payés sur plusieurs prêts pendant une période donnée
   * @param {Array} loans - Tableau d'objets de prêts { principal, rate, payment }
   * @param {number} months - Nombre de mois
   * @returns {number} - Intérêts totaux payés
   */
  _calculateTotalInterestPaid(loans, months) {
    let totalInterest = 0;
    
    loans.forEach(loan => {
      if (!loan.principal || !loan.rate || !loan.payment) return;
      
      const monthlyRate = loan.rate / 100 / 12;
      let remainingPrincipal = loan.principal;
      
      for (let i = 0; i < months; i++) {
        if (remainingPrincipal <= 0) break;
        
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = Math.min(loan.payment - interestPayment, remainingPrincipal);
        
        totalInterest += interestPayment;
        remainingPrincipal -= principalPayment;
      }
    });
    
    return totalInterest;
  }

  /**
   * Calcule tous les aspects du scénario actif
   * @returns {FlipDetailedCalculator} - Instance courante pour chaînage
   */
  calculateAll() {
    return this
      .calculateAcquisitionCosts()
      .calculateRenovationCosts()
      .calculateSellingCosts()
      .calculateRevenues()
      .calculateHoldingCosts()
      .calculateMaintenanceCosts()
      .calculatePropertyFinancing()
      .calculateRenovationFinancing()
      .calculateProfitabilityAnalysis();
  }

  /**
   * Retourne les résultats du scénario actif
   * @returns {Object} - Résultats
   */
  getResults() {
    return {
      scenarios: this.scenarios,
      currentScenario: this.currentScenario,
      currentScenarioData: this.getCurrentScenarioData()
    };
  }

  /**
   * Compare les trois scénarios
   * @returns {Object} - Résultats de la comparaison
   */
  compareScenarios() {
    // Calculer tous les scénarios
    this.setScenario(1).calculateAll();
    this.setScenario(2).calculateAll();
    this.setScenario(3).calculateAll();
    
    // Préparer la comparaison
    const comparison = {
      profitability: {
        netProfit: {
          scenario1: this.scenarios[1].profitabilityAnalysis.netProfit,
          scenario2: this.scenarios[2].profitabilityAnalysis.netProfit,
          scenario3: this.scenarios[3].profitabilityAnalysis.netProfit
        },
        roi: {
          scenario1: this.scenarios[1].profitabilityAnalysis.roi,
          scenario2: this.scenarios[2].profitabilityAnalysis.roi,
          scenario3: this.scenarios[3].profitabilityAnalysis.roi
        },
        annualizedRoi: {
          scenario1: this.scenarios[1].profitabilityAnalysis.annualizedRoi,
          scenario2: this.scenarios[2].profitabilityAnalysis.annualizedRoi,
          scenario3: this.scenarios[3].profitabilityAnalysis.annualizedRoi
        },
        cashOnCash: {
          scenario1: this.scenarios[1].profitabilityAnalysis.cashOnCash,
          scenario2: this.scenarios[2].profitabilityAnalysis.cashOnCash,
          scenario3: this.scenarios[3].profitabilityAnalysis.cashOnCash
        },
        totalInvestment: {
          scenario1: this.scenarios[1].profitabilityAnalysis.totalInvestment,
          scenario2: this.scenarios[2].profitabilityAnalysis.totalInvestment,
          scenario3: this.scenarios[3].profitabilityAnalysis.totalInvestment
        },
        holdingPeriodMonths: {
          scenario1: this.scenarios[1].actions.holdingPeriodMonths,
          scenario2: this.scenarios[2].actions.holdingPeriodMonths,
          scenario3: this.scenarios[3].actions.holdingPeriodMonths
        }
      },
      costs: {
        acquisitionCosts: {
          scenario1: this.scenarios[1].acquisitionCosts.totalAcquisitionCosts,
          scenario2: this.scenarios[2].acquisitionCosts.totalAcquisitionCosts,
          scenario3: this.scenarios[3].acquisitionCosts.totalAcquisitionCosts
        },
        renovationCosts: {
          scenario1: this.scenarios[1].renovationCosts.totalRenovationCosts,
          scenario2: this.scenarios[2].renovationCosts.totalRenovationCosts,
          scenario3: this.scenarios[3].renovationCosts.totalRenovationCosts
        },
        sellingCosts: {
          scenario1: this.scenarios[1].sellingCosts.totalSellingCosts,
          scenario2: this.scenarios[2].sellingCosts.totalSellingCosts,
          scenario3: this.scenarios[3].sellingCosts.totalSellingCosts
        },
        holdingCosts: {
          scenario1: this.scenarios[1].holdingCosts.totalHoldingCosts,
          scenario2: this.scenarios[2].holdingCosts.totalHoldingCosts,
          scenario3: this.scenarios[3].holdingCosts.totalHoldingCosts
        }
      },
      revenues: {
        expectedSalePrice: {
          scenario1: this.scenarios[1].revenues.expectedSalePrice,
          scenario2: this.scenarios[2].revenues.expectedSalePrice,
          scenario3: this.scenarios[3].revenues.expectedSalePrice
        },
        totalRevenues: {
          scenario1: this.scenarios[1].revenues.totalRevenues,
          scenario2: this.scenarios[2].revenues.totalRevenues,
          scenario3: this.scenarios[3].revenues.totalRevenues
        }
      },
      financing: {
        downPayment: {
          scenario1: this.scenarios[1].propertyFinancing.downPayment,
          scenario2: this.scenarios[2].propertyFinancing.downPayment,
          scenario3: this.scenarios[3].propertyFinancing.downPayment
        },
        totalInterestPaid: {
          scenario1: this.scenarios[1].propertyFinancing.totalInterestPaid + this.scenarios[1].renovationFinancing.totalInterestPaidRenovation,
          scenario2: this.scenarios[2].propertyFinancing.totalInterestPaid + this.scenarios[2].renovationFinancing.totalInterestPaidRenovation,
          scenario3: this.scenarios[3].propertyFinancing.totalInterestPaid + this.scenarios[3].renovationFinancing.totalInterestPaidRenovation
        }
      }
    };
    
    // Déterminer le meilleur scénario basé sur le ROI annualisé
    const annualizedRois = [
      { scenario: 1, value: this.scenarios[1].profitabilityAnalysis.annualizedRoi },
      { scenario: 2, value: this.scenarios[2].profitabilityAnalysis.annualizedRoi },
      { scenario: 3, value: this.scenarios[3].profitabilityAnalysis.annualizedRoi }
    ];
    
    const bestScenario = annualizedRois.sort((a, b) => b.value - a.value)[0].scenario;
    
    return {
      scenario1: this.scenarios[1],
      scenario2: this.scenarios[2],
      scenario3: this.scenarios[3],
      comparison,
      bestScenario
    };
  }
}

module.exports = FlipDetailedCalculator;
