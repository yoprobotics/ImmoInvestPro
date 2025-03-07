/**
 * Calcule la taxe de mutation (taxe de bienvenue) au Québec
 * Selon les taux en vigueur en 2023
 * @param {number} price - Prix de la propriété
 * @returns {number} Montant de la taxe de mutation
 */
export const calculateTaxMutation = (price) => {
  if (price <= 0) return 0;
  
  // Tranche 1: 0,5% sur les premiers 53 200$
  const tranche1 = Math.min(price, 53200) * 0.005;
  
  // Tranche 2: 1,0% sur la tranche entre 53 200$ et 266 200$
  const tranche2 = Math.max(0, Math.min(price, 266200) - 53200) * 0.01;
  
  // Tranche 3: 1,5% sur la tranche excédant 266 200$
  const tranche3 = Math.max(0, price - 266200) * 0.015;
  
  // Somme des trois tranches
  return tranche1 + tranche2 + tranche3;
};

/**
 * Calcule le paiement mensuel d'un prêt
 * @param {number} principal - Montant du prêt
 * @param {number} annualRate - Taux d'intérêt annuel (en pourcentage)
 * @param {number} years - Durée du prêt en années
 * @returns {number} Paiement mensuel
 */
export const calculateMortgagePayment = (principal, annualRate, years) => {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
};

/**
 * Calcule les paiements annuels d'un prêt et le remboursement du capital
 * @param {Object} loan - Informations sur le prêt
 * @param {number} years - Nombre d'années pour le calcul
 * @returns {Array} Échéancier des paiements
 */
export const calculateAmortizationSchedule = (loan, years) => {
  const schedule = [];
  let remainingBalance = loan.amount;
  const monthlyRate = loan.rate / 100 / 12;
  const monthlyPayment = calculateMortgagePayment(loan.amount, loan.rate, loan.amortization);
  
  for (let year = 1; year <= years; year++) {
    let annualPrincipal = 0;
    let annualInterest = 0;
    let annualPayment = 0;
    
    for (let month = 1; month <= 12; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      annualPrincipal += principalPayment;
      annualInterest += interestPayment;
      annualPayment += monthlyPayment;
      
      remainingBalance -= principalPayment;
      
      // Si le solde est nul ou négatif, arrêter les calculs
      if (remainingBalance <= 0) {
        remainingBalance = 0;
        break;
      }
    }
    
    schedule.push({
      year,
      payment: annualPayment,
      principal: annualPrincipal,
      interest: annualInterest,
      remainingBalance
    });
    
    // Si le solde est nul, arrêter les calculs
    if (remainingBalance <= 0) {
      break;
    }
  }
  
  // Remplir le reste du calendrier avec des zéros si nécessaire
  while (schedule.length < years) {
    const lastYear = schedule.length + 1;
    schedule.push({
      year: lastYear,
      payment: 0,
      principal: 0,
      interest: 0,
      remainingBalance: 0
    });
  }
  
  return schedule;
};

/**
 * Calcule le taux de rendement interne (TRI) pour un investissement
 * @param {Array} cashflows - Tableau des flux monétaires
 * @param {number} initialInvestment - Investissement initial (négatif)
 * @returns {number} Taux de rendement interne (en pourcentage)
 */
export const calculateIRR = (cashflows, initialInvestment) => {
  // Si tous les flux sont négatifs, le TRI n'existe pas
  if (cashflows.every(cf => cf <= 0)) return 0;
  
  // Fonction pour calculer la NPV à un taux donné
  const calculateNPV = (rate) => {
    let npv = initialInvestment;
    for (let i = 0; i < cashflows.length; i++) {
      npv += cashflows[i] / Math.pow(1 + rate, i + 1);
    }
    return npv;
  };
  
  // Recherche du TRI par la méthode de Newton-Raphson
  let guess = 0.1;  // 10% comme point de départ
  let epsilon = 0.0001;  // Précision souhaitée
  let maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(guess);
    if (Math.abs(npv) < epsilon) {
      return guess * 100;  // Convertir en pourcentage
    }
    
    // Estimer la dérivée
    const delta = 0.0001;
    const derivative = (calculateNPV(guess + delta) - npv) / delta;
    
    // Prochaine estimation
    const nextGuess = guess - npv / derivative;
    
    // Si la convergence est trop lente, abandonner
    if (Math.abs(nextGuess - guess) < epsilon) {
      return nextGuess * 100;  // Convertir en pourcentage
    }
    
    guess = nextGuess;
  }
  
  // Pas de convergence après nombre maximal d'itérations
  return guess * 100;  // Retourner l'approximation actuelle
};
