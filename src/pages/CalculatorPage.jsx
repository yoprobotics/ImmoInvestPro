import React, { useState } from 'react';
import MultiLiquidityCalculator from '../components/calculators/MultiLiquidityCalculator';
import FlipLiquidityCalculator from '../components/calculators/FlipLiquidityCalculator';
import { calculNapkinFlip, calculNapkinMulti, calculPrixOffreFlip, calculPrixOffreMulti } from '../utils/calculators';

/**
 * Page principale de calculateurs
 * Permet de basculer entre les différents types de calculateurs
 */
const CalculatorPage = () => {
  const [calculatorType, setCalculatorType] = useState('multi'); // 'multi' ou 'flip'
  const [propertyData, setPropertyData] = useState(null);
  const [napkinResults, setNapkinResults] = useState(null);
  const [offerPrice, setOfferPrice] = useState(null);
  
  // Fonction pour traiter la soumission du formulaire napkin
  const handleNapkinSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (calculatorType === 'multi') {
      const prixAchat = parseFloat(formData.get('prixAchat'));
      const nombreAppartements = parseInt(formData.get('nombreAppartements'));
      const revenusBruts = parseFloat(formData.get('revenusBruts'));
      
      // Calcul Napkin MULTI
      const results = calculNapkinMulti(prixAchat, nombreAppartements, revenusBruts);
      setNapkinResults(results);
      
      // Calcul du prix d'offre pour atteindre 75$/porte/mois
      const prixOffre = calculPrixOffreMulti(revenusBruts, nombreAppartements);
      setOfferPrice(prixOffre);
      
      // Mettre à jour les données de propriété pour le calculateur détaillé
      setPropertyData({
        prixAchat,
        nombreLogements: nombreAppartements,
        revenusBruts
      });
    } else {
      const prixFinal = parseFloat(formData.get('prixFinal'));
      const prixInitial = parseFloat(formData.get('prixInitial'));
      const prixRenos = parseFloat(formData.get('prixRenos'));
      
      // Calcul Napkin FLIP
      const results = calculNapkinFlip(prixFinal, prixInitial, prixRenos);
      setNapkinResults(results);
      
      // Calcul du prix d'offre pour atteindre 25000$ de profit
      const prixOffre = calculPrixOffreFlip(prixFinal, prixRenos);
      setOfferPrice(prixOffre);
      
      // Mettre à jour les données de propriété pour le calculateur détaillé
      setPropertyData({
        prixAchat: prixInitial,
        valeurApresRenovation: prixFinal,
        coutRenovations: prixRenos
      });
    }
  };
  
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };
  
  return (
    <div className="calculator-page">
      <div className="page-header">
        <h1>Calculateurs ImmoInvestPro</h1>
        <p>Analysez la rentabilité de vos projets immobiliers selon la méthodologie "Secrets de l'immobilier"</p>
      </div>
      
      <div className="calculator-tabs">
        <button 
          className={`tab-button ${calculatorType === 'multi' ? 'active' : ''}`} 
          onClick={() => setCalculatorType('multi')}
        >
          Multi-Logements
        </button>
        <button 
          className={`tab-button ${calculatorType === 'flip' ? 'active' : ''}`} 
          onClick={() => setCalculatorType('flip')}
        >
          FLIP
        </button>
      </div>
      
      <div className="calculator-sections">
        <div className="napkin-calculator">
          <h2>Calculateur Napkin {calculatorType === 'multi' ? 'MULTI' : 'FLIP'}</h2>
          <p>Évaluation rapide pour déterminer si une propriété mérite une analyse plus approfondie.</p>
          
          <form onSubmit={handleNapkinSubmit}>
            {calculatorType === 'multi' ? (
              <>
                <div className="form-group">
                  <label htmlFor="prixAchat">Prix d'Achat (P)</label>
                  <input type="number" id="prixAchat" name="prixAchat" required min="0" />
                </div>
                <div className="form-group">
                  <label htmlFor="nombreAppartements">Nombre d'Appartements (A)</label>
                  <input type="number" id="nombreAppartements" name="nombreAppartements" required min="1" />
                </div>
                <div className="form-group">
                  <label htmlFor="revenusBruts">Revenus Bruts Annuels (R)</label>
                  <input type="number" id="revenusBruts" name="revenusBruts" required min="0" />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="prixFinal">Valeur Après Rénovation (F)</label>
                  <input type="number" id="prixFinal" name="prixFinal" required min="0" />
                </div>
                <div className="form-group">
                  <label htmlFor="prixInitial">Prix d'Achat (I)</label>
                  <input type="number" id="prixInitial" name="prixInitial" required min="0" />
                </div>
                <div className="form-group">
                  <label htmlFor="prixRenos">Coût des Rénovations (P)</label>
                  <input type="number" id="prixRenos" name="prixRenos" required min="0" />
                </div>
              </>
            )}
            
            <div className="form-actions">
              <button type="submit" className="primary-button">Calculer</button>
            </div>
          </form>
          
          {napkinResults && (
            <div className="napkin-results">
              <h3>Résultats du Calcul Napkin</h3>
              
              {calculatorType === 'multi' ? (
                <div className="results-summary">
                  <div className={`result-card ${napkinResults.rentable ? 'positive' : 'negative'}`}>
                    <h4>Cashflow par Porte</h4>
                    <div className="result-value">
                      {formatMoney(napkinResults.cashflowParPorteMois)}/mois
                    </div>
                    <div className="result-status">
                      {napkinResults.rentable 
                        ? '✅ Atteint l\'objectif de 75$/porte/mois' 
                        : '❌ N\'atteint pas l\'objectif de 75$/porte/mois'}
                    </div>
                  </div>
                  
                  <div className="result-card">
                    <h4>Dépenses d'Opération</h4>
                    <div className="result-value">
                      {formatMoney(napkinResults.depensesOperation)}/an ({napkinResults.pourcentageDépenses}%)
                    </div>
                  </div>
                  
                  <div className="result-card">
                    <h4>Revenus Nets d'Opération</h4>
                    <div className="result-value">
                      {formatMoney(napkinResults.rno)}/an
                    </div>
                  </div>
                  
                  <div className="result-card">
                    <h4>Paiement Hypothécaire</h4>
                    <div className="result-value">
                      {formatMoney(napkinResults.paiementAnnuel)}/an
                    </div>
                  </div>
                </div>
              ) : (
                <div className="results-summary">
                  <div className={`result-card ${napkinResults.rentable ? 'positive' : 'negative'}`}>
                    <h4>Profit</h4>
                    <div className="result-value">
                      {formatMoney(napkinResults.profit)}
                    </div>
                    <div className="result-status">
                      {napkinResults.rentable 
                        ? '✅ Atteint l\'objectif de 25 000$ de profit' 
                        : '❌ N\'atteint pas l\'objectif de 25 000$ de profit'}
                    </div>
                  </div>
                  
                  <div className="result-card">
                    <h4>Frais (10%)</h4>
                    <div className="result-value">
                      {formatMoney(napkinResults.frais)}
                    </div>
                  </div>
                </div>
              )}
              
              {offerPrice && (
                <div className="offer-price">
                  <h3>Prix d'Offre Recommandé</h3>
                  <p>Pour atteindre votre objectif de rentabilité, nous vous recommandons de faire une offre de:</p>
                  <div className="offer-value">{formatMoney(offerPrice)}</div>
                  {calculatorType === 'multi' ? (
                    <p className="offer-explanation">Ce prix permettra d'atteindre un cashflow de 75$/porte/mois.</p>
                  ) : (
                    <p className="offer-explanation">Ce prix permettra d'atteindre un profit de 25 000$.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="advanced-calculator">
          <h2>Calculateur Détaillé</h2>
          <p>Analyse complète de la rentabilité avec options de financement créatif.</p>
          
          {calculatorType === 'multi' ? (
            <MultiLiquidityCalculator propertyData={propertyData} />
          ) : (
            <FlipLiquidityCalculator propertyData={propertyData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
