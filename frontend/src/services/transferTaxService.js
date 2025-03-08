/**
 * Service frontend pour le calculateur de taxes de mutation
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Calcule les taxes de mutation (taxe de bienvenue) pour une propriété
 * 
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.propertyValue - Valeur de la propriété (prix d'achat ou évaluation municipale, le plus élevé)
 * @param {string} [params.municipality=''] - Municipalité où se trouve la propriété
 * @param {boolean} [params.isFirstTimeHomeBuyer=false] - Indique si l'acheteur est un premier acheteur (exemption possible)
 * @param {boolean} [params.isFirstHomeInQuebec=false] - Indique si c'est la première propriété au Québec (exemption possible)
 * @param {number} [params.customRatePercentage] - Taux personnalisé (pour les municipalités avec des taux différents)
 * @returns {Promise<Object>} Promesse qui résout avec le résultat du calcul
 */
const calculateTransferTax = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/calculators/transferTax`, params);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du calcul des taxes de mutation:', error);
    throw error;
  }
};

/**
 * Version simplifiée du calcul qui s'exécute localement au lieu d'appeler l'API
 * Utile pour les calculs rapides sans connexion Internet ou pour éviter de surcharger le serveur
 * 
 * @param {Object} params - Paramètres pour le calcul, identiques à la version API
 * @returns {Object} Résultat du calcul (simplifié par rapport à la version API)
 */
const calculateTransferTaxLocal = (params) => {
  const { 
    propertyValue, 
    municipality = '',
    isFirstTimeHomeBuyer = false,
    isFirstHomeInQuebec = false
  } = params;

  if (!propertyValue || propertyValue <= 0) {
    throw new Error('La valeur de la propriété doit être supérieure à 0');
  }

  // Vérification si la propriété est à Montréal (simplifié)
  const isMontrealProperty = municipality.toLowerCase().includes('montréal') || 
                           municipality.toLowerCase().includes('montreal');
  
  // Tranches standard
  let totalTax = 0;
  
  // Première tranche (0-53700)
  if (propertyValue > 0) {
    const firstBracketAmount = Math.min(propertyValue, 53700);
    totalTax += firstBracketAmount * 0.005; // 0.5%
  }
  
  // Deuxième tranche (53700-269200)
  if (propertyValue > 53700) {
    const secondBracketAmount = Math.min(propertyValue, 269200) - 53700;
    totalTax += secondBracketAmount * 0.01; // 1.0%
  }
  
  // Troisième tranche (269200+)
  if (propertyValue > 269200) {
    // Si propriété à Montréal et valeur > 500000, appliquer les tranches spécifiques à Montréal
    if (isMontrealProperty && propertyValue > 500000) {
      // Troisième tranche (269200-500000)
      const thirdBracketAmount = 500000 - 269200;
      totalTax += thirdBracketAmount * 0.015; // 1.5%
      
      // Quatrième tranche (500000-1000000)
      if (propertyValue > 500000) {
        const fourthBracketAmount = Math.min(propertyValue, 1000000) - 500000;
        totalTax += fourthBracketAmount * 0.02; // 2.0%
      }
      
      // Cinquième tranche (1000000+)
      if (propertyValue > 1000000) {
        const fifthBracketAmount = propertyValue - 1000000;
        totalTax += fifthBracketAmount * 0.025; // 2.5%
      }
    } else {
      // Hors Montréal ou < 500000, appliquer seulement la troisième tranche standard
      const thirdBracketAmount = propertyValue - 269200;
      totalTax += thirdBracketAmount * 0.015; // 1.5%
    }
  }
  
  // Exemptions (Montréal uniquement)
  let exemptionAmount = 0;
  if (isMontrealProperty && (isFirstTimeHomeBuyer || isFirstHomeInQuebec)) {
    exemptionAmount = Math.min(totalTax, 5000);
  }
  
  return {
    transferTaxTotal: Math.round((totalTax - exemptionAmount) * 100) / 100,
    isMontrealProperty,
    propertyValue,
    municipality
  };
};

// Exporter le service
export default {
  calculateTransferTax,
  calculateTransferTaxLocal
};
