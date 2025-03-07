/**
 * Calculateur de rendement MULTI complet
 * 
 * Ce module implémente un calculateur détaillé pour l'analyse approfondie des immeubles à revenus
 * selon la méthodologie des Secrets de l'Immobilier. Il permet d'analyser tous les revenus et dépenses
 * en détail, de calculer des ratios financiers avancés et de simuler différentes structures de financement.
 */

/**
 * Structure des entrées pour le calculateur de rendement MULTI complet
 * @typedef {Object} CompleteMultiInput
 * @property {PropertyInfo} property - Informations sur la propriété
 * @property {RevenueDetails} revenues - Détails des revenus
 * @property {ExpenseDetails} expenses - Détails des dépenses
 * @property {FinancingDetails} financing - Détails du financement
 * @property {OptimizationDetails} [optimization] - Détails des optimisations potentielles (optionnel)
 */

/**
 * Structure des informations sur la propriété
 * @typedef {Object} PropertyInfo
 * @property {string} address - Adresse de la propriété
 * @property {number} purchasePrice - Prix d'achat de la propriété
 * @property {number} marketValue - Valeur marchande actuelle/estimée
 * @property {number} unitCount - Nombre d'unités (portes)
 * @property {number} constructionYear - Année de construction
 * @property {number} landValue - Valeur du terrain
 * @property {number} buildingValue - Valeur du bâtiment
 * @property {boolean} [sellerMotivated=false] - Indique si le vendeur est motivé à vendre
 */

/**
 * Structure des détails des revenus
 * @typedef {Object} RevenueDetails
 * @property {Array<UnitInfo>} units - Informations sur les unités (logements)
 * @property {Array<AdditionalRevenue>} additionalRevenues - Revenus additionnels
 * @property {number} vacancyRate - Taux d'inoccupation (pourcentage)
 * @property {number} badDebtRate - Taux de mauvaises créances (pourcentage)
 */

/**
 * Structure des informations sur une unité de logement
 * @typedef {Object} UnitInfo
 * @property {string} unitNumber - Numéro ou identifiant de l'unité
 * @property {number} bedrooms - Nombre de chambres
 * @property {number} bathrooms - Nombre de salles de bain
 * @property {number} squareFeet - Superficie en pieds carrés
 * @property {number} currentRent - Loyer actuel
 * @property {number} marketRent - Loyer du marché (potentiel)
 * @property {string} leaseEndDate - Date de fin du bail
 * @property {boolean} isRented - Indique si l'unité est actuellement louée
 */

/**
 * Structure pour un revenu additionnel
 * @typedef {Object} AdditionalRevenue
 * @property {string} type - Type de revenu (stationnement, buanderie, stockage, etc.)
 * @property {number} monthlyAmount - Montant mensuel du revenu
 * @property {number} [unitCount] - Nombre d'unités concernées (si applicable)
 * @property {string} [notes] - Notes ou détails supplémentaires
 */

/**
 * Structure des détails des dépenses
 * @typedef {Object} ExpenseDetails
 * @property {TaxExpense} taxes - Dépenses liées aux taxes
 * @property {InsuranceExpense} insurance - Dépenses d'assurance
 * @property {UtilityExpense} utilities - Dépenses liées aux services publics
 * @property {MaintenanceExpense} maintenance - Dépenses d'entretien
 * @property {ManagementExpense} management - Dépenses de gestion
 * @property {Array<OtherExpense>} otherExpenses - Autres dépenses
 */

/**
 * Structure des dépenses de taxes
 * @typedef {Object} TaxExpense
 * @property {number} municipal - Taxes municipales annuelles
 * @property {number} school - Taxes scolaires annuelles
 * @property {number} [land] - Taxes foncières (si différentes des taxes municipales)
 */

/**
 * Structure des dépenses d'assurance
 * @typedef {Object} InsuranceExpense
 * @property {number} building - Assurance du bâtiment
 * @property {number} [liability] - Assurance responsabilité civile
 * @property {number} [rental] - Assurance locative
 */

/**
 * Structure des dépenses liées aux services publics
 * @typedef {Object} UtilityExpense
 * @property {number} [electricity] - Dépenses d'électricité
 * @property {number} [gas] - Dépenses de gaz
 * @property {number} [water] - Dépenses d'eau
 * @property {number} [garbage] - Dépenses d'enlèvement des ordures
 * @property {number} [internet] - Dépenses d'internet/câble
 */

/**
 * Structure des dépenses d'entretien
 * @typedef {Object} MaintenanceExpense
 * @property {number} repairs - Réparations courantes
 * @property {number} landscaping - Entretien paysager
 * @property {number} snowRemoval - Déneigement
 * @property {number} cleaning - Nettoyage
 * @property {number} [reserve] - Fonds de réserve pour réparations majeures
 */

/**
 * Structure des dépenses de gestion
 * @typedef {Object} ManagementExpense
 * @property {number} [fee] - Frais de gestion (pourcentage ou montant fixe)
 * @property {boolean} isPercentage - Indique si les frais sont un pourcentage
 * @property {number} [salaries] - Salaires du personnel (concierge, etc.)
 * @property {number} [professionalFees] - Honoraires professionnels (comptable, avocat)
 */

/**
 * Structure pour une autre dépense
 * @typedef {Object} OtherExpense
 * @property {string} name - Nom de la dépense
 * @property {number} amount - Montant annuel
 * @property {boolean} [recurring=true] - Indique si la dépense est récurrente
 */

/**
 * Structure des détails du financement
 * @typedef {Object} FinancingDetails
 * @property {ConventionalMortgage} [conventionalMortgage] - Prêt hypothécaire conventionnel
 * @property {Array<CreativeFinancing>} [creativeFinancing] - Financements créatifs additionnels
 * @property {number} downPayment - Mise de fonds
 * @property {number} downPaymentPercentage - Pourcentage de mise de fonds
 * @property {number} [closingCosts] - Frais de clôture (notaire, inspection, etc.)
 */

