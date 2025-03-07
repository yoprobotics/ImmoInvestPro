/**
 * Utilitaires pour le formatage des nombres et des dates
 */

/**
 * Formate un nombre avec des espaces comme séparateurs de milliers (format canadien)
 * @param {number|string} number - Le nombre à formater
 * @returns {string} Le nombre formaté
 */
export const formatNumberWithSpaces = (number) => {
  if (number === null || number === undefined) return '0';
  
  // Convertir en chaîne si ce n'est pas déjà le cas
  const numStr = typeof number === 'string' ? number : number.toString();
  
  // Séparer la partie entière et la partie décimale
  const parts = numStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
  
  // Formater la partie entière avec des espaces comme séparateurs de milliers
  return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + decimalPart;
};

/**
 * Formate un montant en dollars canadiens
 * @param {number|string} amount - Le montant à formater
 * @param {boolean} includeDecimal - Inclure les décimales
 * @returns {string} Le montant formaté
 */
export const formatCurrency = (amount, includeDecimal = true) => {
  if (amount === null || amount === undefined) return '0 $';
  
  // Convertir en nombre
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Formater le nombre
  const formatter = new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: includeDecimal ? 2 : 0,
    maximumFractionDigits: includeDecimal ? 2 : 0
  });
  
  return formatter.format(numAmount);
};

/**
 * Formate un pourcentage
 * @param {number|string} percent - Le pourcentage à formater
 * @param {number} decimals - Le nombre de décimales à afficher
 * @returns {string} Le pourcentage formaté
 */
export const formatPercent = (percent, decimals = 2) => {
  if (percent === null || percent === undefined) return '0 %';
  
  // Convertir en nombre
  const numPercent = typeof percent === 'string' ? parseFloat(percent) : percent;
  
  // Formater le pourcentage
  return numPercent.toFixed(decimals) + ' %';
};

/**
 * Formate une date au format canadien
 * @param {Date|string} date - La date à formater
 * @returns {string} La date formatée
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  // Convertir en objet Date si c'est une chaîne
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Formater la date (YYYY-MM-DD)
  return dateObj.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Formate un numéro de téléphone au format canadien
 * @param {string} phone - Le numéro de téléphone à formater
 * @returns {string} Le numéro de téléphone formaté
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Nettoyer le numéro de téléphone (garder seulement les chiffres)
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Vérifier la longueur
  if (cleaned.length < 10) return phone;
  
  // Formater le numéro (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phone;
};

/**
 * Formate un code postal canadien
 * @param {string} postalCode - Le code postal à formater
 * @returns {string} Le code postal formaté
 */
export const formatPostalCode = (postalCode) => {
  if (!postalCode) return '';
  
  // Nettoyer le code postal (supprimer les espaces)
  const cleaned = postalCode.replace(/\s+/g, '');
  
  // Si la longueur est au moins 6 caractères, ajouter un espace au milieu
  if (cleaned.length >= 6) {
    return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
  }
  
  return postalCode;
};