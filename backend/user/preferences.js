/**
 * Module de gestion des préférences utilisateur
 * 
 * Ce module gère les préférences des utilisateurs:
 * - Type d'investissement préféré (FLIP/MULTI)
 * - Régions d'intérêt
 * - Critères d'investissement personnalisés
 * - Notifications
 */

// Types d'investissement disponibles
const INVESTMENT_TYPES = {
  FLIP: 'FLIP',
  MULTI: 'MULTI'
};

// Catégories de préférences
const PREFERENCE_CATEGORIES = {
  INVESTMENT_TYPE: 'investmentType',
  REGIONS: 'regions',
  DEAL_CRITERIA: 'dealCriteria',
  NOTIFICATIONS: 'notifications',
  UI_SETTINGS: 'uiSettings'
};

/**
 * Récupère toutes les préférences d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @return {Promise<Object>} - Préférences de l'utilisateur
 */
async function getUserPreferences(userId) {
  try {
    // Récupérer les préférences depuis la base de données
    // TODO: Implémenter la récupération
    
    // Exemple de préférences (à remplacer par les données réelles)
    return {
      investmentType: null, // 'FLIP' ou 'MULTI' ou null si non défini
      regions: [], // Régions d'intérêt
      dealCriteria: {
        flip: {
          minProfit: 25000, // Profit minimum visé en dollars
          maxRenovationBudget: 50000, // Budget maximum de rénovation
          maxMonthsToSell: 6 // Nombre maximum de mois pour vendre
        },
        multi: {
          minCashFlowPerDoor: 75, // Cashflow minimum par porte en dollars
          maxPricePerDoor: 100000, // Prix maximum par porte
          minDoors: 2, // Nombre minimum de portes
          maxDoors: 12 // Nombre maximum de portes
        }
      },
      notifications: {
        email: true, // Notifications par email
        push: false, // Notifications push (mobile/web)
        dealAlerts: true, // Alertes de nouvelles opportunités
        marketUpdates: false // Mises à jour du marché
      },
      uiSettings: {
        theme: 'light', // Thème de l'interface: 'light' ou 'dark'
        dashboardLayout: 'grid', // Disposition du tableau de bord: 'grid' ou 'list'
        defaultCalculator: 'napkin' // Calculateur par défaut: 'napkin' ou 'detailed'
      }
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des préférences:", error);
    throw error;
  }
}

/**
 * Récupère une catégorie spécifique de préférences
 * @param {string} userId - ID de l'utilisateur
 * @param {string} category - Catégorie de préférences
 * @return {Promise<Object>} - Préférences de la catégorie demandée
 */
async function getPreferenceCategory(userId, category) {
  try {
    if (!Object.values(PREFERENCE_CATEGORIES).includes(category)) {
      throw new Error(`Catégorie de préférences invalide: ${category}`);
    }
    
    const preferences = await getUserPreferences(userId);
    return preferences[category] || {};
  } catch (error) {
    console.error(`Erreur lors de la récupération des préférences (${category}):`, error);
    throw error;
  }
}

/**
 * Met à jour les préférences d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} preferencesData - Nouvelles préférences
 * @return {Promise<Object>} - Résultat de la mise à jour
 */
async function updateUserPreferences(userId, preferencesData) {
  try {
    // Valider les préférences
    validatePreferences(preferencesData);
    
    // Mettre à jour les préférences dans la base de données
    // TODO: Implémenter la mise à jour
    
    return {
      success: true,
      message: "Préférences mises à jour avec succès."
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des préférences:", error);
    return {
      success: false,
      message: error.message || "Une erreur est survenue lors de la mise à jour des préférences."
    };
  }
}

/**
 * Met à jour une catégorie spécifique de préférences
 * @param {string} userId - ID de l'utilisateur
 * @param {string} category - Catégorie de préférences
 * @param {Object} categoryData - Nouvelles données pour la catégorie
 * @return {Promise<Object>} - Résultat de la mise à jour
 */
async function updatePreferenceCategory(userId, category, categoryData) {
  try {
    if (!Object.values(PREFERENCE_CATEGORIES).includes(category)) {
      throw new Error(`Catégorie de préférences invalide: ${category}`);
    }
    
    // Récupérer les préférences actuelles
    const currentPreferences = await getUserPreferences(userId);
    
    // Mettre à jour uniquement la catégorie spécifiée
    const updatedPreferences = {
      ...currentPreferences,
      [category]: categoryData
    };
    
    // Valider et enregistrer les préférences mises à jour
    return await updateUserPreferences(userId, updatedPreferences);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour des préférences (${category}):`, error);
    return {
      success: false,
      message: error.message || `Une erreur est survenue lors de la mise à jour des préférences (${category}).`
    };
  }
}

/**
 * Valide les données de préférences
 * @param {Object} preferencesData - Données à valider
 * @throws {Error} Si les données sont invalides
 */
function validatePreferences(preferencesData) {
  // Valider le type d'investissement s'il est défini
  if (preferencesData.investmentType &&
      !Object.values(INVESTMENT_TYPES).includes(preferencesData.investmentType)) {
    throw new Error("Type d'investissement invalide. Doit être 'FLIP' ou 'MULTI'");
  }
  
  // Valider les critères de FLIP s'ils sont définis
  if (preferencesData.dealCriteria?.flip) {
    const { minProfit, maxRenovationBudget, maxMonthsToSell } = preferencesData.dealCriteria.flip;
    
    if (minProfit !== undefined && (typeof minProfit !== 'number' || minProfit < 0)) {
      throw new Error("Le profit minimum doit être un nombre positif");
    }
    
    if (maxRenovationBudget !== undefined && (typeof maxRenovationBudget !== 'number' || maxRenovationBudget < 0)) {
      throw new Error("Le budget maximum de rénovation doit être un nombre positif");
    }
    
    if (maxMonthsToSell !== undefined && (typeof maxMonthsToSell !== 'number' || maxMonthsToSell <= 0)) {
      throw new Error("Le nombre maximum de mois pour vendre doit être un nombre positif");
    }
  }
  
  // Valider les critères de MULTI s'ils sont définis
  if (preferencesData.dealCriteria?.multi) {
    const { minCashFlowPerDoor, maxPricePerDoor, minDoors, maxDoors } = preferencesData.dealCriteria.multi;
    
    if (minCashFlowPerDoor !== undefined && (typeof minCashFlowPerDoor !== 'number' || minCashFlowPerDoor < 0)) {
      throw new Error("Le cashflow minimum par porte doit être un nombre positif");
    }
    
    if (maxPricePerDoor !== undefined && (typeof maxPricePerDoor !== 'number' || maxPricePerDoor < 0)) {
      throw new Error("Le prix maximum par porte doit être un nombre positif");
    }
    
    if (minDoors !== undefined && (typeof minDoors !== 'number' || minDoors <= 0 || !Number.isInteger(minDoors))) {
      throw new Error("Le nombre minimum de portes doit être un nombre entier positif");
    }
    
    if (maxDoors !== undefined && (typeof maxDoors !== 'number' || maxDoors <= 0 || !Number.isInteger(maxDoors))) {
      throw new Error("Le nombre maximum de portes doit être un nombre entier positif");
    }
    
    if (minDoors && maxDoors && minDoors > maxDoors) {
      throw new Error("Le nombre minimum de portes doit être inférieur au nombre maximum");
    }
  }
}

module.exports = {
  INVESTMENT_TYPES,
  PREFERENCE_CATEGORIES,
  getUserPreferences,
  getPreferenceCategory,
  updateUserPreferences,
  updatePreferenceCategory
};
