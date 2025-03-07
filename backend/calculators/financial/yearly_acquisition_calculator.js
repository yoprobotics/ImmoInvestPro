/**
 * Calculateur Un immeuble par AN
 * 
 * Ce module implémente un calculateur permettant de projeter les résultats d'une stratégie
 * d'acquisition d'un immeuble par année, tel qu'enseigné dans les Secrets de l'Immobilier.
 * Il permet de visualiser l'évolution du portefeuille immobilier et la progression 
 * vers l'indépendance financière.
 */

/**
 * Structure des entrées pour la stratégie d'acquisition
 * @typedef {Object} AcquisitionStrategyInput
 * @property {number} numberOfYears - Nombre d'années à projeter (durée de la stratégie)
 * @property {number} targetMonthlyIncome - Revenu mensuel cible pour la retraite (en $)
 * @property {Array<PropertyAcquisition>} properties - Liste des propriétés à acquérir année par année
 */

/**
 * Structure pour chaque propriété à acquérir
 * @typedef {Object} PropertyAcquisition
 * @property {number} purchasePrice - Prix d'achat de l'immeuble
 * @property {number} unitCount - Nombre d'unités (portes) dans l'immeuble
 * @property {number} cashflowPerDoor - Cashflow mensuel par porte (en $)
 * @property {number} downPaymentPercentage - Pourcentage de mise de fonds (ex: 0.2 pour 20%)
 * @property {number} appreciationRate - Taux d'appréciation annuel (ex: 0.03 pour 3%)
 * @property {number} [year] - Année d'acquisition (1 à numberOfYears)
 */

/**
 * Structure des résultats de la projection
 * @typedef {Object} AcquisitionStrategyResult
 * @property {Array<YearlySnapshot>} yearlySnapshots - Aperçu annuel du portefeuille
 * @property {SummaryStatistics} summary - Statistiques sommaires de la stratégie
 */

/**
 * Structure d'un aperçu annuel du portefeuille
 * @typedef {Object} YearlySnapshot
 * @property {number} year - Année de la projection (1 à numberOfYears)
 * @property {number} newUnitCount - Nombre de nouvelles unités acquises cette année
 * @property {number} totalUnitCount - Nombre total d'unités dans le portefeuille
 * @property {number} newPropertyValue - Valeur de la nouvelle propriété acquise
 * @property {number} totalPortfolioValue - Valeur totale du portefeuille
 * @property {number} totalEquity - Équité totale dans le portefeuille
 * @property {number} totalDebt - Dette totale du portefeuille
 * @property {number} monthlyCashflow - Cashflow mensuel du portefeuille
 * @property {number} yearlyKPI - Indicateur de performance principal (pourcentage d'atteinte de l'objectif)
 */

/**
 * Structure des statistiques sommaires
 * @typedef {Object} SummaryStatistics
 * @property {number} finalPortfolioValue - Valeur finale du portefeuille
 * @property {number} finalEquity - Équité finale
 * @property {number} finalMonthlyCashflow - Cashflow mensuel final
 * @property {number} totalInvestedCapital - Capital total investi (somme des mises de fonds)
 * @property {number} returnOnInvestment - Rendement sur investissement (ROI)
 * @property {number} yearsToTarget - Années nécessaires pour atteindre le revenu cible
 * @property {boolean} targetAchieved - Indique si le revenu cible est atteint dans la période
 */

/**
 * Calcule la projection d'une stratégie d'acquisition d'un immeuble par an
 * @param {AcquisitionStrategyInput} input - Paramètres de la stratégie d'acquisition
 * @returns {AcquisitionStrategyResult} - Résultats de la projection
 */
