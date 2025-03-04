/**
 * Calculateur Napkin MULTI (PAR)
 * 
 * Implémentation de la méthode rapide d'évaluation PAR pour les immeubles à revenus.
 * Cette méthode permet d'estimer rapidement le cashflow mensuel par porte d'un immeuble locatif.
 * 
 * Basé sur la méthode enseignée dans la formation professionnelle d'investissement immobilier.
 */

/**
 * Calcule le cashflow mensuel par porte d'un immeuble à revenus
 * en utilisant la méthode PAR (Prix, Appartements, Revenus)
 * 
 * @param {number} prixAchat - Prix d'achat de l'immeuble
 * @param {number} nombreAppartements - Nombre d'unités locatives (portes)
 * @param {number} revenusBruts - Revenus bruts annuels totaux
 * @returns {object} Résultat contenant le cashflow par porte et les détails du calcul
 */
function calculerCashflowPAR(prixAchat, nombreAppartements, revenusBruts) {
    // Validation des entrées
    if (!prixAchat || !nombreAppartements || !revenusBruts) {
        throw new Error('Tous les paramètres sont requis: prixAchat, nombreAppartements, revenusBruts');
    }

    // Conversion en nombres si nécessaire
    prixAchat = Number(prixAchat);
    nombreAppartements = Number(nombreAppartements);
    revenusBruts = Number(revenusBruts);

    // Validation des valeurs
    if (isNaN(prixAchat) || isNaN(nombreAppartements) || isNaN(revenusBruts)) {
        throw new Error('Tous les paramètres doivent être des nombres valides');
    }
    if (nombreAppartements <= 0) {
        throw new Error('Le nombre d\'appartements doit être supérieur à zéro');
    }

    // Détermination du pourcentage des revenus pour les dépenses selon le nombre d'unités
    let pourcentageDependant;
    if (nombreAppartements <= 2) {
        pourcentageDependant = 0.30; // 30% pour 1-2 logements
    } else if (nombreAppartements <= 4) {
        pourcentageDependant = 0.35; // 35% pour 3-4 logements
    } else if (nombreAppartements <= 6) {
        pourcentageDependant = 0.45; // 45% pour 5-6 logements
    } else {
        pourcentageDependant = 0.50; // 50% pour 7+ logements
    }

    // Calcul des dépenses d'opération
    const depensesOperation = revenusBruts * pourcentageDependant;

    // Calcul des revenus nets d'opérations (RNO)
    const rno = revenusBruts - depensesOperation;

    // Calcul du paiement hypothécaire (méthode HIGH-5)
    const paiementHypothecaireMensuel = prixAchat * 0.005; // 0.5% du prix d'achat
    const paiementHypothecaireAnnuel = paiementHypothecaireMensuel * 12;

    // Calcul du cashflow annuel total
    const cashflowAnnuel = rno - paiementHypothecaireAnnuel;

    // Calcul du cashflow mensuel par porte
    const cashflowMensuelParPorte = (cashflowAnnuel / 12) / nombreAppartements;

    // Préparation du résultat détaillé
    const resultat = {
        cashflowMensuelParPorte: cashflowMensuelParPorte,
        cashflowAnnuelTotal: cashflowAnnuel,
        detailsCalcul: {
            prixAchat: prixAchat,
            nombreAppartements: nombreAppartements,
            revenusBruts: revenusBruts,
            pourcentageDependant: pourcentageDependant * 100, // Convertir en pourcentage pour l'affichage
            depensesOperation: depensesOperation,
            rno: rno,
            paiementHypothecaireAnnuel: paiementHypothecaireAnnuel
        },
        estRentable: cashflowMensuelParPorte >= 75, // Seuil recommandé dans la formation
        ratioRevenuPrix: revenusBruts / prixAchat // Ratio revenus/prix
    };

    return resultat;
}

/**
 * Calcule le prix d'achat maximal recommandé pour atteindre un cashflow cible par porte
 * 
 * @param {number} nombreAppartements - Nombre d'unités locatives (portes)
 * @param {number} revenusBruts - Revenus bruts annuels totaux
 * @param {number} cashflowCibleParPorte - Cashflow mensuel par porte ciblé (par défaut 75$)
 * @returns {object} Résultat contenant le prix d'achat maximal recommandé
 */