/**
 * Structure d'un prêt hypothécaire conventionnel
 * @typedef {Object} ConventionalMortgage
 * @property {number} amount - Montant du prêt
 * @property {number} interestRate - Taux d'intérêt annuel (pourcentage)
 * @property {number} amortizationYears - Période d'amortissement en années
 * @property {number} termYears - Durée du terme en années
 * @property {string} [paymentFrequency="monthly"] - Fréquence des paiements (mensuelle, bimensuelle, etc.)
 */

/**
 * Structure d'un financement créatif
 * @typedef {Object} CreativeFinancing
 * @property {string} type - Type de financement (loveMoney, partnership, vendorTakeBack)
 * @property {string} subtype - Sous-type (loan, equity, silentPartner, etc.)
 * @property {number} amount - Montant du financement
 * @property {number} interestRate - Taux d'intérêt annuel (pourcentage)
 * @property {number} termYears - Durée du terme en années
 * @property {number} [paymentAmount] - Montant des paiements (si fixe)
 * @property {string} [paymentFrequency="monthly"] - Fréquence des paiements
 * @property {number} [equityPercentage] - Pourcentage d'équité cédé (pour partenariats)
 * @property {number} [profitSplit] - Partage des profits (pour partenariats)
 * @property {boolean} [interestOnly=false] - Indique si seulement les intérêts sont payés
 */

/**
 * Structure des détails des optimisations potentielles
 * @typedef {Object} OptimizationDetails
 * @property {Array<RentOptimization>} rentOptimizations - Optimisations des loyers
 * @property {Array<AdditionalRevenueOptimization>} additionalRevenueOptimizations - Optimisations des revenus additionnels
 * @property {Array<ExpenseOptimization>} expenseOptimizations - Optimisations des dépenses
 * @property {Array<StructuralOptimization>} structuralOptimizations - Optimisations structurelles
 */

/**
 * Structure d'une optimisation de loyer
 * @typedef {Object} RentOptimization
 * @property {string} unitNumber - Numéro ou identifiant de l'unité
 * @property {number} currentRent - Loyer actuel
 * @property {number} optimizedRent - Loyer optimisé
 * @property {number} implementationCost - Coût de mise en œuvre
 * @property {string} [strategy] - Stratégie d'optimisation
 */

/**
 * Structure d'une optimisation de revenu additionnel
 * @typedef {Object} AdditionalRevenueOptimization
 * @property {string} type - Type de revenu (stationnement, buanderie, stockage, etc.)
 * @property {number} currentRevenue - Revenu actuel
 * @property {number} optimizedRevenue - Revenu optimisé
 * @property {number} implementationCost - Coût de mise en œuvre
 * @property {string} [strategy] - Stratégie d'optimisation
 */

/**
 * Structure d'une optimisation de dépense
 * @typedef {Object} ExpenseOptimization
 * @property {string} category - Catégorie de dépense
 * @property {number} currentExpense - Dépense actuelle
 * @property {number} optimizedExpense - Dépense optimisée
 * @property {number} implementationCost - Coût de mise en œuvre
 * @property {string} [strategy] - Stratégie d'optimisation
 */

/**
 * Structure d'une optimisation structurelle
 * @typedef {Object} StructuralOptimization
 * @property {string} type - Type d'optimisation (conversion, ajout d'unité, etc.)
 * @property {number} currentValue - Valeur actuelle
 * @property {number} optimizedValue - Valeur optimisée
 * @property {number} implementationCost - Coût de mise en œuvre
 * @property {string} [strategy] - Stratégie d'optimisation
 * @property {number} [additionalMonthlyRevenue] - Revenu mensuel additionnel généré
 */

/**
 * Structure des résultats du calculateur de rendement MULTI complet
 * @typedef {Object} CompleteMultiResult
 * @property {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @property {ExpenseAnalysis} expenseAnalysis - Analyse des dépenses
 * @property {CashflowAnalysis} cashflowAnalysis - Analyse des flux de trésorerie
 * @property {FinancialRatios} financialRatios - Ratios financiers
 * @property {FinancingAnalysis} financingAnalysis - Analyse du financement
 * @property {OptimizationAnalysis} [optimizationAnalysis] - Analyse des optimisations
 * @property {RecommendationSummary} recommendation - Résumé et recommandations
 */

/**
 * Calcule le rendement complet d'un immeuble à revenus
 * @param {CompleteMultiInput} input - Données d'entrée pour le calcul
 * @returns {CompleteMultiResult} - Résultats détaillés de l'analyse
 */
function calculateCompleteMultiRendement(input) {
    // Validation des entrées
    validateInput(input);
    
    // Extraire les composantes principales de l'entrée
    const { property, revenues, expenses, financing, optimization } = input;
    
    // 1. Analyse des revenus
    const revenueAnalysis = analyzeRevenues(property, revenues);
    
    // 2. Analyse des dépenses
    const expenseAnalysis = analyzeExpenses(property, expenses, revenueAnalysis.grossPotentialRevenue);
    
    // 3. Analyse des flux de trésorerie
    const cashflowAnalysis = analyzeCashflow(revenueAnalysis, expenseAnalysis);
    
    // 4. Analyse du financement
    const financingAnalysis = analyzeFinancing(property, financing, cashflowAnalysis.netOperatingIncome);
    
    // 5. Calcul des ratios financiers
    const financialRatios = calculateFinancialRatios(property, revenueAnalysis, cashflowAnalysis, financingAnalysis);
    
    // 6. Analyse des optimisations (si fournies)
    let optimizationAnalysis = null;
    if (optimization) {
        optimizationAnalysis = analyzeOptimizations(property, revenueAnalysis, expenseAnalysis, cashflowAnalysis, optimization);
    }
    
    // 7. Générer une recommandation
    const recommendation = generateRecommendation(property, revenueAnalysis, cashflowAnalysis, financialRatios, optimizationAnalysis);
    
    // Retourner les résultats complets
    return {
        revenueAnalysis,
        expenseAnalysis,
        cashflowAnalysis,
        financialRatios,
        financingAnalysis,
        optimizationAnalysis,
        recommendation
    };
}

