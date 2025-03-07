// Liquidity calculator for real estate investments

/**
 * Calculates the liquidity (cashflow) for a multi-unit property
 * This calculator helps determine if a property can generate the target cashflow per door (typically 75$/door/month)
 * @param {Object} propertyData Object containing the property financial data
 * @param {number} propertyData.purchasePrice Purchase price of the property
 * @param {number} propertyData.grossIncome Annual gross income of the property
 * @param {number} propertyData.unitCount Number of units in the property
 * @param {number} [propertyData.operatingExpenses] Annual operating expenses (if not provided, will be estimated)
 * @param {number} [propertyData.financing] Annual financing cost (if not provided, will be calculated using HIGH-5 method)
 * @param {Object} [options] Additional calculation options
 * @param {boolean} [options.useDetailedCalculation=false] Whether to use detailed calculation methods
 * @param {number} [options.interestRate=0.05] Annual interest rate for mortgage
 * @param {number} [options.amortizationYears=25] Amortization period in years
 * @param {number} [options.downPaymentPercentage=0.2] Down payment as percentage of purchase price
 * @param {Object} [options.creativeFinancing] Creative financing details
 * @returns {Object} Calculated liquidity metrics
 */
function calculateLiquidity(propertyData, options = {}) {
    // Extract required data from propertyData
    const { 
        purchasePrice, 
        grossIncome, 
        unitCount, 
        operatingExpenses = null,
        financing = null
    } = propertyData;
    
    // Extract options
    const {
        useDetailedCalculation = false,
        interestRate = 0.05,
        amortizationYears = 25,
        downPaymentPercentage = 0.2,
        creativeFinancing = null
    } = options;

    // Calculate operating expenses if not provided
    let calculatedOperatingExpenses;
    if (operatingExpenses === null) {
        // Estimate operating expenses based on unit count according to "Secrets de l'immobilier" method
        if (unitCount <= 2) {
            calculatedOperatingExpenses = 0.3 * grossIncome; // 30% for 1-2 units
        } else if (unitCount <= 4) {
            calculatedOperatingExpenses = 0.35 * grossIncome; // 35% for 3-4 units
        } else if (unitCount <= 6) {
            calculatedOperatingExpenses = 0.45 * grossIncome; // 45% for 5-6 units
        } else {
            calculatedOperatingExpenses = 0.5 * grossIncome; // 50% for 7+ units
        }
    } else {
        calculatedOperatingExpenses = operatingExpenses;
    }

    // Calculate Net Operating Income (NOI)
    const netOperatingIncome = grossIncome - calculatedOperatingExpenses;

    // Calculate financing payments
    let calculatedFinancing;
    let financingDetails = {};
    
    if (financing === null) {
        // Use HIGH-5 method as taught in "Secrets de l'immobilier"
        calculatedFinancing = purchasePrice * 0.005 * 12;
        financingDetails.high5Estimate = calculatedFinancing;
        
        // If detailed calculation is requested, provide more accurate numbers
        if (useDetailedCalculation) {
            const downPayment = purchasePrice * downPaymentPercentage;
            const loanAmount = purchasePrice - downPayment;
            const monthlyRate = interestRate / 12;
            const numPayments = amortizationYears * 12;
            
            // Monthly payment formula: P = L[i(1+i)^n]/[(1+i)^n - 1]
            const accurateMonthlyPayment = loanAmount * 
                (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                (Math.pow(1 + monthlyRate, numPayments) - 1);
            
            let totalFinancing = accurateMonthlyPayment * 12;
            financingDetails.conventionalMortgage = totalFinancing;
            
            // Add creative financing if provided
            if (creativeFinancing) {
                const { amount, rate = 0.08, term = 5 } = creativeFinancing;
                const monthlyCreativeRate = rate / 12;
                const creativePayments = term * 12;
                
                const creativeMonthlyPayment = amount * 
                    (monthlyCreativeRate * Math.pow(1 + monthlyCreativeRate, creativePayments)) / 
                    (Math.pow(1 + monthlyCreativeRate, creativePayments) - 1);
                    
                const creativeAnnualPayment = creativeMonthlyPayment * 12;
                totalFinancing += creativeAnnualPayment;
                financingDetails.creativeFinancing = creativeAnnualPayment;
            }
            
            // Use the more accurate calculation
            calculatedFinancing = totalFinancing;
        }
    } else {
        calculatedFinancing = financing;
    }

    // Calculate cashflow
    const cashflow = netOperatingIncome - calculatedFinancing;
    
    // Calculate cashflow per door per month
    const cashflowPerDoorMonthly = unitCount > 0 ? cashflow / unitCount / 12 : 0;

    // Calculate cap rate
    const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
    
    // Calculate gross rent multiplier (GRM)
    const grm = grossIncome > 0 ? purchasePrice / grossIncome : 0;

    // Determine if the property meets the target cashflow (typically 75$/door/month)
    const targetCashflow = 75; // Standard target from "Secrets de l'immobilier"
    const meetsTargetCashflow = cashflowPerDoorMonthly >= targetCashflow;

    // Return the calculated values
    return {
        grossIncome,
        operatingExpenses: calculatedOperatingExpenses,
        netOperatingIncome,
        financing: calculatedFinancing,
        cashflow,
        cashflowPerDoor: cashflowPerDoorMonthly,
        capRate,
        grm,
        meetsTargetCashflow,
        financingDetails: useDetailedCalculation ? financingDetails : undefined
    };
}

/**
 * Calculates the maximum purchase price for a target cashflow per door
 * @param {Object} targetData Target data for calculation
 * @param {number} targetData.grossIncome Annual gross income
 * @param {number} targetData.unitCount Number of units
 * @param {number} targetData.targetCashflowPerDoor Target monthly cashflow per door (default: 75)
 * @param {Object} [options] Additional calculation options (same as in calculateLiquidity)
 * @returns {number} Maximum purchase price to achieve target cashflow
 */
function calculateMaxPurchasePrice(targetData, options = {}) {
    const {
        grossIncome,
        unitCount,
        targetCashflowPerDoor = 75
    } = targetData;

    // Calculate target annual cashflow
    const targetAnnualCashflow = targetCashflowPerDoor * unitCount * 12;
    
    // Estimate operating expenses
    let expensePercentage;
    if (unitCount <= 2) {
        expensePercentage = 0.3;
    } else if (unitCount <= 4) {
        expensePercentage = 0.35;
    } else if (unitCount <= 6) {
        expensePercentage = 0.45;
    } else {
        expensePercentage = 0.5;
    }
    
    const operatingExpenses = grossIncome * expensePercentage;
    
    // Calculate NOI
    const noi = grossIncome - operatingExpenses;
    
    // Calculate maximum financing amount
    const maxFinancing = noi - targetAnnualCashflow;
    
    // Using HIGH-5 method in reverse to get maximum purchase price
    // If maxFinancing = purchasePrice * 0.005 * 12
    // Then purchasePrice = maxFinancing / (0.005 * 12)
    const maxPurchasePrice = maxFinancing / 0.06; // 0.005 * 12 = 0.06
    
    return Math.max(0, maxPurchasePrice); // Ensure non-negative value
}

// Export the calculator functions
module.exports = {
    calculateLiquidity,
    calculateMaxPurchasePrice
};