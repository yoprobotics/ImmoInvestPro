/**
 * Tests unitaires pour le service FlipCalculatorService
 */

import { FlipCalculatorService } from '../FlipCalculatorService';
import { FlipCalculatorModel } from '../../models/FlipCalculatorModel';

describe('FlipCalculatorService', () => {
  let service;
  let calculator;
  
  beforeEach(() => {
    service = new FlipCalculatorService();
    calculator = service.createNewCalculator();
  });
  
  test('createNewCalculator() should return a new FlipCalculatorModel instance', () => {
    expect(calculator).toBeInstanceOf(FlipCalculatorModel);
  });
  
  test('calculateWelcomeTax() should calculate welcome tax correctly', () => {
    // Test pour différentes tranches de prix
    expect(service.calculateWelcomeTax(50000)).toBeCloseTo(250);
    expect(service.calculateWelcomeTax(100000)).toBeCloseTo(51700 * 0.005 + (100000 - 51700) * 0.01);
    expect(service.calculateWelcomeTax(300000)).toBeCloseTo(51700 * 0.005 + (258600 - 51700) * 0.01 + (300000 - 258600) * 0.015);
  });
  
  test('estimateNotaryFees() should estimate notary fees based on purchase price', () => {
    expect(service.estimateNotaryFees(200000)).toBeGreaterThan(1000);
    expect(service.estimateNotaryFees(200000)).toBeLessThanOrEqual(2500);
    
    // Test si le montant augmente avec le prix d'achat
    const feesLow = service.estimateNotaryFees(200000);
    const feesHigh = service.estimateNotaryFees(500000);
    expect(feesHigh).toBeGreaterThan(feesLow);
  });
  
  test('calculateMortgagePayment() should calculate monthly mortgage payment correctly', () => {
    // Cas de test avec intérêt
    const payment = service.calculateMortgagePayment(200000, 5, 25);
    
    // Validation approximative (le montant exact dépend de la formule de calcul)
    // On vérifie que le paiement mensuel est dans une plage raisonnable
    expect(payment).toBeGreaterThan(1000);
    expect(payment).toBeLessThan(1500);
    
    // Cas de test avec 0% d'intérêt (cas particulier)
    const paymentNoInterest = service.calculateMortgagePayment(200000, 0, 25);
    expect(paymentNoInterest).toBeCloseTo(200000 / (25 * 12));
  });
  
  test('calculateTotalInterest() should calculate total interest over project duration', () => {
    const totalInterest = service.calculateTotalInterest(200000, 5, 6);
    
    // Validation approximative
    // Pour un prêt de 200 000$ à 5% sur 6 mois, les intérêts sont typiquement entre 4000$ et 5000$
    expect(totalInterest).toBeGreaterThan(4000);
    expect(totalInterest).toBeLessThan(5500);
  });
  
  test('updateAcquisitionCosts() should update acquisition costs based on purchase price', () => {
    // Configuration initiale
    calculator.propertyInfo.purchasePrice = 300000;
    
    // Mise à jour des frais d'acquisition
    service.updateAcquisitionCosts(calculator);
    
    // Vérification que les frais ont été mis à jour
    expect(calculator.acquisitionCosts.welcomeTax).toBeGreaterThan(0);
    expect(calculator.acquisitionCosts.notaryFees).toBeGreaterThan(0);
    
    // Vérification que le total calculé est correct
    const totalCosts = calculator.calculateTotalAcquisitionCosts();
    expect(totalCosts).toBe(
      300000 + 
      calculator.acquisitionCosts.welcomeTax +
      calculator.acquisitionCosts.notaryFees + 
      calculator.acquisitionCosts.inspectionFees +
      calculator.acquisitionCosts.evaluationFees +
      calculator.acquisitionCosts.legalFees +
      calculator.acquisitionCosts.otherAcquisitionCosts
    );
  });
  
  test('updateFinancingInfo() should update financing information', () => {
    // Configuration initiale
    calculator.propertyInfo.purchasePrice = 300000;
    calculator.propertyInfo.projectDuration = 6;
    calculator.financing.downPayment = 60000; // 20%
    calculator.financing.interestRate = 5;
    calculator.financing.amortization = 25;
    
    // Mise à jour des informations de financement
    service.updateFinancingInfo(calculator);
    
    // Vérification que les informations ont été mises à jour
    expect(calculator.financing.mortgageAmount).toBe(240000); // 300000 - 60000
    expect(calculator.financing.monthlyPayment).toBeGreaterThan(0);
    expect(calculator.financing.totalInterestPaid).toBeGreaterThan(0);
    
    // Vérification que les frais de possession ont été mis à jour
    expect(calculator.holdingCosts.mortgage).toBe(calculator.financing.monthlyPayment);
  });
  
  test('calculateNapkinOfferPrice() should calculate optimal offer price', () => {
    const offerPrice = service.calculateNapkinOfferPrice(400000, 50000, 30000);
    
    // 400000 - 50000 - (400000 * 0.1) - 30000 = 400000 - 50000 - 40000 - 30000 = 280000
    expect(offerPrice).toBe(280000);
    
    // Si le montant calculé est négatif, la valeur doit être 0
    const negativeCaseOfferPrice = service.calculateNapkinOfferPrice(100000, 150000, 30000);
    expect(negativeCaseOfferPrice).toBe(0);
  });
  
  test('checkNapkinViability() should correctly assess project viability', () => {
    // Cas viable
    const viableCase = service.checkNapkinViability(400000, 300000, 30000);
    // 400000 - 300000 - 30000 - (400000 * 0.1) = 400000 - 300000 - 30000 - 40000 = 30000
    expect(viableCase.isViable).toBe(true);
    expect(viableCase.estimatedProfit).toBe(30000);
    expect(viableCase.profitGap).toBe(5000);
    
    // Cas non viable
    const nonViableCase = service.checkNapkinViability(400000, 320000, 40000);
    // 400000 - 320000 - 40000 - (400000 * 0.1) = 400000 - 320000 - 40000 - 40000 = 0
    expect(nonViableCase.isViable).toBe(false);
    expect(nonViableCase.estimatedProfit).toBe(0);
    expect(nonViableCase.profitGap).toBe(-25000);
  });
  
  test('calculateAllResults() should calculate all results correctly', () => {
    // Configuration initiale
    calculator.propertyInfo.purchasePrice = 300000;
    calculator.propertyInfo.estimatedResaleValue = 400000;
    calculator.propertyInfo.projectDuration = 6;
    
    calculator.financing.downPayment = 60000;
    calculator.financing.interestRate = 5;
    calculator.financing.amortization = 25;
    
    calculator.renovationBudget.kitchen.cabinets = 10000;
    calculator.renovationBudget.kitchen.countertops = 5000;
    calculator.renovationBudget.bathroom.vanity = 2000;
    calculator.renovationBudget.bathroom.shower = 4000;
    calculator.renovationBudget.exterior.windows = 8000;
    calculator.renovationBudget.contingency = 5000;
    
    calculator.sellingCosts.realEstateCommission = 20000; // 5% of 400,000
    
    // Calcul des résultats
    const results = service.calculateAllResults(calculator);
    
    // Vérification des résultats
    expect(results.totalPurchasePrice).toBeGreaterThan(calculator.propertyInfo.purchasePrice);
    expect(results.totalRenovationCosts).toBe(10000 + 5000 + 2000 + 4000 + 8000 + 5000);
    expect(results.totalHoldingCosts).toBeGreaterThan(0);
    expect(results.totalSellingCosts).toBe(20000);
    
    expect(results.grossProfit).toBe(100000); // 400000 - 300000
    expect(results.netProfit).toBeGreaterThan(0);
    expect(results.returnOnInvestment).toBeGreaterThan(0);
    
    // Vérification de la viabilité
    expect(calculator.isViable()).toBe(true); // Profit > 25000
  });
});