/**
 * Valide les entrées du calculateur
 * @param {CompleteMultiInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
    if (!input) {
        throw new Error("Les données d'entrée sont requises");
    }
    
    // Validation de base des propriétés requises
    if (!input.property) {
        throw new Error("Les informations sur la propriété sont requises");
    }
    
    if (!input.revenues) {
        throw new Error("Les détails des revenus sont requis");
    }
    
    if (!input.expenses) {
        throw new Error("Les détails des dépenses sont requis");
    }
    
    if (!input.financing) {
        throw new Error("Les détails du financement sont requis");
    }
    
    // Validation de la propriété
    const { property } = input;
    if (!property.purchasePrice || property.purchasePrice <= 0) {
        throw new Error("Le prix d'achat doit être un nombre positif");
    }
    
    if (!property.unitCount || property.unitCount <= 0 || !Number.isInteger(property.unitCount)) {
        throw new Error("Le nombre d'unités doit être un entier positif");
    }
    
    // Validation des revenus
    const { revenues } = input;
    if (!revenues.units || !Array.isArray(revenues.units) || revenues.units.length === 0) {
        throw new Error("Au moins une unité (logement) doit être spécifiée");
    }
    
    if (revenues.units.length !== property.unitCount) {
        throw new Error(`Le nombre d'unités dans les détails des revenus (${revenues.units.length}) ne correspond pas au nombre d'unités de la propriété (${property.unitCount})`);
    }
    
    // Validation du financement
    const { financing } = input;
    if (financing.downPaymentPercentage <= 0 || financing.downPaymentPercentage >= 1) {
        throw new Error("Le pourcentage de mise de fonds doit être entre 0 et 1");
    }
    
    const totalFinancing = calculateTotalFinancingAmount(financing);
    const expectedFinancing = property.purchasePrice * (1 - financing.downPaymentPercentage);
    
    // Permettre une légère différence due aux arrondis
    if (Math.abs(totalFinancing - expectedFinancing) > 1) {
        throw new Error(`Le montant total du financement (${totalFinancing}) ne correspond pas au montant attendu (${expectedFinancing})`);
    }
}

/**
 * Calcule le montant total du financement
 * @param {FinancingDetails} financing - Détails du financement
 * @returns {number} - Montant total du financement
 */
function calculateTotalFinancingAmount(financing) {
    let total = 0;
    
    // Ajouter le prêt hypothécaire conventionnel
    if (financing.conventionalMortgage) {
        total += financing.conventionalMortgage.amount;
    }
    
    // Ajouter les financements créatifs
    if (financing.creativeFinancing && Array.isArray(financing.creativeFinancing)) {
        financing.creativeFinancing.forEach(cf => {
            total += cf.amount;
        });
    }
    
    return total;
}

/**
 * Analyse les revenus de la propriété
 * @param {PropertyInfo} property - Informations sur la propriété
 * @param {RevenueDetails} revenues - Détails des revenus
 * @returns {RevenueAnalysis} - Analyse des revenus
 */
function analyzeRevenues(property, revenues) {
    // Calculer le revenu potentiel brut des loyers
    const potentialRentalRevenue = revenues.units.reduce((total, unit) => {
        return total + (unit.marketRent * 12);
    }, 0);
    
    // Calculer le revenu actuel des loyers
    const currentRentalRevenue = revenues.units.reduce((total, unit) => {
        return total + (unit.currentRent * 12);
    }, 0);
    
    // Calculer les revenus additionnels
    const additionalRevenues = revenues.additionalRevenues ?
        revenues.additionalRevenues.reduce((total, revenue) => {
            return total + (revenue.monthlyAmount * 12);
        }, 0) : 0;
    
    // Calculer le revenu potentiel brut total
    const grossPotentialRevenue = potentialRentalRevenue + additionalRevenues;
    
    // Calculer le revenu actuel brut total
    const grossCurrentRevenue = currentRentalRevenue + additionalRevenues;
    
    // Calculer les pertes dues aux inoccupations
    const vacancyLoss = grossPotentialRevenue * (revenues.vacancyRate / 100);
    
    // Calculer les pertes dues aux mauvaises créances
    const badDebtLoss = grossPotentialRevenue * (revenues.badDebtRate / 100);
    
    // Calculer le revenu effectif
    const effectiveGrossRevenue = grossPotentialRevenue - vacancyLoss - badDebtLoss;
    
    // Calculer le revenu actuel effectif
    const effectiveCurrentRevenue = grossCurrentRevenue - vacancyLoss - badDebtLoss;
    
    // Calculer le revenu moyen par unité
    const averageRevenuePerUnit = property.unitCount > 0 ? 
        grossPotentialRevenue / property.unitCount / 12 : 0;
    
    // Calculer le potentiel d'augmentation des loyers
    const rentIncreasePotential = potentialRentalRevenue - currentRentalRevenue;
    const rentIncreasePotentialPercentage = currentRentalRevenue > 0 ? 
        (rentIncreasePotential / currentRentalRevenue) * 100 : 0;
    
    return {
        potentialRentalRevenue,
        currentRentalRevenue,
        additionalRevenues,
        grossPotentialRevenue,
        grossCurrentRevenue,
        vacancyLoss,
        badDebtLoss,
        effectiveGrossRevenue,
        effectiveCurrentRevenue,
        averageRevenuePerUnit,
        rentIncreasePotential,
        rentIncreasePotentialPercentage,
        revenueBreakdown: {
            rentalRevenue: potentialRentalRevenue / grossPotentialRevenue * 100,
            additionalRevenue: additionalRevenues / grossPotentialRevenue * 100
        },
        detailedAdditionalRevenues: revenues.additionalRevenues || []
    };
}

