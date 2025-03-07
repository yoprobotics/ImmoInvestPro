const express = require('express');
const router = express.Router();
const MultiDetailedCalculator = require('../calculators/MultiDetailedCalculator');
const FlipDetailedCalculator = require('../calculators/FlipDetailedCalculator');

/**
 * @route POST /api/calculators/multi-detailed
 * @desc Calculate detailed metrics for MULTI investments with multiple scenarios
 * @access Public
 */
router.post('/multi-detailed', (req, res) => {
  try {
    const { scenario1, scenario2, scenario3 } = req.body;
    
    // Initialize calculator with first scenario
    const calculator = new MultiDetailedCalculator(scenario1);
    
    // Update scenarios 2 and 3
    calculator.setScenario(2).updateCurrentScenario(scenario2);
    calculator.setScenario(3).updateCurrentScenario(scenario3);
    
    // Compare all scenarios
    const results = calculator.compareScenarios();
    
    res.json(results);
  } catch (error) {
    console.error('Error calculating multi detailed metrics:', error);
    res.status(500).json({ message: 'Error calculating multi detailed metrics', error: error.message });
  }
});

/**
 * @route POST /api/calculators/flip-detailed
 * @desc Calculate detailed metrics for FLIP investments with multiple scenarios
 * @access Public
 */
router.post('/flip-detailed', (req, res) => {
  try {
    const { scenario1, scenario2, scenario3 } = req.body;
    
    // Initialize calculator with first scenario
    const calculator = new FlipDetailedCalculator(scenario1);
    
    // Update scenarios 2 and 3
    calculator.setScenario(2).updateCurrentScenario(scenario2);
    calculator.setScenario(3).updateCurrentScenario(scenario3);
    
    // Compare all scenarios
    const results = calculator.compareScenarios();
    
    res.json(results);
  } catch (error) {
    console.error('Error calculating flip detailed metrics:', error);
    res.status(500).json({ message: 'Error calculating flip detailed metrics', error: error.message });
  }
});

/**
 * @route POST /api/calculators/multi-napkin
 * @desc Calculate quick napkin metrics for MULTI investments
 * @access Public
 */
router.post('/multi-napkin', (req, res) => {
  try {
    const { price, apartments, revenues } = req.body;
    
    // Simplified PAR calculation
    // Determine expenses percentage based on number of apartments
    let expensesPercentage = 0.5; // default for 7+ units
    if (apartments <= 2) {
      expensesPercentage = 0.3;
    } else if (apartments <= 4) {
      expensesPercentage = 0.35;
    } else if (apartments <= 6) {
      expensesPercentage = 0.45;
    }
    
    // Calculate RNO (Revenues - expenses)
    const rno = revenues - (revenues * expensesPercentage);
    
    // Calculate financing using HIGH-5 method (0.5% of price * 12 months)
    const financing = price * 0.005 * 12;
    
    // Calculate cashflow
    const cashflow = rno - financing;
    
    // Calculate cashflow per door per month
    const cashflowPerDoor = cashflow / apartments / 12;
    
    // Determine if this is a good deal (>= $75/door/month)
    const isGoodDeal = cashflowPerDoor >= 75;
    
    // Calculate maximum purchase price for $75/door/month
    const targetCashflow = 75 * apartments * 12;
    const maxFinancing = rno - targetCashflow;
    const maxPrice = (maxFinancing / 12) / 0.005;
    
    const results = {
      price,
      apartments,
      revenues,
      expenses: revenues * expensesPercentage,
      expensesPercentage,
      rno,
      financing,
      cashflow,
      cashflowPerDoor,
      isGoodDeal,
      targetCashflow,
      maxPrice
    };
    
    res.json(results);
  } catch (error) {
    console.error('Error calculating multi napkin metrics:', error);
    res.status(500).json({ message: 'Error calculating multi napkin metrics', error: error.message });
  }
});

/**
 * @route POST /api/calculators/flip-napkin
 * @desc Calculate quick napkin metrics for FLIP investments
 * @access Public
 */
router.post('/flip-napkin', (req, res) => {
  try {
    const { finalPrice, initialPrice, renovationPrice } = req.body;
    
    // FIP10 calculation
    const overhead = finalPrice * 0.1; // 10% of final price for all costs
    const profit = finalPrice - initialPrice - renovationPrice - overhead;
    
    // Calculate ROI
    const investment = initialPrice + renovationPrice;
    const roi = (profit / investment) * 100;
    
    // Determine if this is a good deal (>= $25,000 profit)
    const isGoodDeal = profit >= 25000;
    
    // Calculate maximum purchase price for $25,000 profit
    const targetProfit = 25000;
    const maxPrice = finalPrice - renovationPrice - overhead - targetProfit;
    
    const results = {
      finalPrice,
      initialPrice,
      renovationPrice,
      overhead,
      profit,
      roi,
      isGoodDeal,
      targetProfit,
      maxPrice
    };
    
    res.json(results);
  } catch (error) {
    console.error('Error calculating flip napkin metrics:', error);
    res.status(500).json({ message: 'Error calculating flip napkin metrics', error: error.message });
  }
});

module.exports = router;
