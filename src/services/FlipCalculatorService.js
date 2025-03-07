/**
 * Service de calcul pour le calculateur de rendement FLIP 3.0
 * Implémente les formules et logiques de calcul selon la méthodologie "Les Secrets de l'Immobilier"
 */

import { FlipCalculatorModel } from '../models/FlipCalculatorModel';

/**
 * Service gérant les calculs du calculateur FLIP
 */
export class FlipCalculatorService {
  /**
   * Initialise un nouveau calculateur FLIP
   * @returns {FlipCalculatorModel} Un nouveau modèle de calculateur FLIP
   */
  createNewCalculator() {
    return new FlipCalculatorModel();
  }

  /**
   * Calcule les frais de bienvenue (taxe de mutation) selon les barèmes québécois
   * @param {number} purchasePrice - Prix d'achat de la propriété
   * @returns {number} Montant de la taxe de bienvenue
   */
  calculateWelcomeTax(purchasePrice) {
    // Barèmes 2023 pour le Québec (à ajuster selon les régions et années)
    let tax = 0;
    
    if (purchasePrice <= 51700) {
      tax = purchasePrice * 0.005;
    } else if (purchasePrice <= 258600) {
      tax = 51700 * 0.005 + (purchasePrice - 51700) * 0.01;
    } else {
      tax = 51700 * 0.005 + (258600 - 51700) * 0.01 + (purchasePrice - 258600) * 0.015;
    }
    
    return Math.round(tax * 100) / 100; // Arrondi à 2 décimales
  }

  /**
   * Effectue une estimation des frais de notaire
   * @param {number} purchasePrice - Prix d'achat
   * @returns {number} Estimation des frais de notaire
   */
  estimateNotaryFees(purchasePrice) {
    // Estimation simple basée sur un pourcentage du prix d'achat
    // Typiquement entre 1000$ et 2000$ selon la complexité
    const basePrice = 1000;
    const variablePart = purchasePrice * 0.0015; // 0.15% du prix d'achat
    
    return Math.min(Math.max(basePrice + variablePart, 1000), 2500);
  }

  /**
   * Calcule les paiements hypothécaires mensuels
   * @param {number} principal - Montant du prêt
   * @param {number} annualRate - Taux d'intérêt annuel (pourcentage)
   * @param {number} amortizationYears - Période d'amortissement en années
   * @returns {number} Paiement mensuel
   */
  calculateMortgagePayment(principal, annualRate, amortizationYears) {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = amortizationYears * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return Math.round(monthlyPayment * 100) / 100;
  }

  /**
   * Calcule le total des intérêts payés pendant la période du projet
   * @param {number} principal - Montant du prêt
   * @param {number} annualRate - Taux d'intérêt annuel (pourcentage)
   * @param {number} projectDurationMonths - Durée du projet en mois
   * @returns {number} Total des intérêts payés
   */
  calculateTotalInterest(principal, annualRate, projectDurationMonths) {
    const monthlyRate = annualRate / 100 / 12;
    let balance = principal;
    let totalInterest = 0;
    
    // Calcul du paiement mensuel (supposant un amortissement de 25 ans standard)
    const monthlyPayment = this.calculateMortgagePayment(principal, annualRate, 25);
    
    // Calcul des intérêts pour chaque mois du projet
    for (let month = 0; month < projectDurationMonths; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      totalInterest += interestPayment;
      balance -= principalPayment;
      
      if (balance <= 0) break;
    }
    
    return Math.round(totalInterest * 100) / 100;
  }

  /**
   * Calcule le coût de peinture en fonction de la superficie
   * @param {number} squareFeet - Superficie en pieds carrés
   * @returns {object} Coûts estimés pour peinture et main d'œuvre
   */
  estimatePaintingCost(squareFeet) {
    // Estimation basée sur des coûts moyens au Québec
    const paintPerGallon = 250; // Pieds carrés couverts par gallon
    const gallonsNeeded = Math.ceil(squareFeet / paintPerGallon);
    
    const materialCost = gallonsNeeded * 50; // 50$ par gallon en moyenne
    const laborCost = squareFeet * 2; // 2$ par pied carré pour la main d'œuvre
    
    return {
      materials: materialCost,
      labor: laborCost,
      total: materialCost + laborCost
    };
  }