function calculerPrixAchatMaximal(nombreAppartements, revenusBruts, cashflowCibleParPorte = 75) {
    // Validation des entrées
    if (!nombreAppartements || !revenusBruts) {
        throw new Error('Les paramètres nombreAppartements et revenusBruts sont requis');
    }

    // Conversion en nombres si nécessaire
    nombreAppartements = Number(nombreAppartements);
    revenusBruts = Number(revenusBruts);
    cashflowCibleParPorte = Number(cashflowCibleParPorte);

    // Validation des valeurs
    if (isNaN(nombreAppartements) || isNaN(revenusBruts) || isNaN(cashflowCibleParPorte)) {
        throw new Error('Tous les paramètres doivent être des nombres valides');
    }
    if (nombreAppartements <= 0) {
        throw new Error('Le nombre d\'appartements doit être supérieur à zéro');
    }

    // Détermination du pourcentage des revenus pour les dépenses selon le nombre d'unités
    let pourcentageDependant;
    if (nombreAppartements <= 2) {
        pourcentageDependant = 0.30; // 30% pour 1-2 logements
    } else if (nombreAppartements <= 4) {
        pourcentageDependant = 0.35; // 35% pour 3-4 logements
    } else if (nombreAppartements <= 6) {
        pourcentageDependant = 0.45; // 45% pour 5-6 logements
    } else {
        pourcentageDependant = 0.50; // 50% pour 7+ logements
    }

    // Calcul des dépenses d'opération
    const depensesOperation = revenusBruts * pourcentageDependant;

    // Calcul des revenus nets d'opérations (RNO)
    const rno = revenusBruts - depensesOperation;

    // Calcul du cashflow annuel cible
    const cashflowAnnuelCible = cashflowCibleParPorte * 12 * nombreAppartements;

    // Calcul du paiement hypothécaire maximum
    const paiementHypothecaireMaxAnnuel = rno - cashflowAnnuelCible;

    // Calcul du prix d'achat maximal (formule inversée de HIGH-5)
    const prixAchatMaximal = (paiementHypothecaireMaxAnnuel / 12) / 0.005;

    // Préparation du résultat détaillé
    const resultat = {
        prixAchatMaximal: prixAchatMaximal,
        detailsCalcul: {
            nombreAppartements: nombreAppartements,
            revenusBruts: revenusBruts,
            pourcentageDependant: pourcentageDependant * 100, // Convertir en pourcentage pour l'affichage
            depensesOperation: depensesOperation,
            rno: rno,
            cashflowAnnuelCible: cashflowAnnuelCible,
            paiementHypothecaireMaxAnnuel: paiementHypothecaireMaxAnnuel
        },
        estRealisable: prixAchatMaximal > 0,
        ratioRevenuPrix: revenusBruts / prixAchatMaximal // Ratio revenus/prix
    };

    return resultat;
}

/**
 * Calcule le nombre d'unités (portes) nécessaires pour atteindre un revenu de remplacement
 * 
 * @param {number} revenuMensuelCible - Revenu mensuel à remplacer
 * @param {number} cashflowParPorte - Cashflow mensuel par porte (par défaut 75$)
 * @returns {object} Résultat contenant le nombre de portes nécessaires
 */
function calculerPortesNecessaires(revenuMensuelCible, cashflowParPorte = 75) {
    // Validation des entrées
    if (!revenuMensuelCible) {
        throw new Error('Le paramètre revenuMensuelCible est requis');
    }

    // Conversion en nombres si nécessaire
    revenuMensuelCible = Number(revenuMensuelCible);
    cashflowParPorte = Number(cashflowParPorte);

    // Validation des valeurs
    if (isNaN(revenuMensuelCible) || isNaN(cashflowParPorte)) {
        throw new Error('Tous les paramètres doivent être des nombres valides');
    }
    if (cashflowParPorte <= 0) {
        throw new Error('Le cashflow par porte doit être supérieur à zéro');
    }

    // Calcul du nombre de portes nécessaires
    const portesNecessaires = revenuMensuelCible / cashflowParPorte;
    const portesNecessairesArrondies = Math.ceil(portesNecessaires); // Arrondi à l'entier supérieur

    // Préparation du résultat détaillé
    const resultat = {
        portesNecessaires: portesNecessairesArrondies,
        detailsCalcul: {
            revenuMensuelCible: revenuMensuelCible,
            cashflowParPorte: cashflowParPorte,
            portesExactes: portesNecessaires
        },
        revenus: {
            revenuMensuelExact: portesNecessairesArrondies * cashflowParPorte,
            revenuAnnuelExact: portesNecessairesArrondies * cashflowParPorte * 12
        }
    };

    return resultat;
}

// Exportation des fonctions pour utilisation dans l'application
module.exports = {
    calculerCashflowPAR,
    calculerPrixAchatMaximal,
    calculerPortesNecessaires
};