function calculateYearlyAcquisitionStrategy(input) {
    // Validation des entrées
    validateInput(input);
    
    const { numberOfYears, targetMonthlyIncome, properties } = input;
    
    // Initialiser les tableaux pour stocker les résultats
    const yearlySnapshots = [];
    let cumulativePortfolio = {
        unitCount: 0,
        portfolioValue: 0,
        equity: 0,
        debt: 0,
        monthlyCashflow: 0
    };
    
    let totalInvestedCapital = 0;
    let yearsToTarget = null;
    let targetAchieved = false;
    
    // Calculer la projection année par année
    for (let year = 1; year <= numberOfYears; year++) {
        // Trouver la propriété pour cette année (soit spécifiée par l'année, soit par index)
        const propertyForYear = properties.find(p => p.year === year) || properties[Math.min(year - 1, properties.length - 1)];
        
        // Si nous avons dépassé le nombre de propriétés spécifiées et aucune n'est assignée à cette année,
        // utiliser la dernière propriété comme modèle pour les années suivantes
        let currentProperty = { ...propertyForYear };
        
        // Calculer l'appréciation des propriétés existantes
        if (year > 1) {
            cumulativePortfolio.portfolioValue *= (1 + getAverageAppreciationRate(properties));
            // Recalculer l'équité en tenant compte de l'appréciation et du remboursement du capital
            // Hypothèse simplifiée: 2% du prêt initial est remboursé chaque année
            const previousDebt = cumulativePortfolio.debt;
            const capitalRepayment = previousDebt * 0.02; // 2% de remboursement de capital par an
            cumulativePortfolio.debt = previousDebt - capitalRepayment;
            cumulativePortfolio.equity = cumulativePortfolio.portfolioValue - cumulativePortfolio.debt;
        }
        
        // Calculer les métriques pour la nouvelle propriété
        const propertyValue = currentProperty.purchasePrice;
        const downPayment = propertyValue * currentProperty.downPaymentPercentage;
        const mortgageAmount = propertyValue - downPayment;
        const unitCount = currentProperty.unitCount;
        const monthlyCashflow = unitCount * currentProperty.cashflowPerDoor;
        
        // Mettre à jour le capital total investi
        totalInvestedCapital += downPayment;
        
        // Mettre à jour le portfolio cumulatif
        cumulativePortfolio.unitCount += unitCount;
        cumulativePortfolio.portfolioValue += propertyValue;
        cumulativePortfolio.equity += downPayment;
        cumulativePortfolio.debt += mortgageAmount;
        cumulativePortfolio.monthlyCashflow += monthlyCashflow;
        
        // Calculer le KPI principal: pourcentage d'atteinte de l'objectif de revenu
        const yearlyKPI = (cumulativePortfolio.monthlyCashflow / targetMonthlyIncome) * 100;
        
        // Vérifier si le revenu cible est atteint
        if (!targetAchieved && cumulativePortfolio.monthlyCashflow >= targetMonthlyIncome) {
            targetAchieved = true;
            yearsToTarget = year;
        }
        
        // Créer l'aperçu annuel
        yearlySnapshots.push({
            year,
            newUnitCount: unitCount,
            totalUnitCount: cumulativePortfolio.unitCount,
            newPropertyValue: roundToTwo(propertyValue),
            totalPortfolioValue: roundToTwo(cumulativePortfolio.portfolioValue),
            totalEquity: roundToTwo(cumulativePortfolio.equity),
            totalDebt: roundToTwo(cumulativePortfolio.debt),
            monthlyCashflow: roundToTwo(cumulativePortfolio.monthlyCashflow),
            yearlyKPI: roundToTwo(yearlyKPI)
        });
    }
    
    // Calculer le ROI global
    const roi = ((cumulativePortfolio.equity / totalInvestedCapital) - 1) * 100;
    
    // Créer les statistiques sommaires
    const summary = {
        finalPortfolioValue: roundToTwo(cumulativePortfolio.portfolioValue),
        finalEquity: roundToTwo(cumulativePortfolio.equity),
        finalMonthlyCashflow: roundToTwo(cumulativePortfolio.monthlyCashflow),
        totalInvestedCapital: roundToTwo(totalInvestedCapital),
        returnOnInvestment: roundToTwo(roi),
        yearsToTarget,
        targetAchieved,
        portfolioGrowthRate: roundToTwo((Math.pow(cumulativePortfolio.portfolioValue / totalInvestedCapital, 1 / numberOfYears) - 1) * 100)
    };
    
    return {
        yearlySnapshots,
        summary
    };
}

/**
 * Valide les entrées du calculateur
 * @param {AcquisitionStrategyInput} input - Données d'entrée à valider
 * @throws {Error} Si les données sont invalides
 */
function validateInput(input) {
    if (!input) {
        throw new Error("Les données d'entrée sont requises");
    }
    
    if (!input.numberOfYears || input.numberOfYears <= 0) {
        throw new Error("Le nombre d'années doit être un entier positif");
    }
    
    if (!input.targetMonthlyIncome || input.targetMonthlyIncome <= 0) {
        throw new Error("Le revenu mensuel cible doit être un nombre positif");
    }
    
    if (!input.properties || !Array.isArray(input.properties) || input.properties.length === 0) {
        throw new Error("Au moins une propriété doit être spécifiée");
    }
    
    // Valider chaque propriété
    input.properties.forEach((property, index) => {
        if (!property.purchasePrice || property.purchasePrice <= 0) {
            throw new Error(`La propriété ${index + 1} doit avoir un prix d'achat positif`);
        }
        
        if (!property.unitCount || property.unitCount <= 0 || !Number.isInteger(property.unitCount)) {
            throw new Error(`La propriété ${index + 1} doit avoir un nombre d'unités entier positif`);
        }
        
        if (property.cashflowPerDoor === undefined || property.cashflowPerDoor < 0) {
            throw new Error(`La propriété ${index + 1} doit spécifier un cashflow par porte (peut être 0)`);
        }
        
        if (!property.downPaymentPercentage || property.downPaymentPercentage <= 0 || property.downPaymentPercentage > 1) {
            throw new Error(`La propriété ${index + 1} doit avoir un pourcentage de mise de fonds entre 0 et 1`);
        }
        
        if (property.appreciationRate === undefined || property.appreciationRate < 0) {
            throw new Error(`La propriété ${index + 1} doit spécifier un taux d'appréciation (peut être 0)`);
        }
    });
}

