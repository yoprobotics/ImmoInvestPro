/**
 * Modèle de données pour les calculs détaillés de FLIP
 * Basé sur le calculateur FLIP 3.0
 */

const FlipDetailedModel = {
  // Actions possibles sur l'immeuble
  actions: {
    flipPlan: "", // Stratégie d'optimisation
    acquisitionDate: "", // Date d'acquisition
    expectedSaleDate: "", // Date de vente prévue
    holdingPeriodMonths: 0, // Période de détention en mois
  },

  // Informations générales sur l'immeuble
  generalInfo: {
    address: "", // Adresse de l'immeuble
    city: "", // Ville
    province: "", // Province
    postalCode: "", // Code postal
    propertyType: "", // Type de propriété (Maison, Condo, Plex, etc.)
    yearBuilt: 0, // Année de construction
    lotSize: 0, // Taille du terrain (pi²)
    buildingSize: 0, // Taille du bâtiment (pi²)
    numberOfBedrooms: 0, // Nombre de chambres
    numberOfBathrooms: 0, // Nombre de salles de bain
    parkingSpaces: 0, // Nombre de places de stationnement
    description: "", // Description de l'immeuble
  },

  // Frais d'acquisition
  acquisitionCosts: {
    purchasePrice: 0, // Prix d'achat
    transferTax: 0, // Droits de mutation (taxe de bienvenue)
    legalFees: 0, // Frais juridiques
    inspectionFees: 0, // Frais d'inspection
    appraisalFees: 0, // Frais d'évaluation
    mortgageInsurance: 0, // Assurance prêt hypothécaire
    mortgageSetupFees: 0, // Frais de mise en place du prêt
    otherAcquisitionFees: 0, // Autres frais d'acquisition
    totalAcquisitionCosts: 0, // Total des frais d'acquisition
  },

  // Frais de FLIP/Rénovation
  renovationCosts: {
    kitchen: 0, // Cuisine
    bathroom: 0, // Salle de bain
    flooring: 0, // Planchers
    painting: 0, // Peinture
    windows: 0, // Fenêtres
    doors: 0, // Portes
    roofing: 0, // Toiture
    electrical: 0, // Électricité
    plumbing: 0, // Plomberie
    hvac: 0, // Chauffage, ventilation, climatisation
    foundation: 0, // Fondation
    exterior: 0, // Extérieur
    landscape: 0, // Aménagement paysager
    permits: 0, // Permis
    laborCosts: 0, // Coûts de main-d'œuvre
    materials: 0, // Matériaux
    contingency: 0, // Contingence (généralement 10-20% du budget de rénovation)
    otherRenovationCosts: 0, // Autres frais de rénovation
    totalRenovationCosts: 0, // Total des frais de rénovation
  },

  // Frais de vente
  sellingCosts: {
    realEstateCommission: 0, // Commission du courtier immobilier
    legalFeesForSale: 0, // Frais juridiques pour la vente
    marketingCosts: 0, // Coûts de marketing
    stagingCosts: 0, // Coûts de mise en valeur
    prepaymentPenalty: 0, // Pénalité de remboursement anticipé
    otherSellingCosts: 0, // Autres frais de vente
    totalSellingCosts: 0, // Total des frais de vente
  },

  // Revenus
  revenues: {
    expectedSalePrice: 0, // Prix de vente attendu
    rentalIncome: 0, // Revenus locatifs pendant la détention
    otherRevenues: 0, // Autres revenus
    totalRevenues: 0, // Total des revenus
  },

  // Frais de détention
  holdingCosts: {
    propertyTaxes: 0, // Taxes foncières
    insurance: 0, // Assurance
    utilities: 0, // Services publics (électricité, eau, gaz)
    maintenance: 0, // Entretien
    otherHoldingCosts: 0, // Autres frais de détention
    totalHoldingCosts: 0, // Total des frais de détention
  },

  // Frais de maintenance
  maintenanceCosts: {
    repairs: 0, // Réparations
    cleaning: 0, // Nettoyage
    landscaping: 0, // Entretien paysager
    snowRemoval: 0, // Déneigement
    otherMaintenanceCosts: 0, // Autres frais de maintenance
    totalMaintenanceCosts: 0, // Total des frais de maintenance
  },

  // Financement de l'immeuble
  propertyFinancing: {
    downPayment: 0, // Mise de fonds
    downPaymentPercentage: 0, // Pourcentage de mise de fonds
    firstMortgageAmount: 0, // Montant du premier prêt hypothécaire
    firstMortgageRate: 0, // Taux du premier prêt hypothécaire
    firstMortgageTerm: 0, // Terme du premier prêt hypothécaire (années)
    firstMortgageAmortization: 0, // Amortissement du premier prêt hypothécaire (années)
    secondMortgageAmount: 0, // Montant du deuxième prêt hypothécaire
    secondMortgageRate: 0, // Taux du deuxième prêt hypothécaire
    secondMortgageTerm: 0, // Terme du deuxième prêt hypothécaire (années)
    secondMortgageAmortization: 0, // Amortissement du deuxième prêt hypothécaire (années)
    privateLoanAmount: 0, // Montant du prêt privé
    privateLoanRate: 0, // Taux du prêt privé
    privateLoanTerm: 0, // Terme du prêt privé (années)
    vendorTakeBackAmount: 0, // Montant de la balance de vente
    vendorTakeBackRate: 0, // Taux de la balance de vente
    vendorTakeBackTerm: 0, // Terme de la balance de vente (années)
    monthlyPaymentFirstMortgage: 0, // Paiement mensuel du premier prêt hypothécaire
    monthlyPaymentSecondMortgage: 0, // Paiement mensuel du deuxième prêt hypothécaire
    monthlyPaymentPrivateLoan: 0, // Paiement mensuel du prêt privé
    monthlyPaymentVendorTakeBack: 0, // Paiement mensuel de la balance de vente
    totalMonthlyPayment: 0, // Total des paiements mensuels
    totalInterestPaid: 0, // Total des intérêts payés
  },

  // Financement des rénovations
  renovationFinancing: {
    personalFunds: 0, // Fonds personnels
    creditLineAmount: 0, // Montant de la marge de crédit
    creditLineRate: 0, // Taux de la marge de crédit
    renovationLoanAmount: 0, // Montant du prêt de rénovation
    renovationLoanRate: 0, // Taux du prêt de rénovation
    renovationLoanTerm: 0, // Terme du prêt de rénovation (mois)
    monthlyPaymentCreditLine: 0, // Paiement mensuel de la marge de crédit
    monthlyPaymentRenovationLoan: 0, // Paiement mensuel du prêt de rénovation
    totalMonthlyPaymentRenovation: 0, // Total des paiements mensuels pour rénovation
    totalInterestPaidRenovation: 0, // Total des intérêts payés sur rénovation
  },

  // Analyse de rentabilité
  profitabilityAnalysis: {
    acquisitionCost: 0, // Coût d'acquisition
    renovationCost: 0, // Coût de rénovation
    totalInvestment: 0, // Investissement total
    totalRevenue: 0, // Revenu total
    grossProfit: 0, // Profit brut
    holdingCosts: 0, // Coûts de détention
    sellingCosts: 0, // Coûts de vente
    financingCosts: 0, // Coûts de financement
    netProfit: 0, // Profit net
    roi: 0, // Retour sur investissement (%)
    annualizedRoi: 0, // ROI annualisé (%)
    cashOnCash: 0, // Rendement sur fonds propres (%)
    totalCashInvested: 0, // Total des liquidités investies
  }
};

module.exports = FlipDetailedModel;
