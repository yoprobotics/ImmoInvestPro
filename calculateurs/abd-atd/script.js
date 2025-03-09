document.addEventListener('DOMContentLoaded', function() {
    // Récupération du formulaire et ajout de l'écouteur d'événement
    const form = document.getElementById('abd-atd-form');
    form.addEventListener('submit', calculateRatios);
    
    // Ajout d'auto-calcul lors de changements dans le formulaire
    const allInputs = form.querySelectorAll('input[type="number"]');
    allInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            if (form.checkValidity()) {
                calculateRatios(new Event('submit'));
            }
        }, 500));
    });
    
    // Ajouter des tooltips explicatifs sur les champs
    const tooltipContent = {
        'revenu-annuel': 'Le revenu annuel brut avant impôts et déductions.',
        'revenu-conjoint': 'Le revenu annuel brut du conjoint avant impôts et déductions (si applicable).',
        'allocations-familiales': 'Montant annuel des allocations familiales reçues.',
        'pension-alimentaire': 'Montant annuel des pensions alimentaires reçues.',
        'taxes-municipales': 'Montant annuel des taxes municipales pour la propriété.',
        'taxes-scolaires': 'Montant annuel des taxes scolaires pour la propriété.',
        'condo-fees': 'Frais de copropriété mensuels (si applicable).',
        'chauffage': 'Coût mensuel estimé du chauffage.',
        'paiement-hypothecaire': 'Paiement hypothécaire mensuel (capital et intérêts).',
        'credit-auto': 'Paiement mensuel pour tous les prêts automobiles.',
        'credit-marge': 'Paiement mensuel minimum sur les marges de crédit.',
        'credit-perso': 'Paiement mensuel sur les prêts personnels.',
        'carte-credit': 'Paiement mensuel minimum sur les cartes de crédit.',
        'credit-etudiant': 'Paiement mensuel sur les prêts étudiants.',
        'pension-alimentaire-paiement': 'Montant mensuel des pensions alimentaires à payer.',
        'autres-dettes': 'Paiements mensuels pour toutes autres dettes.'
    };
    
    // Ajouter les tooltips aux champs
    for (const [id, content] of Object.entries(tooltipContent)) {
        const element = document.getElementById(id);
        if (element) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = `<i class="info-icon">i</i><span class="tooltip-text">${content}</span>`;
            
            const label = element.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.appendChild(tooltip);
            }
        }
    }
    
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
    
    // Fonction de debounce pour éviter trop de calculs
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
        
        const abdElement = document.getElementById('abd-ratio').querySelector('.result-value');
        abdElement.textContent = formatPercentage(abdRatio);
        setRatioColor(abdElement, abdRatio, 32, 35, 39);
        
        const atdElement = document.getElementById('atd-ratio').querySelector('.result-value');
        atdElement.textContent = formatPercentage(atdRatio);
        setRatioColor(atdElement, atdRatio, 40, 42, 44);
        
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
        
        // Génération d'un graphique de comparaison
        generateRatioChart(abdRatio, atdRatio);
        
        // Affichage de la section résultats
        document.getElementById('results').style.display = 'block';
        
        // Défilement vers les résultats si ce n'est pas un calcul automatique
        if (event.type === 'submit') {
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Fonction pour définir la couleur du ratio selon sa valeur
    function setRatioColor(element, ratio, goodLimit, mediumLimit, highLimit) {
        if (ratio <= goodLimit) {
            element.className = 'result-value result-excellent';
        } else if (ratio <= mediumLimit) {
            element.className = 'result-value result-good';
        } else if (ratio <= highLimit) {
            element.className = 'result-value result-limited';
        } else {
            element.className = 'result-value result-difficult';
        }
    }
    
    // Fonction pour générer un graphique de comparaison simple
    function generateRatioChart(abdRatio, atdRatio) {
        // Nous allons créer un graphique à barres simple avec du HTML/CSS
        const resultsContainer = document.getElementById('results');
        
        // Vérifier si le graphique existe déjà
        let chartSection = document.getElementById('ratio-chart-section');
        if (!chartSection) {
            // Créer la section du graphique
            chartSection = document.createElement('div');
            chartSection.id = 'ratio-chart-section';
            chartSection.className = 'result-section';
            
            // Titre
            const chartTitle = document.createElement('h3');
            chartTitle.textContent = 'Comparaison des ratios';
            chartSection.appendChild(chartTitle);
            
            // Conteneur du graphique
            const chartContainer = document.createElement('div');
            chartContainer.id = 'ratio-chart-container';
            chartContainer.className = 'chart-container';
            chartSection.appendChild(chartContainer);
            
            // Ajouter au conteneur de résultats
            resultsContainer.appendChild(chartSection);
        }
        
        // Mettre à jour le graphique
        const chartContainer = document.getElementById('ratio-chart-container');
        chartContainer.innerHTML = `
            <div class="chart-bars">
                <!-- ABD Ratio Bar -->
                <div class="chart-bar-group">
                    <div class="chart-label">ABD</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar abd-bar" style="width: ${Math.min(abdRatio, 100)}%;">
                            ${abdRatio.toFixed(2)}%
                        </div>
                        <div class="chart-limit" style="left: 32%;" title="Excellent: 32%"></div>
                        <div class="chart-limit" style="left: 35%;" title="Bon: 35%"></div>
                        <div class="chart-limit" style="left: 39%;" title="Limite: 39%"></div>
                    </div>
                </div>
                
                <!-- ATD Ratio Bar -->
                <div class="chart-bar-group">
                    <div class="chart-label">ATD</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar atd-bar" style="width: ${Math.min(atdRatio, 100)}%;">
                            ${atdRatio.toFixed(2)}%
                        </div>
                        <div class="chart-limit" style="left: 40%;" title="Excellent: 40%"></div>
                        <div class="chart-limit" style="left: 42%;" title="Bon: 42%"></div>
                        <div class="chart-limit" style="left: 44%;" title="Limite: 44%"></div>
                    </div>
                </div>
            </div>
            
            <div class="chart-legend">
                <div class="legend-item"><span class="legend-color excellent"></span> Excellent</div>
                <div class="legend-item"><span class="legend-color good"></span> Bon</div>
                <div class="legend-item"><span class="legend-color limited"></span> Limite</div>
                <div class="legend-item"><span class="legend-color difficult"></span> Difficile</div>
            </div>
        `;
        
        // Colorer les barres selon les ratios
        const abdBar = chartContainer.querySelector('.abd-bar');
        const atdBar = chartContainer.querySelector('.atd-bar');
        
        if (abdRatio <= 32) {
            abdBar.className = 'chart-bar abd-bar excellent';
        } else if (abdRatio <= 35) {
            abdBar.className = 'chart-bar abd-bar good';
        } else if (abdRatio <= 39) {
            abdBar.className = 'chart-bar abd-bar limited';
        } else {
            abdBar.className = 'chart-bar abd-bar difficult';
        }
        
        if (atdRatio <= 40) {
            atdBar.className = 'chart-bar atd-bar excellent';
        } else if (atdRatio <= 42) {
            atdBar.className = 'chart-bar atd-bar good';
        } else if (atdRatio <= 44) {
            atdBar.className = 'chart-bar atd-bar limited';
        } else {
            atdBar.className = 'chart-bar atd-bar difficult';
        }
    }
    
    // Fonction pour réinitialiser le formulaire
    function resetForm() {
        form.reset();
        document.getElementById('results').style.display = 'none';
    }
    
    // Ajouter un bouton de réinitialisation
    const submitButton = document.getElementById('calculate-btn');
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.id = 'reset-btn';
    resetButton.textContent = 'Réinitialiser';
    resetButton.className = 'reset-button';
    resetButton.addEventListener('click', resetForm);
    
    // Ajouter le bouton à côté du bouton de calcul
    submitButton.parentNode.appendChild(resetButton);
    
    // Réinitialiser le formulaire au chargement
    form.reset();
});

