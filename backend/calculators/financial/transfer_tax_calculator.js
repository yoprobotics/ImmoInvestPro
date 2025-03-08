/**
 * Calculateur de taxes de mutation (taxe de bienvenue) au Québec
 * Basé sur le fichier "Calculateur Taxes de mutation v1.0.xls"
 * 
 * Ce calculateur permet de calculer les taxes de mutation (aussi appelées taxe de bienvenue)
 * qui sont payables lors de l'acquisition d'une propriété au Québec.
 */

/**
 * Constantes pour le calcul des taxes de mutation
 * Les montants et taux peuvent changer selon les années. Ces valeurs sont pour 2023-2024.
 */
const TRANSFER_TAX_BRACKETS = [
  { min: 0, max: 53700, rate: 0.005 },            // 0.5% pour la première tranche
  { min: 53700, max: 269200, rate: 0.01 },        // 1.0% pour la deuxième tranche
  { min: 269200, max: 500000, rate: 0.015 },      // 1.5% pour la troisième tranche
  { min: 500000, max: 1000000, rate: 0.02 },      // 2.0% pour la quatrième tranche (Montréal)
  { min: 1000000, max: Infinity, rate: 0.025 }    // 2.5% pour la cinquième tranche (Montréal)
];

/**
 * Vérifie si la municipalité est à Montréal 
 * Montréal a des taux différents pour les tranches supérieures
 * 
 * @param {string} municipality - Nom de la municipalité
 * @returns {boolean} - True si la municipalité est à Montréal
 */
const isMontreal = (municipality) => {
  if (!municipality) return false;
  
  const montrealRegions = [
    'montréal', 'montreal', 'anjou', 'baie-d\'urfé', 'beaconsfield', 'côte-des-neiges', 
    'côte-saint-luc', 'dollard-des-ormeaux', 'dorval', 'hampstead', 'kirkland', 
    'lachine', 'lasalle', 'le plateau-mont-royal', 'le sud-ouest', 'l\'île-bizard', 
    'mercier', 'mont-royal', 'montréal-est', 'montréal-nord', 'montréal-ouest', 
    'outremont', 'pierrefonds', 'pointe-claire', 'rivière-des-prairies', 'roxboro', 
    'saint-laurent', 'saint-léonard', 'sainte-anne-de-bellevue', 'sainte-geneviève', 
    'senneville', 'verdun', 'ville-marie', 'villeray', 'westmount', 'ahuntsic', 'cartierville'
  ];
  
  return montrealRegions.some(region => 
    municipality.toLowerCase().includes(region.toLowerCase())
  );
};

/**
 * Calcule les taxes de mutation (taxe de bienvenue) pour une propriété
 * 
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.propertyValue - Valeur de la propriété (prix d'achat ou évaluation municipale, le plus élevé)
 * @param {string} [params.municipality=''] - Municipalité où se trouve la propriété
 * @param {boolean} [params.isFirstTimeHomeBuyer=false] - Indique si l'acheteur est un premier acheteur (exemption possible)
 * @param {boolean} [params.isFirstHomeInQuebec=false] - Indique si c'est la première propriété au Québec (exemption possible)
 * @param {number} [params.customRatePercentage] - Taux personnalisé (pour les municipalités avec des taux différents)
 * @returns {Object} Résultat du calcul avec détails par tranche
 */
const calculateTransferTax = (params) => {
  const { 
    propertyValue, 
    municipality = '',
    isFirstTimeHomeBuyer = false,
    isFirstHomeInQuebec = false,
    customRatePercentage = null
  } = params;

  if (!propertyValue || propertyValue <= 0) {
    throw new Error('La valeur de la propriété doit être supérieure à 0');
  }

  // Détermine si des taux spéciaux de Montréal s'appliquent
  const isMontrealProperty = isMontreal(municipality);
  
  // Si un taux personnalisé est fourni, on l'utilise (certaines municipalités ont des taux différents)
  const brackets = customRatePercentage 
    ? [{ min: 0, max: Infinity, rate: customRatePercentage / 100 }]
    : isMontrealProperty 
      ? TRANSFER_TAX_BRACKETS 
      : TRANSFER_TAX_BRACKETS.slice(0, 3); // Utiliser seulement les 3 premières tranches hors Montréal
  
  // Calcul du montant par tranche
  let totalTax = 0;
  const details = [];
  
  brackets.forEach(bracket => {
    if (propertyValue > bracket.min) {
      const valueInBracket = Math.min(propertyValue, bracket.max) - bracket.min;
      const taxForBracket = valueInBracket * bracket.rate;
      
      details.push({
        min: bracket.min,
        max: bracket.max,
        rate: bracket.rate * 100, // Convertir en pourcentage pour l'affichage
        amountInBracket: valueInBracket,
        taxAmount: taxForBracket
      });
      
      totalTax += taxForBracket;
    }
  });

  // Vérifier les exemptions possibles (pour Montréal seulement)
  let exemptionAmount = 0;
  let exemptionReason = '';
  
  if (isMontrealProperty && (isFirstTimeHomeBuyer || isFirstHomeInQuebec)) {
    // Montréal offre une exemption pour les premiers acheteurs jusqu'à concurrence de 5000$
    // La formule peut varier, ici c'est une implémentation simplifiée
    exemptionAmount = Math.min(totalTax, 5000);
    exemptionReason = isFirstTimeHomeBuyer 
      ? 'Exemption pour premier acheteur'
      : 'Exemption pour première propriété au Québec';
  }

  return {
    transferTaxTotal: totalTax - exemptionAmount,
    details,
    exemption: {
      amount: exemptionAmount,
      reason: exemptionReason
    },
    municipality: municipality,
    propertyValue: propertyValue,
    isMontrealProperty: isMontrealProperty
  };
};

module.exports = {
  calculateTransferTax,
  isMontreal
};
