import api from './api';

/**
 * Calcule une stratégie d'acquisition d'un immeuble par an
 * @param {Object} data - Données contenant les paramètres de la stratégie
 * @returns {Promise} - Promesse résolue avec les résultats de la projection
 */
export const calculateYearlyAcquisitionStrategy = async (data) => {
  try {
    const response = await api.post('/calculators/yearly-acquisition-strategy', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating yearly acquisition strategy:', error);
    throw error;
  }
};

/**
 * Calcule le nombre d'unités (portes) nécessaires pour atteindre un revenu cible
 * @param {Object} data - Données contenant le revenu cible et le cashflow par porte
 * @returns {Promise} - Promesse résolue avec le nombre d'unités requises
 */
export const calculateRequiredUnits = async (data) => {
  try {
    const response = await api.post('/calculators/required-units', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating required units:', error);
    throw error;
  }
};

/**
 * Génère un modèle d'acquisition basé sur les paramètres spécifiés
 * @param {Object} data - Paramètres pour créer le modèle d'acquisition
 * @returns {Promise} - Promesse résolue avec le modèle d'acquisition généré
 */
export const generateAcquisitionModel = async (data) => {
  try {
    const response = await api.post('/calculators/generate-acquisition-model', data);
    return response.data;
  } catch (error) {
    console.error('Error generating acquisition model:', error);
    throw error;
  }
};