// Ajout de styles CSS additionnels pour l'expérience utilisateur améliorée
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Styles pour les tooltips */
    .tooltip {
        position: relative;
        display: inline-block;
        margin-left: 5px;
    }

    .info-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #3498db;
        color: white;
        font-style: normal;
        font-size: 12px;
        cursor: help;
    }

    .tooltip-text {
        visibility: hidden;
        width: 200px;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
        font-weight: normal;
        font-size: 0.8rem;
    }

    .tooltip:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }

    /* Styles pour le graphique */
    .chart-container {
        margin-top: 20px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 4px;
    }

    .chart-bars {
        margin-bottom: 15px;
    }

    .chart-bar-group {
        margin-bottom: 15px;
    }

    .chart-label {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .chart-bar-container {
        height: 25px;
        background-color: #eee;
        border-radius: 4px;
        position: relative;
    }

    .chart-bar {
        height: 100%;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        color: white;
        font-weight: bold;
        transition: width 0.5s ease-in-out;
    }

    .chart-bar.excellent {
        background-color: #27ae60;
    }

    .chart-bar.good {
        background-color: #2980b9;
    }

    .chart-bar.limited {
        background-color: #f39c12;
    }

    .chart-bar.difficult {
        background-color: #c0392b;
    }

    .chart-limit {
        position: absolute;
        height: 100%;
        width: 2px;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
    }

    .chart-legend {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 15px;
        font-size: 0.8rem;
    }

    .legend-color {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 5px;
        border-radius: 3px;
    }

    .legend-color.excellent {
        background-color: #27ae60;
    }

    .legend-color.good {
        background-color: #2980b9;
    }

    .legend-color.limited {
        background-color: #f39c12;
    }

    .legend-color.difficult {
        background-color: #c0392b;
    }

    /* Styles pour les résultats */
    .result-value.result-excellent {
        color: #27ae60;
        font-weight: bold;
    }
    
    .result-value.result-good {
        color: #2980b9;
        font-weight: bold;
    }
    
    .result-value.result-limited {
        color: #f39c12;
        font-weight: bold;
    }
    
    .result-value.result-difficult {
        color: #c0392b;
        font-weight: bold;
    }

    /* Styles pour le bouton reset */
    .reset-button {
        background-color: #95a5a6;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 10px;
        transition: background-color 0.3s;
    }

    .reset-button:hover {
        background-color: #7f8c8d;
    }

    /* Animation de transition pour les résultats */
    #results {
        transition: opacity 0.3s ease-in-out;
    }

    #results.fade-in {
        opacity: 1;
    }

    #results.fade-out {
        opacity: 0;
    }
</style>
`);
