const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Modèle de données MongoDB pour le calculateur FLIP 3.0
 * Stocke les données d'entrée, résultats et scénarios
 */
const FlipCalculatorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  inputData: {
    generalInfo: {
      propertyAddress: { type: String, required: true },
      propertyCity: { type: String },
      propertyState: { type: String },
      propertyZip: { type: String },
      purchaseDate: { type: Date },
      expectedSaleDate: { type: Date },
      scenarioName: { type: String, default: 'Scénario 1' }
    },
    acquisitionCosts: {
      purchasePrice: { type: Number, default: 0 },
      closingCosts: { type: Number, default: 0 },
      transferTax: { type: Number, default: 0 },
      inspectionCost: { type: Number, default: 0 },
      otherAcquisitionCosts: { type: Number, default: 0 }
    },
    renovationCosts: {
      kitchenRenovation: { type: Number, default: 0 },
      bathroomRenovation: { type: Number, default: 0 },
      flooringCosts: { type: Number, default: 0 },
      paintingCosts: { type: Number, default: 0 },
      exteriorWork: { type: Number, default: 0 },
      otherRenovationCosts: { type: Number, default: 0 },
      contingencyPercentage: { type: Number, default: 10 }
    },
    holdingCosts: {
      propertyTaxes: { type: Number, default: 0 },
      insurance: { type: Number, default: 0 },
      utilities: { type: Number, default: 0 },
      holdingPeriodMonths: { type: Number, default: 3 }
    },
    sellingCosts: {
      realtorCommission: { type: Number, default: 5 },
      closingCosts: { type: Number, default: 0 },
      stagingCosts: { type: Number, default: 0 },
      marketingCosts: { type: Number, default: 0 }
    },
    financing: {
      acquisitionLoanAmount: { type: Number, default: 0 },
      acquisitionLoanInterestRate: { type: Number, default: 0 },
      renovationLoanAmount: { type: Number, default: 0 },
      renovationLoanInterestRate: { type: Number, default: 0 }
    },
    revenue: {
      expectedSalePrice: { type: Number, default: 0 }
    }
  },
  results: {
    totalInvestment: { type: Number },
    totalCosts: { type: Number },
    netProfit: { type: Number },
    roi: { type: Number },
    cashOnCash: { type: Number },
    annualizedROI: { type: Number },
    breakEvenPrice: { type: Number },
    breakdownByCategory: {
      acquisitionCosts: { type: Number },
      renovationCosts: { type: Number },
      holdingCosts: { type: Number },
      sellingCosts: { type: Number },
      financingCosts: { type: Number }
    }
  },
  scenarios: [{
    scenarioName: { type: String },
    inputData: {
      type: Schema.Types.Mixed
    },
    results: {
      type: Schema.Types.Mixed
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('flipCalculator', FlipCalculatorSchema);