/**
 * Calcule le taux d'appréciation moyen pour le portefeuille
 * @param {Array<PropertyAcquisition>} properties - Liste des propriétés
 * @returns {number} - Taux d'appréciation moyen
 */
function getAverageAppreciationRate(properties) {
    if (!properties || properties.length === 0) {
        return 0;
    }
    
    const sum = properties.reduce((total, property) => total + (property.appreciationRate || 0), 0);
    return sum / properties.length;
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
 * Calcule le nombre de portes nécessaires pour atteindre un revenu mensuel cible
 * @param {Object} params - Paramètres de calcul
 * @param {number} params.targetMonthlyIncome - Revenu mensuel cible (en $)
 * @param {number} params.cashflowPerDoor - Cashflow mensuel par porte (en $)
 * @returns {number} - Nombre de portes nécessaires
 */
function calculateRequiredUnits(params) {
    const { targetMonthlyIncome, cashflowPerDoor } = params;
    
    if (!targetMonthlyIncome || targetMonthlyIncome <= 0) {
        throw new Error("Le revenu mensuel cible doit être un nombre positif");
    }
    
    if (!cashflowPerDoor || cashflowPerDoor <= 0) {
        throw new Error("Le cashflow par porte doit être un nombre positif");
    }
    
    // Calculer le nombre de portes nécessaires
    const requiredUnits = Math.ceil(targetMonthlyIncome / cashflowPerDoor);
    
    return {
        requiredUnits,
        targetMonthlyIncome,
        cashflowPerDoor,
        estimatedAchievementTime: Math.ceil(requiredUnits / 5) // Estimation très simplifiée basée sur l'acquisition d'un immeuble de 5 portes par an
    };
}

/**
 * Génère un modèle d'acquisition basé sur les paramètres spécifiés
 * @param {Object} params - Paramètres du modèle
 * @param {number} params.targetMonthlyIncome - Revenu mensuel cible (en $)
 * @param {number} params.cashflowPerDoor - Cashflow mensuel par porte (en $)
 * @param {number} params.initialUnitCount - Nombre d'unités par immeuble pour le premier achat
 * @param {number} params.unitCountIncrement - Augmentation du nombre d'unités pour les achats suivants
 * @param {number} params.initialPurchasePrice - Prix d'achat du premier immeuble
 * @param {number} params.pricePerUnit - Prix par unité pour les achats suivants
 * @param {number} params.downPaymentPercentage - Pourcentage de mise de fonds (ex: 0.2 pour 20%)
 * @param {number} params.appreciationRate - Taux d'appréciation annuel (ex: 0.03 pour 3%)
 * @param {number} params.numberOfYears - Nombre d'années à projeter
 * @returns {AcquisitionStrategyInput} - Modèle d'acquisition prêt à être utilisé
 */
function generateAcquisitionModel(params) {
    const {
        targetMonthlyIncome,
        cashflowPerDoor,
        initialUnitCount = 4,
        unitCountIncrement = 1,
        initialPurchasePrice,
        pricePerUnit,
        downPaymentPercentage = 0.2,
        appreciationRate = 0.03,
        numberOfYears = 10
    } = params;
    
    // Validation des entrées
    if (!targetMonthlyIncome || targetMonthlyIncome <= 0) {
        throw new Error("Le revenu mensuel cible doit être un nombre positif");
    }
    
    if (!cashflowPerDoor || cashflowPerDoor <= 0) {
        throw new Error("Le cashflow par porte doit être un nombre positif");
    }
    
    if (!initialPurchasePrice && !pricePerUnit) {
        throw new Error("Vous devez spécifier soit le prix d'achat initial, soit le prix par unité");
    }
    
    // Générer les propriétés
    const properties = [];
    for (let year = 1; year <= numberOfYears; year++) {
        const unitCount = initialUnitCount + (year - 1) * unitCountIncrement;
        
        // Calculer le prix d'achat en fonction du nombre d'unités
        let purchasePrice;
        if (initialPurchasePrice && year === 1) {
            purchasePrice = initialPurchasePrice;
        } else if (pricePerUnit) {
            purchasePrice = unitCount * pricePerUnit;
        } else {
            // Si aucun n'est spécifié, utiliser une formule basée sur l'initialPurchasePrice
            const basePrice = initialPurchasePrice || 100000 * initialUnitCount;
            purchasePrice = (basePrice / initialUnitCount) * unitCount;
        }
        
        properties.push({
            year,
            purchasePrice,
            unitCount,
            cashflowPerDoor,
            downPaymentPercentage,
            appreciationRate
        });
    }
    
    return {
        numberOfYears,
        targetMonthlyIncome,
        properties
    };
}

module.exports = {
    calculateYearlyAcquisitionStrategy,
    calculateRequiredUnits,
    generateAcquisitionModel
};
