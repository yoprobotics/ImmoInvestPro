/**
 * Fonctions utilitaires pour les calculs du calculateur d'estimation des rénovations
 */

import { BASELINE_COSTS } from './constants';

/**
 * Calcule le coût total pour un élément de rénovation
 * @param {Object} element - L'élément de rénovation
 * @returns {Number} - Le coût total de l'élément
 */
export const calculateElementCost = (element) => {
  return element.quantity * element.unitPrice;
};

/**
 * Calcule le coût total pour une pièce
 * @param {Object} room - La pièce avec ses éléments
 * @returns {Number} - Le coût total de la pièce
 */
export const calculateRoomCost = (room) => {
  if (!room.elements || room.elements.length === 0) {
    return 0;
  }
  
  return room.elements.reduce((total, element) => {
    return total + calculateElementCost(element);
  }, 0);
};

/**
 * Calcule le coût total de toutes les rénovations
 * @param {Array} rooms - Liste des pièces
 * @returns {Number} - Le coût total des rénovations
 */
export const calculateTotalRenovationCost = (rooms) => {
  if (!rooms || rooms.length === 0) {
    return 0;
  }
  
  return rooms.reduce((total, room) => {
    return total + calculateRoomCost(room);
  }, 0);
};

/**
 * Calcule le montant de la contingence
 * @param {Number} totalCost - Coût total des rénovations
 * @param {Number} contingencyPercentage - Pourcentage de contingence
 * @returns {Number} - Montant de la contingence
 */
export const calculateContingencyAmount = (totalCost, contingencyPercentage) => {
  return totalCost * (contingencyPercentage / 100);
};

/**
 * Calcule le grand total des rénovations incluant la contingence
 * @param {Number} totalCost - Coût total des rénovations
 * @param {Number} contingencyAmount - Montant de la contingence
 * @returns {Number} - Grand total
 */
export const calculateGrandTotal = (totalCost, contingencyAmount) => {
  return totalCost + contingencyAmount;
};

/**
 * Suggère un coût unitaire pour un élément de pièce particulier
 * @param {String} roomType - Type de pièce
 * @param {String} elementType - Type d'élément
 * @returns {Number} - Coût unitaire suggéré
 */
export const suggestUnitPrice = (roomType, elementType) => {
  // Par défaut, on utilise la méthode des 500$
  let suggested = 500;
  
  // Exceptions basées sur le type de pièce
  switch(roomType) {
    case 'Cuisine':
      if (elementType === 'Armoires' || elementType === 'Comptoir' || elementType === 'Électroménagers') {
        suggested = BASELINE_COSTS.KITCHEN / 3;
      }
      break;
    case 'Salle de bain':
      if (elementType === 'Plomberie' || elementType === 'Accessoires salle de bain') {
        suggested = BASELINE_COSTS.BATHROOM / 3;
      }
      break;
    case 'Plancher':
      suggested = BASELINE_COSTS.FLOOR_PER_SQFT;
      break;
    case 'Peinture':
      suggested = BASELINE_COSTS.PAINT_PER_GALLON;
      break;
    case 'Porte extérieure':
      suggested = BASELINE_COSTS.EXTERIOR_DOOR;
      break;
    case 'Fenêtre salon':
      suggested = BASELINE_COSTS.LIVING_ROOM_WINDOW;
      break;
    case 'Fenêtre chambre':
      suggested = BASELINE_COSTS.BEDROOM_WINDOW;
      break;
    default:
      suggested = 500; // Méthode des 500$
  }
  
  return suggested;
};

/**
 * Génère un identifiant unique
 * @returns {String} - ID unique
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Formate un nombre en devise canadienne
 * @param {Number} value - Valeur à formater
 * @returns {String} - Valeur formatée
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
