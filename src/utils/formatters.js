/**
 * Formate un montant en devise canadienne
 * @param {number} amount - Le montant à formater
 * @param {boolean} showCents - Si true, affiche les cents, sinon arrondit au dollar près
 * @returns {string} Le montant formaté
 */
export const formatCurrency = (amount, showCents = true) => {
  if (amount === undefined || amount === null) return '$0';
  
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  }).format(amount);
};

/**
 * Formate un nombre en pourcentage
 * @param {number} value - La valeur à formater en pourcentage
 * @param {number} decimalPlaces - Le nombre de décimales à afficher
 * @returns {string} Le pourcentage formaté
 */
export const formatPercentage = (value, decimalPlaces = 2) => {
  if (value === undefined || value === null) return '0 %';
  
  return new Intl.NumberFormat('fr-CA', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value / 100);
};

/**
 * Formate un nombre avec des séparateurs de milliers
 * @param {number} value - La valeur à formater
 * @param {number} decimalPlaces - Le nombre de décimales à afficher
 * @returns {string} Le nombre formaté
 */
export const formatNumber = (value, decimalPlaces = 0) => {
  if (value === undefined || value === null) return '0';
  
  return new Intl.NumberFormat('fr-CA', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
};

/**
 * Convertit une chaîne de caractères en nombre
 * @param {string} value - La chaîne à convertir
 * @returns {number} Le nombre résultant ou 0 si la conversion échoue
 */
export const parseNumber = (value) => {
  if (typeof value !== 'string') return Number(value) || 0;
  
  // Remplacer les séparateurs de milliers et la virgule décimale
  const cleaned = value.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};