/**
 * Analyse les dépenses de la propriété
 * @param {PropertyInfo} property - Informations sur la propriété
 * @param {ExpenseDetails} expenses - Détails des dépenses
 * @param {number} grossPotentialRevenue - Revenu potentiel brut
 * @returns {ExpenseAnalysis} - Analyse des dépenses
 */
function analyzeExpenses(property, expenses, grossPotentialRevenue) {
    // Calculer les dépenses de taxes
    const taxExpenses = (expenses.taxes.municipal || 0) + 
                       (expenses.taxes.school || 0) + 
                       (expenses.taxes.land || 0);
    
    // Calculer les dépenses d'assurance
    const insuranceExpenses = (expenses.insurance.building || 0) + 
                            (expenses.insurance.liability || 0) + 
                            (expenses.insurance.rental || 0);
    
    // Calculer les dépenses de services publics
    const utilityExpenses = (expenses.utilities.electricity || 0) + 
                           (expenses.utilities.gas || 0) + 
                           (expenses.utilities.water || 0) + 
                           (expenses.utilities.garbage || 0) + 
                           (expenses.utilities.internet || 0);
    
    // Calculer les dépenses d'entretien
    const maintenanceExpenses = (expenses.maintenance.repairs || 0) + 
                               (expenses.maintenance.landscaping || 0) + 
                               (expenses.maintenance.snowRemoval || 0) + 
                               (expenses.maintenance.cleaning || 0) + 
                               (expenses.maintenance.reserve || 0);
    
    // Calculer les dépenses de gestion
    let managementExpenses = 0;
    if (expenses.management.isPercentage && expenses.management.fee) {
        managementExpenses = grossPotentialRevenue * (expenses.management.fee / 100);
    } else if (expenses.management.fee) {
        managementExpenses = expenses.management.fee;
    }
    managementExpenses += (expenses.management.salaries || 0) + 
                         (expenses.management.professionalFees || 0);
    
    // Calculer les autres dépenses
    const otherExpenses = expenses.otherExpenses ? 
        expenses.otherExpenses.reduce((total, expense) => {
            return total + expense.amount;
        }, 0) : 0;
    
    // Calculer les dépenses totales
    const totalExpenses = taxExpenses + insuranceExpenses + utilityExpenses + 
                          maintenanceExpenses + managementExpenses + otherExpenses;
    
    // Calculer le ratio de dépenses
    const expenseRatio = grossPotentialRevenue > 0 ? 
        (totalExpenses / grossPotentialRevenue) * 100 : 0;
    
    // Calculer les dépenses par unité
    const expensesPerUnit = property.unitCount > 0 ? 
        totalExpenses / property.unitCount : 0;
    
    // Répartition des dépenses
    const expenseBreakdown = {
        taxes: grossPotentialRevenue > 0 ? taxExpenses / grossPotentialRevenue * 100 : 0,
        insurance: grossPotentialRevenue > 0 ? insuranceExpenses / grossPotentialRevenue * 100 : 0,
        utilities: grossPotentialRevenue > 0 ? utilityExpenses / grossPotentialRevenue * 100 : 0,
        maintenance: grossPotentialRevenue > 0 ? maintenanceExpenses / grossPotentialRevenue * 100 : 0,
        management: grossPotentialRevenue > 0 ? managementExpenses / grossPotentialRevenue * 100 : 0,
        other: grossPotentialRevenue > 0 ? otherExpenses / grossPotentialRevenue * 100 : 0
    };
    
    return {
        taxExpenses,
        insuranceExpenses,
        utilityExpenses,
        maintenanceExpenses,
        managementExpenses,
        otherExpenses,
        totalExpenses,
        expenseRatio,
        expensesPerUnit,
        expenseBreakdown,
        detailedExpenseBreakdown: {
            taxes: {
                municipal: expenses.taxes.municipal || 0,
                school: expenses.taxes.school || 0,
                land: expenses.taxes.land || 0
            },
            insurance: {
                building: expenses.insurance.building || 0,
                liability: expenses.insurance.liability || 0,
                rental: expenses.insurance.rental || 0
            },
            utilities: {
                electricity: expenses.utilities.electricity || 0,
                gas: expenses.utilities.gas || 0,
                water: expenses.utilities.water || 0,
                garbage: expenses.utilities.garbage || 0,
                internet: expenses.utilities.internet || 0
            },
            maintenance: {
                repairs: expenses.maintenance.repairs || 0,
                landscaping: expenses.maintenance.landscaping || 0,
                snowRemoval: expenses.maintenance.snowRemoval || 0,
                cleaning: expenses.maintenance.cleaning || 0,
                reserve: expenses.maintenance.reserve || 0
            },
            management: {
                fee: managementExpenses - (expenses.management.salaries || 0) - (expenses.management.professionalFees || 0),
                salaries: expenses.management.salaries || 0,
                professionalFees: expenses.management.professionalFees || 0
            },
            other: expenses.otherExpenses || []
        }
    };
}

/**
 * Analyse les flux de trésorerie de la propriété
 * @param {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @param {ExpenseAnalysis} expenseAnalysis - Analyse des dépenses
 * @returns {CashflowAnalysis} - Analyse des flux de trésorerie
 */
function analyzeCashflow(revenueAnalysis, expenseAnalysis) {
    // Calculer le revenu net d'exploitation (NOI)
    const netOperatingIncome = revenueAnalysis.effectiveGrossRevenue - expenseAnalysis.totalExpenses;
    
    // Calculer le revenu net d'exploitation actuel
    const currentNetOperatingIncome = revenueAnalysis.effectiveCurrentRevenue - expenseAnalysis.totalExpenses;
    
    return {
        netOperatingIncome,
        currentNetOperatingIncome
    };
}

/**
 * Analyse le financement de la propriété
 * @param {PropertyInfo} property - Informations sur la propriété
 * @param {FinancingDetails} financing - Détails du financement
 * @param {number} netOperatingIncome - Revenu net d'exploitation
 * @returns {FinancingAnalysis} - Analyse du financement
 */
