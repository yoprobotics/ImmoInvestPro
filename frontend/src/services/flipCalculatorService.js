import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const flipCalculatorService = {
  // Calcul rapide sans sauvegarde
  calculateFlip: async (flipData) => {
    try {
      const response = await axios.post(`${API_URL}/calculators/flip/calculate`, flipData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Sauvegarde d'un calcul FLIP
  saveFlipCalculation: async (flipData) => {
    try {
      const response = await axios.post(`${API_URL}/calculators/flip`, flipData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Récupération d'un calcul FLIP par ID
  getFlipCalculation: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/calculators/flip/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Mise à jour d'un calcul FLIP existant
  updateFlipCalculation: async (id, flipData) => {
    try {
      const response = await axios.put(`${API_URL}/calculators/flip/${id}`, flipData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Suppression d'un calcul FLIP
  deleteFlipCalculation: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/calculators/flip/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Comparaison de plusieurs scénarios FLIP
  compareFlipScenarios: async (scenarios) => {
    try {
      const response = await axios.post(`${API_URL}/calculators/flip/compare`, { scenarios });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Récupération des calculs FLIP de l'utilisateur
  getUserFlipCalculations: async () => {
    try {
      const response = await axios.get(`${API_URL}/calculators/flip/user`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default flipCalculatorService;