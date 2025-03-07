/**
 * Utilitaires de formatage des nombres et des dates
 */

/**
 * Formate un nombre avec des espaces comme séparateurs de milliers
 * @param {number} number Nombre à formater
 * @param {number} decimals Nombre de décimales à conserver (par défaut 0)
 * @returns {string} Nombre formaté
 */
export const formatNumberWithSpaces = (number, decimals = 0) => {
  if (number === undefined || number === null) return '';
  
  // Arrondir le nombre au nombre de décimales demandé
  const roundedNumber = typeof number === 'number' ? 
    Number(number.toFixed(decimals)) : 
    Number(parseFloat(number).toFixed(decimals));
  
  // Formater avec des espaces comme séparateurs de milliers
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

/**
 * Formate un montant monétaire
 * @param {number} amount Montant à formater
 * @param {string} currency Symbole de la devise (par défaut '$')
 * @param {number} decimals Nombre de décimales à conserver (par défaut 0)
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount, currency = '$', decimals = 0) => {
  if (amount === undefined || amount === null) return '';
  
  return `${formatNumberWithSpaces(amount, decimals)} ${currency}`;
};

/**
 * Formate un pourcentage
 * @param {number} value Valeur à formater
 * @param {number} decimals Nombre de décimales à conserver (par défaut 2)
 * @returns {string} Pourcentage formaté
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === undefined || value === null) return '';
  
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Formate une date en format lisible
 * @param {Date|string} date Date à formater
 * @param {string} locale Locale à utiliser (par défaut 'fr-CA')
 * @returns {string} Date formatée
 */
export const formatDate = (date, locale = 'fr-CA') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formate un numéro de téléphone au format nord-américain
 * @param {string} phoneNumber Numéro de téléphone à formater
 * @returns {string} Numéro formaté
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Supprimer tous les caractères non numériques
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Format nord-américain: (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
};

/**
 * Formate un code postal canadien
 * @param {string} postalCode Code postal à formater
 * @returns {string} Code postal formaté
 */
export const formatPostalCode = (postalCode) => {
  if (!postalCode) return '';
  
  // Supprimer tous les espaces
  const cleaned = postalCode.replace(/\s/g, '');
  
  // Format canadien: A1A 1A1
  if (cleaned.length === 6) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`.toUpperCase();
  }
  
  return postalCode.toUpperCase();
};