function analyzeFinancing(property, financing, netOperatingIncome) {
    // Calculer le paiement du prêt hypothécaire conventionnel
    let conventionalMortgagePayment = 0;
    let conventionalMortgageDetails = null;
    
    if (financing.conventionalMortgage) {
        const { amount, interestRate, amortizationYears } = financing.conventionalMortgage;
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = amortizationYears * 12;
        
        // Formule du paiement mensuel: P = L[i(1+i)^n]/[(1+i)^n - 1]
        const monthlyPayment = amount * 
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
            (Math.pow(1 + monthlyRate, numPayments) - 1);
        
        conventionalMortgagePayment = monthlyPayment * 12;
        
        // Calculer la répartition intérêts/principal pour la première année
        const interestPayment = amount * interestRate / 100;
        const principalPayment = conventionalMortgagePayment - interestPayment;
        
        conventionalMortgageDetails = {
            amount,
            interestRate,
            amortizationYears,
            annualPayment: conventionalMortgagePayment,
            monthlyPayment,
            interestPayment,
            principalPayment
        };
    }
    
    // Calculer les paiements des financements créatifs
    let creativeFinancingPayments = 0;
    const creativeFinancingDetails = [];
    
    if (financing.creativeFinancing && Array.isArray(financing.creativeFinancing)) {
        financing.creativeFinancing.forEach(cf => {
            let annualPayment = 0;
            
            if (cf.interestOnly) {
                // Paiement d'intérêts seulement
                annualPayment = cf.amount * (cf.interestRate / 100);
            } else if (cf.paymentAmount) {
                // Paiement fixe
                const frequency = cf.paymentFrequency || 'monthly';
                const paymentsPerYear = getPaymentsPerYear(frequency);
                annualPayment = cf.paymentAmount * paymentsPerYear;
            } else {
                // Calcul d'un paiement d'amortissement standard
                const monthlyRate = cf.interestRate / 100 / 12;
                const numPayments = cf.termYears * 12;
                
                const monthlyPayment = cf.amount * 
                    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                    (Math.pow(1 + monthlyRate, numPayments) - 1);
                
                annualPayment = monthlyPayment * 12;
            }
            
            creativeFinancingPayments += annualPayment;
            
            creativeFinancingDetails.push({
                type: cf.type,
                subtype: cf.subtype,
                amount: cf.amount,
                interestRate: cf.interestRate,
                termYears: cf.termYears,
                annualPayment,
                equityPercentage: cf.equityPercentage || 0,
                profitSplit: cf.profitSplit || 0
            });
        });
    }
    
    // Calculer le service total de la dette
    const totalDebtService = conventionalMortgagePayment + creativeFinancingPayments;
    
    // Calculer le flux de trésorerie avant impôts
    const cashflowBeforeTax = netOperatingIncome - totalDebtService;
    
    // Calculer le cashflow par porte par mois
    const cashflowPerDoorMonthly = property.unitCount > 0 ? 
        cashflowBeforeTax / property.unitCount / 12 : 0;
    
    // Calculer le ratio de couverture du service de la dette
    const debtServiceCoverageRatio = totalDebtService > 0 ? 
        netOperatingIncome / totalDebtService : 0;
    
    return {
        conventionalMortgagePayment,
        conventionalMortgageDetails,
        creativeFinancingPayments,
        creativeFinancingDetails,
        totalDebtService,
        cashflowBeforeTax,
        cashflowPerDoorMonthly,
        debtServiceCoverageRatio
    };
}

/**
 * Calcule les ratios financiers de la propriété
 * @param {PropertyInfo} property - Informations sur la propriété
 * @param {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @param {CashflowAnalysis} cashflowAnalysis - Analyse des flux de trésorerie
 * @param {FinancingAnalysis} financingAnalysis - Analyse du financement
 * @returns {FinancialRatios} - Ratios financiers
 */
function calculateFinancialRatios(property, revenueAnalysis, cashflowAnalysis, financingAnalysis) {
    // Calculer le taux de capitalisation (Cap Rate)
    const capRate = property.purchasePrice > 0 ? 
        (cashflowAnalysis.netOperatingIncome / property.purchasePrice) * 100 : 0;
    
    // Calculer le taux de capitalisation basé sur la valeur marchande
    const marketCapRate = property.marketValue > 0 ? 
        (cashflowAnalysis.netOperatingIncome / property.marketValue) * 100 : 0;
    
    // Calculer le multiplicateur du revenu brut (MRB)
    const grossRentMultiplier = revenueAnalysis.grossPotentialRevenue > 0 ? 
        property.purchasePrice / revenueAnalysis.grossPotentialRevenue : 0;
    
    // Calculer le rendement sur mise de fonds (ROI)
    const returnOnInvestment = financingAnalysis.cashflowBeforeTax > 0 && property.purchasePrice > 0 ? 
        (financingAnalysis.cashflowBeforeTax / property.purchasePrice) * 100 : 0;
    
    // Calculer le rendement sur capitaux propres (ROE)
    const downPayment = property.purchasePrice * (1 - (financing.conventionalMortgage ? (financing.conventionalMortgage.amount / property.purchasePrice) : 0));
    const returnOnEquity = financingAnalysis.cashflowBeforeTax > 0 && downPayment > 0 ? 
        (financingAnalysis.cashflowBeforeTax / downPayment) * 100 : 0;
    
    // Calculer le ratio prêt-valeur (Loan-to-Value, LTV)
    const loanToValueRatio = property.purchasePrice > 0 && financing.conventionalMortgage ? 
        (financing.conventionalMortgage.amount / property.purchasePrice) * 100 : 0;
    
    // Calculer le TGA (Taux Global d'Actualisation)
    // TGA = Cap Rate + Taux d'appréciation annuel
    // En l'absence de données sur l'appréciation, on utilise une estimation de 2%
    const appreciationRate = 2; // Estimation par défaut
    const totalGlobalRate = capRate + appreciationRate;
    
    return {
        capRate,
        marketCapRate,
        grossRentMultiplier,
        returnOnInvestment,
        returnOnEquity,
        loanToValueRatio,
        totalGlobalRate,
        debtServiceCoverageRatio: financingAnalysis.debtServiceCoverageRatio
    };
}

