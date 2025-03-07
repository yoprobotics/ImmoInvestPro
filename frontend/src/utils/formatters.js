/**
 * Utilitaires de formatage pour l'affichage des données
 */

/**
 * Formate un nombre avec des espaces comme séparateurs de milliers
 * @param {number} number - Le nombre à formater
 * @param {number} decimals - Le nombre de décimales à afficher (par défaut: 2)
 * @returns {string} Le nombre formaté
 */
export const formatNumberWithSpaces = (number, decimals = 2) => {
  if (number === undefined || number === null) return '0';
  
  // Convertir en nombre si nécessaire
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  // Arrondir à X décimales
  const rounded = decimals ? num.toFixed(decimals) : Math.round(num).toString();
  
  // Séparer la partie entière et la partie décimale
  const parts = rounded.toString().split('.');
  
  // Formatter la partie entière avec des espaces
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  // Reconstituer le nombre avec les décimales si nécessaire
  return parts.join('.');
};

/**
 * Formate un montant en devise canadienne
 * @param {number} amount - Le montant à formater
 * @param {number} decimals - Le nombre de décimales à afficher (par défaut: 2)
 * @returns {string} Le montant formaté
 */
export const formatCurrency = (amount, decimals = 2) => {
  if (amount === undefined || amount === null) return '0 $';
  
  return `${formatNumberWithSpaces(amount, decimals)} $`;
};

/**
 * Formate un pourcentage
 * @param {number} value - La valeur à formater
 * @param {number} decimals - Le nombre de décimales à afficher (par défaut: 2)
 * @returns {string} Le pourcentage formaté
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === undefined || value === null) return '0 %';
  
  return `${formatNumberWithSpaces(value, decimals)} %`;
};

/**
 * Formate un taux d'intérêt
 * @param {number} rate - Le taux à formater
 * @returns {string} Le taux formaté
 */
export const formatInterestRate = (rate) => {
  return formatPercentage(rate);
};

/**
 * Formate une date au format JJ/MM/AAAA
 * @param {Date|string} date - La date à formater
 * @returns {string} La date formatée
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formate un code postal canadien (ex: A1A 1A1)
 * @param {string} postalCode - Le code postal à formater
 * @returns {string} Le code postal formaté
 */
export const formatPostalCode = (postalCode) => {
  if (!postalCode) return '';
  
  // Supprimer tous les caractères non alphanumériques
  const cleaned = postalCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  // Si moins de 6 caractères, renvoyer tel quel
  if (cleaned.length < 6) return cleaned;
  
  // Formater avec un espace au milieu
  return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)}`;
};

/**
 * Formate un numéro de téléphone canadien (ex: (514) 123-4567)
 * @param {string} phone - Le numéro à formater
 * @returns {string} Le numéro formaté
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Si moins de 10 chiffres, renvoyer tel quel
  if (cleaned.length < 10) return cleaned;
  
  // Formater: (XXX) XXX-XXXX
  return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
};

/**
 * Tronque un texte et ajoute des points de suspension si nécessaire
 * @param {string} text - Le texte à tronquer
 * @param {number} maxLength - La longueur maximale
 * @returns {string} Le texte tronqué
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Convertit une valeur en dollars américains en dollars canadiens
 * @param {number} usdAmount - Montant en USD
 * @param {number} exchangeRate - Taux de change (par défaut: 1.3)
 * @returns {number} Montant en CAD
 */
export const usdToCad = (usdAmount, exchangeRate = 1.3) => {
  return usdAmount * exchangeRate;
};

/**
 * Arrondit un nombre à un multiple spécifié
 * @param {number} value - La valeur à arrondir
 * @param {number} multiple - Le multiple (par défaut: 100)
 * @returns {number} La valeur arrondie
 */
export const roundToMultiple = (value, multiple = 100) => {
  return Math.round(value / multiple) * multiple;
};

/**
 * Calcule les taxes à partir d'un montant (TPS + TVQ au Québec)
 * @param {number} amount - Le montant avant taxes
 * @param {number} tps - Le taux de TPS (par défaut: 5%)
 * @param {number} tvq - Le taux de TVQ (par défaut: 9.975%)
 * @returns {Object} Les montants de taxes et le total
 */
export const calculateTaxes = (amount, tps = 5, tvq = 9.975) => {
  const tpsAmount = amount * (tps / 100);
  const tvqAmount = amount * (tvq / 100);
  const total = amount + tpsAmount + tvqAmount;
  
  return {
    amountBeforeTaxes: amount,
    tps: tpsAmount,
    tvq: tvqAmount,
    total
  };
};