  /**
   * Calcule le coût de la céramique en fonction de la superficie
   * @param {number} squareFeet - Superficie en pieds carrés
   * @returns {object} Coûts estimés pour matériaux et installation
   */
  estimateTileCost(squareFeet) {
    // Estimation basée sur des coûts moyens au Québec
    const tilePerSquareFoot = 4; // 4$ par pied carré pour la céramique moyenne
    const materialCost = squareFeet * tilePerSquareFoot;
    
    const laborCost = squareFeet * 8; // 8$ par pied carré pour l'installation
    
    return {
      materials: materialCost,
      labor: laborCost,
      total: materialCost + laborCost
    };
  }

  /**
   * Calcule le total des frais d'acquisition
   * @param {FlipCalculatorModel} calculator - Instance du calculateur
   * @returns {number} Total des frais d'acquisition
   */
  updateAcquisitionCosts(calculator) {
    // Mise à jour automatique des frais selon le prix d'achat
    calculator.acquisitionCosts.welcomeTax = this.calculateWelcomeTax(calculator.propertyInfo.purchasePrice);
    calculator.acquisitionCosts.notaryFees = this.estimateNotaryFees(calculator.propertyInfo.purchasePrice);
    
    return calculator.calculateTotalAcquisitionCosts();
  }

  /**
   * Met à jour les informations de financement
   * @param {FlipCalculatorModel} calculator - Instance du calculateur
   * @returns {object} Informations de financement mises à jour
   */
  updateFinancingInfo(calculator) {
    const { purchasePrice } = calculator.propertyInfo;
    const { downPayment, interestRate, amortization } = calculator.financing;
    
    // Calcul du montant du prêt
    calculator.financing.mortgageAmount = purchasePrice - downPayment;
    
    // Calcul du paiement mensuel
    calculator.financing.monthlyPayment = this.calculateMortgagePayment(
      calculator.financing.mortgageAmount,
      interestRate,
      amortization
    );
    
    // Calcul des intérêts totaux pendant la durée du projet
    calculator.financing.totalInterestPaid = this.calculateTotalInterest(
      calculator.financing.mortgageAmount,
      interestRate,
      calculator.propertyInfo.projectDuration
    );
    
    // Mise à jour des frais de possession liés au financement
    calculator.holdingCosts.mortgage = calculator.financing.monthlyPayment;
    
    return calculator.financing;
  }

  /**
   * Calcule le prix d'offre optimal selon la méthode napkin FIP10
   * @param {number} resaleValue - Valeur de revente estimée
   * @param {number} renovationCost - Coût des rénovations
   * @param {number} targetProfit - Profit cible (par défaut 25000$)
   * @returns {number} Prix d'offre optimal
   */
  calculateNapkinOfferPrice(resaleValue, renovationCost, targetProfit = 25000) {
    // Méthode FIP10: Formule rapide pour calculer un prix d'offre
    // Valeur de revente - Rénovations - 10% de la valeur de revente - Profit visé
    const offerPrice = resaleValue - renovationCost - (resaleValue * 0.1) - targetProfit;
    return Math.max(0, offerPrice);
  }

  /**
   * Vérifie si un projet FLIP est viable selon la méthode napkin
   * @param {number} resaleValue - Valeur de revente estimée
   * @param {number} purchasePrice - Prix d'achat
   * @param {number} renovationCost - Coût des rénovations
   * @returns {object} Résultat de l'analyse et profit estimé
   */
  checkNapkinViability(resaleValue, purchasePrice, renovationCost) {
    // Méthode FIP10: Formule rapide pour évaluer la viabilité
    // Profit = Valeur de revente - Prix d'achat - Rénovations - 10% de la valeur de revente
    const estimatedProfit = resaleValue - purchasePrice - renovationCost - (resaleValue * 0.1);
    const isViable = estimatedProfit >= 25000; // Seuil minimum recommandé: 25 000$
    
    return {
      isViable,
      estimatedProfit,
      profitTarget: 25000,
      profitGap: estimatedProfit - 25000
    };
  }

  /**
   * Calcule tous les résultats du calculateur
   * @param {FlipCalculatorModel} calculator - Instance du calculateur
   * @returns {object} Résultats calculés
   */
  calculateAllResults(calculator) {
    // Mise à jour des frais d'acquisition
    this.updateAcquisitionCosts(calculator);
    
    // Mise à jour des informations de financement
    this.updateFinancingInfo(calculator);
    
    // Calcul de tous les résultats
    return calculator.calculateResults();
  }
}

export default FlipCalculatorService;