/**
 * Analyse les optimisations potentielles de la propriété
 * @param {PropertyInfo} property - Informations sur la propriété
 * @param {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @param {ExpenseAnalysis} expenseAnalysis - Analyse des dépenses
 * @param {CashflowAnalysis} cashflowAnalysis - Analyse des flux de trésorerie
 * @param {OptimizationDetails} optimization - Détails des optimisations
 * @returns {OptimizationAnalysis} - Analyse des optimisations
 */
function analyzeOptimizations(property, revenueAnalysis, expenseAnalysis, cashflowAnalysis, optimization) {
    // Calculer l'impact des optimisations de loyer
    let additionalRentalRevenue = 0;
    let rentOptimizationCost = 0;
    
    if (optimization.rentOptimizations && Array.isArray(optimization.rentOptimizations)) {
        optimization.rentOptimizations.forEach(opt => {
            const increase = opt.optimizedRent - opt.currentRent;
            additionalRentalRevenue += increase * 12;
            rentOptimizationCost += opt.implementationCost;
        });
    }
    
    // Calculer l'impact des optimisations de revenus additionnels
    let additionalOtherRevenue = 0;
    let additionalRevenueOptimizationCost = 0;
    
    if (optimization.additionalRevenueOptimizations && Array.isArray(optimization.additionalRevenueOptimizations)) {
        optimization.additionalRevenueOptimizations.forEach(opt => {
            const increase = opt.optimizedRevenue - opt.currentRevenue;
            additionalOtherRevenue += increase * 12;
            additionalRevenueOptimizationCost += opt.implementationCost;
        });
    }
    
    // Calculer l'impact des optimisations de dépenses
    let expensesReduction = 0;
    let expenseOptimizationCost = 0;
    
    if (optimization.expenseOptimizations && Array.isArray(optimization.expenseOptimizations)) {
        optimization.expenseOptimizations.forEach(opt => {
            const reduction = opt.currentExpense - opt.optimizedExpense;
            expensesReduction += reduction;
            expenseOptimizationCost += opt.implementationCost;
        });
    }
    
    // Calculer l'impact des optimisations structurelles
    let structuralOptimizationRevenue = 0;
    let structuralOptimizationCost = 0;
    let additionalValue = 0;
    
    if (optimization.structuralOptimizations && Array.isArray(optimization.structuralOptimizations)) {
        optimization.structuralOptimizations.forEach(opt => {
            if (opt.additionalMonthlyRevenue) {
                structuralOptimizationRevenue += opt.additionalMonthlyRevenue * 12;
            }
            
            structuralOptimizationCost += opt.implementationCost;
            additionalValue += opt.optimizedValue - opt.currentValue;
        });
    }
    
    // Calculer le total des optimisations de revenus
    const totalAdditionalRevenue = additionalRentalRevenue + additionalOtherRevenue + structuralOptimizationRevenue;
    
    // Calculer le total des coûts d'optimisation
    const totalOptimizationCost = rentOptimizationCost + additionalRevenueOptimizationCost + 
                                 expenseOptimizationCost + structuralOptimizationCost;
    
    // Calculer le NOI optimisé
    const optimizedNOI = cashflowAnalysis.netOperatingIncome + totalAdditionalRevenue + expensesReduction;
    
    // Calculer le taux de capitalisation optimisé
    const optimizedCapRate = property.purchasePrice > 0 ? 
        (optimizedNOI / property.purchasePrice) * 100 : 0;
    
    // Calculer la valeur optimisée de la propriété
    // Utiliser la formule: Valeur = NOI / Cap Rate
    const marketCapRate = property.marketValue > 0 && cashflowAnalysis.netOperatingIncome > 0 ?
        cashflowAnalysis.netOperatingIncome / property.marketValue : 0.07; // Valeur par défaut si non disponible
    
    const optimizedValue = marketCapRate > 0 ? 
        optimizedNOI / marketCapRate : property.marketValue + additionalValue;
    
    // Calculer le retour sur investissement des optimisations
    const optimizationROI = totalOptimizationCost > 0 ? 
        ((totalAdditionalRevenue + expensesReduction) / totalOptimizationCost) * 100 : 0;
    
    // Calculer la période de récupération (en années)
    const paybackPeriod = (totalAdditionalRevenue + expensesReduction) > 0 ? 
        totalOptimizationCost / (totalAdditionalRevenue + expensesReduction) : 0;
    
    return {
        additionalRentalRevenue,
        additionalOtherRevenue,
        expensesReduction,
        structuralOptimizationRevenue,
        totalAdditionalRevenue,
        rentOptimizationCost,
        additionalRevenueOptimizationCost,
        expenseOptimizationCost,
        structuralOptimizationCost,
        totalOptimizationCost,
        optimizedNOI,
        optimizedCapRate,
        optimizedValue,
        additionalValue: optimizedValue - property.marketValue,
        optimizationROI,
        paybackPeriod,
        detailedOptimizations: {
            rentOptimizations: optimization.rentOptimizations || [],
            additionalRevenueOptimizations: optimization.additionalRevenueOptimizations || [],
            expenseOptimizations: optimization.expenseOptimizations || [],
            structuralOptimizations: optimization.structuralOptimizations || []
        }
    };
}

/**
 * Génère une recommandation basée sur l'analyse de la propriété
 * @param {PropertyInfo} property - Informations sur la propriété
 * @param {RevenueAnalysis} revenueAnalysis - Analyse des revenus
 * @param {CashflowAnalysis} cashflowAnalysis - Analyse des flux de trésorerie
 * @param {FinancialRatios} financialRatios - Ratios financiers
 * @param {OptimizationAnalysis} optimizationAnalysis - Analyse des optimisations
 * @returns {RecommendationSummary} - Résumé et recommandations
 */
