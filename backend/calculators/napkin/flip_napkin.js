/**
 * Calculateur Napkin FLIP (FIP10)
 * 
 * Implémentation de la méthode rapide d'évaluation FIP10 pour les projets de FLIP immobilier.
 * Cette méthode permet d'estimer rapidement la rentabilité potentielle d'un projet de rénovation-revente.
 * 
 * Basé sur la méthode enseignée dans la formation professionnelle d'investissement immobilier.
 */

/**
 * Calcule le profit estimé d'un projet FLIP en utilisant la méthode FIP10
 * 
 * @param {number} prixFinal - Prix de revente estimé après travaux
 * @param {number} prixInitial - Prix d'achat initial
 * @param {number} prixRenos - Coût estimé des rénovations
 * @returns {object} Résultat contenant le profit estimé et les détails du calcul
 */
function calculerProfitFIP10(prixFinal, prixInitial, prixRenos) {
    // Validation des entrées
    if (!prixFinal || !prixInitial || prixRenos === undefined) {
        throw new Error('Tous les paramètres sont requis: prixFinal, prixInitial, prixRenos');
    }

    // Conversion en nombres si nécessaire
    prixFinal = Number(prixFinal);
    prixInitial = Number(prixInitial);
    prixRenos = Number(prixRenos);

    // Validation des valeurs
    if (isNaN(prixFinal) || isNaN(prixInitial) || isNaN(prixRenos)) {
        throw new Error('Tous les paramètres doivent être des nombres valides');
    }

    // Calcul du 10% de la valeur de revente (couvre frais d'acquisition, frais de possession, etc.)
    const fraisDix = prixFinal * 0.1;

    // Calcul du profit selon formule FIP10
    const profit = prixFinal - prixInitial - prixRenos - fraisDix;

    // Préparation du résultat détaillé
    const resultat = {
        profit: profit,
        detailsCalcul: {
            prixFinal: prixFinal,
            prixInitial: prixInitial,
            prixRenos: prixRenos,
            fraisDix: fraisDix
        },
        estRentable: profit >= 25000, // Seuil recommandé dans la formation
        pourcentageProfit: (profit / (prixInitial + prixRenos)) * 100
    };

    return resultat;
}

/**
 * Calcule le prix d'achat maximal recommandé pour atteindre un profit cible
 * 
 * @param {number} prixFinal - Prix de revente estimé après travaux
 * @param {number} prixRenos - Coût estimé des rénovations
 * @param {number} profitCible - Profit minimum désiré (par défaut 25000$)
 * @returns {object} Résultat contenant le prix d'achat maximal recommandé
 */
function calculerPrixAchatMaximal(prixFinal, prixRenos, profitCible = 25000) {
    // Validation des entrées
    if (!prixFinal || prixRenos === undefined) {
        throw new Error('Les paramètres prixFinal et prixRenos sont requis');
    }

    // Conversion en nombres si nécessaire
    prixFinal = Number(prixFinal);
    prixRenos = Number(prixRenos);
    profitCible = Number(profitCible);

    // Validation des valeurs
    if (isNaN(prixFinal) || isNaN(prixRenos) || isNaN(profitCible)) {
        throw new Error('Tous les paramètres doivent être des nombres valides');
    }

    // Calcul du 10% de la valeur de revente
    const fraisDix = prixFinal * 0.1;

    // Calcul du prix d'achat maximal selon la formule inversée
    const prixAchatMaximal = prixFinal - prixRenos - fraisDix - profitCible;

    // Préparation du résultat détaillé
    const resultat = {
        prixAchatMaximal: prixAchatMaximal,
        detailsCalcul: {
            prixFinal: prixFinal,
            prixRenos: prixRenos,
            fraisDix: fraisDix,
            profitCible: profitCible
        },
        estRealisable: prixAchatMaximal > 0,
        ecartPrixMarche: null // À remplir si un prix de marché est fourni ultérieurement
    };

    return resultat;
}

/**
 * Estime les rénovations maximales possibles pour un profit cible et des prix donnés
 * 
 * @param {number} prixFinal - Prix de revente estimé après travaux
 * @param {number} prixInitial - Prix d'achat initial
 * @param {number} profitCible - Profit minimum désiré (par défaut 25000$)
 * @returns {object} Résultat contenant le budget de rénovation maximal recommandé
 */
function calculerRenosMaximales(prixFinal, prixInitial, profitCible = 25000) {
    // Validation des entrées
    if (!prixFinal || !prixInitial) {
        throw new Error('Les paramètres prixFinal et prixInitial sont requis');
    }

    // Conversion en nombres si nécessaire
    prixFinal = Number(prixFinal);
    prixInitial = Number(prixInitial);
    profitCible = Number(profitCible);

    // Validation des valeurs
    if (isNaN(prixFinal) || isNaN(prixInitial) || isNaN(profitCible)) {
        throw new Error('Tous les paramètres doivent être des nombres valides');
    }

    // Calcul du 10% de la valeur de revente
    const fraisDix = prixFinal * 0.1;

    // Calcul du budget maximal de rénovation
    const renosMaximales = prixFinal - prixInitial - fraisDix - profitCible;

    // Préparation du résultat détaillé
    const resultat = {
        renosMaximales: renosMaximales,
        detailsCalcul: {
            prixFinal: prixFinal,
            prixInitial: prixInitial,
            fraisDix: fraisDix,
            profitCible: profitCible
        },
        estRealisable: renosMaximales > 0,
        pourcentagePrixRevente: (renosMaximales / prixFinal) * 100
    };

    return resultat;
}

// Exportation des fonctions pour utilisation dans l'application
module.exports = {
    calculerProfitFIP10,
    calculerPrixAchatMaximal,
    calculerRenosMaximales
};
