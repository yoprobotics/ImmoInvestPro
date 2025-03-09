document.addEventListener('DOMContentLoaded', function() {
    // Récupération du formulaire et ajout de l'écouteur d'événement
    const form = document.getElementById('abd-atd-form');
    form.addEventListener('submit', calculateRatios);
    
    // Fonction pour formater les montants en dollars canadiens
    function formatCurrency(amount) {
        return new Intl.NumberFormat('fr-CA', { 
            style: 'currency', 
            currency: 'CAD',
            minimumFractionDigits: 2
        }).format(amount);
    }
    
    // Fonction pour formater les pourcentages
    function formatPercentage(percentage) {
        return new Intl.NumberFormat('fr-CA', { 
            style: 'percent', 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        }).format(percentage / 100);
    }
    
    // Fonction principale pour calculer les ratios ABD et ATD
    function calculateRatios(event) {
        event.preventDefault();
        
        // Récupération des valeurs du formulaire
        const formData = {
            // Revenus
            revenuAnnuel: parseFloat(document.getElementById('revenu-annuel').value) || 0,
            revenuConjoint: parseFloat(document.getElementById('revenu-conjoint').value) || 0,
            allocationsFamiliales: parseFloat(document.getElementById('allocations-familiales').value) || 0,
            pensionAlimentaire: parseFloat(document.getElementById('pension-alimentaire').value) || 0,
            autresRevenus: parseFloat(document.getElementById('autres-revenus').value) || 0,
            
            // Dépenses liées à l'habitation
            taxesMunicipales: parseFloat(document.getElementById('taxes-municipales').value) || 0,
            taxesScolaires: parseFloat(document.getElementById('taxes-scolaires').value) || 0,
            condoFees: parseFloat(document.getElementById('condo-fees').value) || 0,
            chauffage: parseFloat(document.getElementById('chauffage').value) || 0,
            paiementHypothecaire: parseFloat(document.getElementById('paiement-hypothecaire').value) || 0,
            
            // Autres dettes
            creditAuto: parseFloat(document.getElementById('credit-auto').value) || 0,
            creditMarge: parseFloat(document.getElementById('credit-marge').value) || 0,
            creditPerso: parseFloat(document.getElementById('credit-perso').value) || 0,
            carteCredit: parseFloat(document.getElementById('carte-credit').value) || 0,
            creditEtudiant: parseFloat(document.getElementById('credit-etudiant').value) || 0,
            pensionAlimentairePaiement: parseFloat(document.getElementById('pension-alimentaire-paiement').value) || 0,
            autresDettes: parseFloat(document.getElementById('autres-dettes').value) || 0
        };
        
        // Calcul des totaux
        const totalRevenus = formData.revenuAnnuel + 
                           formData.revenuConjoint + 
                           formData.allocationsFamiliales + 
                           formData.pensionAlimentaire + 
                           formData.autresRevenus;
        
        const totalRevenusMensuels = totalRevenus / 12;
        
        const totalHabitation = formData.taxesMunicipales / 12 + 
                              formData.taxesScolaires / 12 + 
                              formData.condoFees + 
                              formData.chauffage + 
                              formData.paiementHypothecaire;
        
        const totalAutresDettes = formData.creditAuto + 
                               formData.creditMarge + 
                               formData.creditPerso + 
                               formData.carteCredit + 
                               formData.creditEtudiant + 
                               formData.pensionAlimentairePaiement + 
                               formData.autresDettes;
        
        // Calcul des ratios
        const abdRatio = (totalHabitation / totalRevenusMensuels) * 100;
        const atdRatio = ((totalHabitation + totalAutresDettes) / totalRevenusMensuels) * 100;
        
        // Affichage des résultats
        document.getElementById('total-revenus').querySelector('.result-value').textContent = 
            formatCurrency(totalRevenusMensuels) + ' par mois';
        
        document.getElementById('total-habitation').querySelector('.result-value').textContent = 
            formatCurrency(totalHabitation) + ' par mois';
        
        document.getElementById('total-autres-dettes').querySelector('.result-value').textContent = 
            formatCurrency(totalAutresDettes) + ' par mois';
        
        document.getElementById('abd-ratio').querySelector('.result-value').textContent = 
            formatPercentage(abdRatio);
        
        document.getElementById('atd-ratio').querySelector('.result-value').textContent = 
            formatPercentage(atdRatio);
        
        // Analyse des résultats pour la qualification
        const qualificationElement = document.getElementById('qualification');
        let message = '';
        let qualificationClass = '';
        
        if (abdRatio <= 32 && atdRatio <= 40) {
            message = 'Qualification: EXCELLENTE - Vos ratios ABD et ATD sont dans les limites acceptables pour un prêt hypothécaire standard.';
            qualificationClass = 'result-excellent';
        } else if (abdRatio <= 35 && atdRatio <= 42) {
            message = 'Qualification: BONNE - Vos ratios sont légèrement élevés mais toujours acceptables pour certains prêteurs.';
            qualificationClass = 'result-good';
        } else if (abdRatio <= 39 && atdRatio <= 44) {
            message = 'Qualification: LIMITÉE - Vos ratios sont élevés. Vous pourriez avoir accès à des prêts assurés ou des prêteurs alternatifs.';
            qualificationClass = 'result-limited';
        } else {
            message = 'Qualification: DIFFICILE - Vos ratios dépassent les limites généralement acceptées. Consultez un courtier hypothécaire pour explorer vos options.';
            qualificationClass = 'result-difficult';
        }
        
        qualificationElement.innerHTML = `<span class="${qualificationClass}">${message}</span>`;
        
        // Affichage de la section résultats
        document.getElementById('results').style.display = 'block';
        
        // Défilement vers les résultats
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Réinitialiser le formulaire au chargement
    form.reset();
});

// Ajout de classes CSS pour la qualification
document.head.insertAdjacentHTML('beforeend', `
<style>
    .result-excellent {
        color: #27ae60;
        font-weight: bold;
    }
    .result-good {
        color: #2980b9;
        font-weight: bold;
    }
    .result-limited {
        color: #f39c12;
        font-weight: bold;
    }
    .result-difficult {
        color: #c0392b;
        font-weight: bold;
    }
</style>
`);