function generateRecommendation(property, revenueAnalysis, cashflowAnalysis, financialRatios, optimizationAnalysis) {
    // Définir les seuils selon la méthodologie des Secrets de l'Immobilier
    const CASHFLOW_PER_DOOR_THRESHOLD = 75; // 75$ par porte par mois
    const CAP_RATE_THRESHOLD = 5; // 5% de taux de capitalisation
    const DSCR_THRESHOLD = 1.25; // Ratio de couverture du service de la dette
    
    // Évaluation du cashflow
    const cashflowRating = financingAnalysis.cashflowPerDoorMonthly >= CASHFLOW_PER_DOOR_THRESHOLD ? 
        'GOOD' : (financingAnalysis.cashflowPerDoorMonthly > 0 ? 'ACCEPTABLE' : 'POOR');
    
    // Évaluation du taux de capitalisation
    const capRateRating = financialRatios.capRate >= CAP_RATE_THRESHOLD ? 
        'GOOD' : (financialRatios.capRate > 0 ? 'ACCEPTABLE' : 'POOR');
    
    // Évaluation du DSCR
    const dscrRating = financialRatios.debtServiceCoverageRatio >= DSCR_THRESHOLD ? 
        'GOOD' : (financialRatios.debtServiceCoverageRatio >= 1 ? 'ACCEPTABLE' : 'POOR');
    
    // Évaluer le potentiel d'optimisation
    let optimizationPotentialRating = 'UNKNOWN';
    let optimizationRecommendations = [];
    
    if (optimizationAnalysis) {
        const optimizationROI = optimizationAnalysis.optimizationROI;
        
        if (optimizationROI >= 20) {
            optimizationPotentialRating = 'EXCELLENT';
        } else if (optimizationROI >= 12) {
            optimizationPotentialRating = 'GOOD';
        } else if (optimizationROI >= 5) {
            optimizationPotentialRating = 'ACCEPTABLE';
        } else {
            optimizationPotentialRating = 'POOR';
        }
        
        // Générer des recommandations d'optimisation
        if (optimizationAnalysis.additionalRentalRevenue > 0) {
            optimizationRecommendations.push(`Augmenter les loyers pour générer ${roundToTwo(optimizationAnalysis.additionalRentalRevenue)}$ supplémentaires par an.`);
        }
        
        if (optimizationAnalysis.additionalOtherRevenue > 0) {
            optimizationRecommendations.push(`Optimiser les revenus additionnels pour générer ${roundToTwo(optimizationAnalysis.additionalOtherRevenue)}$ supplémentaires par an.`);
        }
        
        if (optimizationAnalysis.expensesReduction > 0) {
            optimizationRecommendations.push(`Réduire les dépenses de ${roundToTwo(optimizationAnalysis.expensesReduction)}$ par an.`);
        }
        
        if (optimizationAnalysis.structuralOptimizationRevenue > 0) {
            optimizationRecommendations.push(`Implémenter des optimisations structurelles pour générer ${roundToTwo(optimizationAnalysis.structuralOptimizationRevenue)}$ supplémentaires par an et augmenter la valeur de la propriété de ${roundToTwo(optimizationAnalysis.additionalValue)}$.`);
        }
    }
    
    // Évaluer le potentiel d'appréciation
    const appreciationPotentialRating = 'MEDIUM'; // Valeur par défaut, à adapter selon le contexte
    
    // Générer une recommandation globale
    let globalRecommendation = '';
    
    if (cashflowRating === 'GOOD' && capRateRating === 'GOOD' && dscrRating === 'GOOD') {
        globalRecommendation = "Excellent investissement. Recommandation forte d'achat.";
    } else if (cashflowRating === 'POOR' || capRateRating === 'POOR' || dscrRating === 'POOR') {
        if (optimizationPotentialRating === 'EXCELLENT' || optimizationPotentialRating === 'GOOD') {
            globalRecommendation = "Investissement à risque mais avec un fort potentiel d'optimisation. Envisagez l'achat si vous êtes prêt à mettre en œuvre les optimisations recommandées.";
        } else {
            globalRecommendation = "Investissement risqué avec des métriques faibles. Non recommandé à moins d'une renégociation significative du prix ou des conditions.";
        }
    } else {
        globalRecommendation = "Investissement acceptable mais à surveiller. Envisagez des optimisations pour améliorer la rentabilité.";
    }
    
    // Générer des conseils de négociation
    let negotiationTips = [];
    
    if (property.sellerMotivated) {
        negotiationTips.push("Le vendeur est motivé, utilisez cette information pour négocier un meilleur prix.");
    }
    
    if (cashflowRating === 'POOR' || capRateRating === 'POOR') {
        const suggestedPriceReduction = property.purchasePrice * 0.1; // 10% de réduction suggérée
        negotiationTips.push(`Les métriques financières sont faibles. Considérez une offre inférieure d'environ ${roundToTwo(suggestedPriceReduction)}$ pour atteindre un cashflow cible de ${CASHFLOW_PER_DOOR_THRESHOLD}$ par porte.`);
    }
    
    if (revenueAnalysis.rentIncreasePotentialPercentage > 10) {
        negotiationTips.push(`Potentiel significatif d'augmentation des loyers (${roundToTwo(revenueAnalysis.rentIncreasePotentialPercentage)}%). Utilisez cette information pour justifier votre offre.`);
    }
    
    return {
        cashflowRating,
        capRateRating,
        dscrRating,
        optimizationPotentialRating,
        appreciationPotentialRating,
        globalRecommendation,
        optimizationRecommendations,
        negotiationTips,
        summary: {
            purchasePrice: property.purchasePrice,
            unitCount: property.unitCount,
            grossRevenue: revenueAnalysis.grossPotentialRevenue,
            netOperatingIncome: cashflowAnalysis.netOperatingIncome,
            cashflowPerDoor: financingAnalysis.cashflowPerDoorMonthly,
            capRate: financialRatios.capRate,
            dscr: financialRatios.debtServiceCoverageRatio,
            roi: financialRatios.returnOnInvestment
        }
    };
}

