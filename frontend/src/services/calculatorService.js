import api from './api';

/**
 * Calculates detailed MULTI metrics using the backend calculator
 * @param {Object} data - Data containing scenario information
 * @returns {Promise} - Promise that resolves to the calculation results
 */
export const calculateMultiDetailed = async (data) => {
  try {
    const response = await api.post('/calculators/multi-detailed', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating multi details:', error);
    throw error;
  }
};

/**
 * Calculates detailed FLIP metrics using the backend calculator
 * @param {Object} data - Data containing scenario information
 * @returns {Promise} - Promise that resolves to the calculation results
 */
export const calculateFlipDetailed = async (data) => {
  try {
    const response = await api.post('/calculators/flip-detailed', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating flip details:', error);
    throw error;
  }
};

/**
 * Calculates quick napkin MULTI metrics using the backend calculator
 * @param {Object} data - Data containing PAR information (Price, Apartments, Revenues)
 * @returns {Promise} - Promise that resolves to the calculation results
 */
export const calculateMultiNapkin = async (data) => {
  try {
    const response = await api.post('/calculators/multi-napkin', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating multi napkin:', error);
    throw error;
  }
};

/**
 * Calculates quick napkin FLIP metrics using the backend calculator
 * @param {Object} data - Data containing FIP information (Final price, Initial price, Price of renovations)
 * @returns {Promise} - Promise that resolves to the calculation results
 */
export const calculateFlipNapkin = async (data) => {
  try {
    const response = await api.post('/calculators/flip-napkin', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating flip napkin:', error);
    throw error;
  }
};