/**
 * Détermine le nombre de paiements par an en fonction de la fréquence
 * @param {string} frequency - Fréquence des paiements
 * @returns {number} - Nombre de paiements par an
 */
function getPaymentsPerYear(frequency) {
    switch (frequency.toLowerCase()) {
        case 'weekly':
            return 52;
        case 'biweekly':
            return 26;
        case 'monthly':
            return 12;
        case 'quarterly':
            return 4;
        case 'semiannual':
            return 2;
        case 'annual':
            return 1;
        default:
            return 12; // Par défaut, mensuel
    }
}

/**
 * Arrondit un nombre à deux décimales
 * @param {number} num - Nombre à arrondir
 * @returns {number} - Nombre arrondi
 */
function roundToTwo(num) {
    return Math.round(num * 100) / 100;
}

/**
 * Génère un modèle d'entrée complet à partir des données de base
 * @param {Object} basicData - Données de base sur la propriété
 * @returns {CompleteMultiInput} - Modèle d'entrée complet
 */
function generateCompleteInputFromBasicData(basicData) {
    const { 
        address, 
        purchasePrice, 
        unitCount, 
        rentalIncomePerUnit, 
        additionalIncome,
        downPaymentPercentage = 0.2
    } = basicData;
    
    // Créer les unités avec des loyers identiques (à personnaliser si nécessaire)
    const units = [];
    for (let i = 0; i < unitCount; i++) {
        units.push({
            unitNumber: `${i + 1}`,
            bedrooms: 2, // Valeur par défaut
            bathrooms: 1, // Valeur par défaut
            squareFeet: 800, // Valeur par défaut
            currentRent: rentalIncomePerUnit,
            marketRent: rentalIncomePerUnit,
            leaseEndDate: '2024-06-30', // Valeur par défaut
            isRented: true
        });
    }
    
    // Créer les revenus additionnels
    const additionalRevenues = [];
    if (additionalIncome && additionalIncome > 0) {
        additionalRevenues.push({
            type: 'Stationnement',
            monthlyAmount: additionalIncome,
            unitCount: unitCount
        });
    }
    
    // Calculer l'hypothèque conventionnelle
    const downPayment = purchasePrice * downPaymentPercentage;
    const mortgageAmount = purchasePrice - downPayment;
    
    // Estimation des dépenses basée sur le nombre d'unités
    let expenseRatio;
    if (unitCount <= 2) {
        expenseRatio = 0.3;
    } else if (unitCount <= 4) {
        expenseRatio = 0.35;
    } else if (unitCount <= 6) {
        expenseRatio = 0.45;
    } else {
        expenseRatio = 0.5;
    }
    
    const totalRevenue = (rentalIncomePerUnit * unitCount * 12) + 
                         (additionalIncome ? additionalIncome * 12 : 0);
    const totalExpenses = totalRevenue * expenseRatio;
    
    // Répartition des dépenses (estimation)
    const taxExpense = totalExpenses * 0.35; // 35% des dépenses en taxes
    const insuranceExpense = totalExpenses * 0.1; // 10% en assurance
    const utilityExpense = totalExpenses * 0.15; // 15% en services publics
    const maintenanceExpense = totalExpenses * 0.2; // 20% en entretien
    const managementExpense = totalExpenses * 0.15; // 15% en gestion
    const otherExpense = totalExpenses * 0.05; // 5% en autres dépenses
    
    return {
        property: {
            address,
            purchasePrice,
            marketValue: purchasePrice, // Valeur par défaut
            unitCount,
            constructionYear: 1980, // Valeur par défaut
            landValue: purchasePrice * 0.3, // Estimation: 30% de la valeur en terrain
            buildingValue: purchasePrice * 0.7, // Estimation: 70% de la valeur en bâtiment
            sellerMotivated: false
        },
        revenues: {
            units,
            additionalRevenues,
            vacancyRate: 5, // 5% par défaut
            badDebtRate: 0.5 // 0.5% par défaut
        },
        expenses: {
            taxes: {
                municipal: taxExpense * 0.8, // 80% des taxes sont municipales
                school: taxExpense * 0.2, // 20% des taxes sont scolaires
                land: 0
            },
            insurance: {
                building: insuranceExpense,
                liability: 0,
                rental: 0
            },
            utilities: {
                electricity: utilityExpense * 0.6, // 60% des services publics
                gas: utilityExpense * 0.2, // 20% des services publics
                water: utilityExpense * 0.1, // 10% des services publics
                garbage: utilityExpense * 0.05, // 5% des services publics
                internet: utilityExpense * 0.05 // 5% des services publics
            },
            maintenance: {
                repairs: maintenanceExpense * 0.4, // 40% de l'entretien
                landscaping: maintenanceExpense * 0.2, // 20% de l'entretien
                snowRemoval: maintenanceExpense * 0.2, // 20% de l'entretien
                cleaning: maintenanceExpense * 0.1, // 10% de l'entretien
                reserve: maintenanceExpense * 0.1 // 10% de l'entretien
            },
            management: {
                fee: managementExpense * 0.7, // 70% des frais de gestion
                isPercentage: true,
                salaries: managementExpense * 0.2, // 20% des frais de gestion
                professionalFees: managementExpense * 0.1 // 10% des frais de gestion
            },
            otherExpenses: [
                {
                    name: 'Autres dépenses',
                    amount: otherExpense,
                    recurring: true
                }
            ]
        },
        financing: {
            conventionalMortgage: {
                amount: mortgageAmount,
                interestRate: 5, // 5% par défaut
                amortizationYears: 25, // 25 ans par défaut
                termYears: 5, // 5 ans par défaut
                paymentFrequency: 'monthly'
            },
            creativeFinancing: [],
            downPayment: downPayment,
            downPaymentPercentage: downPaymentPercentage,
            closingCosts: purchasePrice * 0.015 // 1.5% des frais de clôture
        }
    };
}

module.exports = {
    calculateCompleteMultiRendement,
    generateCompleteInputFromBasicData
};
