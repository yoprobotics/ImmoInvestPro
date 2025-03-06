import React, { useState, useEffect } from 'react';
import { calculLiquiditeFlip } from '../../utils/calculators';

/**
 * Composant de calculateur détaillé de liquidité pour projets FLIP
 * Permet de calculer la rentabilité d'un projet de rénovation-revente
 */
const FlipLiquidityCalculator = ({ propertyData, onCalculationComplete }) => {
  // Valeurs par défaut
  const initialState = {
    prixAchat: propertyData?.prixAchat || 300000,
    valeurApresRenovation: propertyData?.valeurApresRenovation || 400000,
    coutRenovations: propertyData?.coutRenovations || 30000,
    dureeProjetMois: propertyData?.dureeProjetMois || 3,
    
    // Frais personnalisés (null pour utiliser l'estimation automatique)
    fraisPersonnalises: false,
    fraisAcquisition: {
      droitsMutation: 4500,
      fraisNotaire: 1500,
      fraisInspection: 500,
      autresFrais: 500
    },
    fraisPossession: {
      assurances: 750,
      taxes: 1500,
      utilites: 450,
      interetsFinancement: 5000
    },
    fraisVente: {
      commissionsCourtier: 20000,
      fraisNotaire: 1500,
      marketing: 1000,
      autresFrais: 500
    },
    
    // Financement
    financement: {
      bancaire: { pourcentage: 75, taux: 5 },
      vendeur: { pourcentage: 15, taux: 8 },
      prive: { pourcentage: 0, taux: 10 },
      miseDeFonds: 10
    }
  };

  const [formData, setFormData] = useState(initialState);
  const [results, setResults] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculer les résultats lorsque les entrées changent
  useEffect(() => {
    calculateResults();
  }, [formData]);

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Gestion des champs imbriqués
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: subChild 
            ? { ...prevData[parent][child], [subChild]: parseFloat(value) || 0 }
            : parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: parseFloat(value) || 0
      }));
    }
  };

  // Gérer le changement de type de frais
  const handleFraisTypeChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      fraisPersonnalises: e.target.checked
    }));
  };

  // Mise à jour des frais personnalisés
  const handleFraisChange = (type, e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        [name]: parseFloat(value) || 0
      }
    }));
  };

  // Calcul des résultats
  const calculateResults = () => {
    const params = {
      prixAchat: formData.prixAchat,
      valeurApresRenovation: formData.valeurApresRenovation,
      coutRenovations: formData.coutRenovations,
      dureeProjetMois: formData.dureeProjetMois,
      fraisAcquisition: formData.fraisPersonnalises ? formData.fraisAcquisition : null,
      fraisPossession: formData.fraisPersonnalises ? formData.fraisPossession : null,
      fraisVente: formData.fraisPersonnalises ? formData.fraisVente : null,
      financement: formData.financement
    };
    
    const calculResults = calculLiquiditeFlip(params);
    setResults(calculResults);
    
    if (onCalculationComplete) {
      onCalculationComplete(calculResults);
    }
  };

  // Vérifier que le total des pourcentages de financement est de 100%
  const totalFinancementPercentage = 
    formData.financement.bancaire.pourcentage + 
    formData.financement.vendeur.pourcentage + 
    formData.financement.prive.pourcentage + 
    formData.financement.miseDeFonds;

  const isFinancementValid = Math.abs(totalFinancementPercentage - 100) < 0.01;

  // Format monétaire
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  return (
    <div className="calculator-container">
      <h2>Calculateur de Rentabilité FLIP</h2>
      
      <div className="calculator-form">
        <div className="form-section">
          <h3>Informations de Base</h3>
          <div className="form-group">
            <label htmlFor="prixAchat">Prix d'Achat</label>
            <input 
              type="number" 
              id="prixAchat" 
              name="prixAchat"
              value={formData.prixAchat} 
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="valeurApresRenovation">Valeur Après Rénovation</label>
            <input 
              type="number" 
              id="valeurApresRenovation" 
              name="valeurApresRenovation"
              value={formData.valeurApresRenovation} 
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="coutRenovations">Coût des Rénovations</label>
            <input 
              type="number" 
              id="coutRenovations" 
              name="coutRenovations"
              value={formData.coutRenovations} 
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dureeProjetMois">Durée du Projet (mois)</label>
            <input 
              type="number" 
              id="dureeProjetMois" 
              name="dureeProjetMois"
              value={formData.dureeProjetMois} 
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Financement</h3>
          {!isFinancementValid && (
            <div className="error-message">
              Attention: Le total des pourcentages de financement doit être égal à 100%.
              Actuellement: {totalFinancementPercentage}%
            </div>
          )}
          
          <div className="form-group">
            <label>Financement Bancaire</label>
            <div className="input-group">
              <input 
                type="number" 
                name="financement.bancaire.pourcentage"
                value={formData.financement.bancaire.pourcentage} 
                onChange={handleChange}
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
            <div className="input-group">
              <label>Taux:</label>
              <input 
                type="number" 
                name="financement.bancaire.taux"
                value={formData.financement.bancaire.taux} 
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              <span>%</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Balance Vendeur</label>
            <div className="input-group">
              <input 
                type="number" 
                name="financement.vendeur.pourcentage"
                value={formData.financement.vendeur.pourcentage} 
                onChange={handleChange}
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
            <div className="input-group">
              <label>Taux:</label>
              <input 
                type="number" 
                name="financement.vendeur.taux"
                value={formData.financement.vendeur.taux} 
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              <span>%</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Prêteur Privé</label>
            <div className="input-group">
              <input 
                type="number" 
                name="financement.prive.pourcentage"
                value={formData.financement.prive.pourcentage} 
                onChange={handleChange}
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
            <div className="input-group">
              <label>Taux:</label>
              <input 
                type="number" 
                name="financement.prive.taux"
                value={formData.financement.prive.taux} 
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              <span>%</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Mise de Fonds</label>
            <div className="input-group">
              <input 
                type="number" 
                name="financement.miseDeFonds"
                value={formData.financement.miseDeFonds} 
                onChange={handleChange}
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <div className="toggle-advanced">
            <label htmlFor="showAdvanced">
              <input 
                type="checkbox" 
                id="showAdvanced" 
                checked={showAdvanced} 
                onChange={() => setShowAdvanced(!showAdvanced)} 
              />
              Afficher les options avancées
            </label>
          </div>
          
          {showAdvanced && (
            <div className="advanced-options">
              <h3>Frais Détaillés</h3>
              <div className="form-group">
                <label htmlFor="fraisPersonnalises">
                  <input 
                    type="checkbox" 
                    id="fraisPersonnalises" 
                    checked={formData.fraisPersonnalises} 
                    onChange={handleFraisTypeChange} 
                  />
                  Utiliser des frais personnalisés
                </label>
              </div>
              
              {formData.fraisPersonnalises && (
                <div className="frais-personnalises">
                  <h4>Frais d'Acquisition</h4>
                  <div className="form-group">
                    <label htmlFor="droitsMutation">Droits de Mutation</label>
                    <input 
                      type="number" 
                      id="droitsMutation" 
                      name="droitsMutation"
                      value={formData.fraisAcquisition.droitsMutation} 
                      onChange={(e) => handleFraisChange('fraisAcquisition', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="fraisNotaireAcq">Frais de Notaire</label>
                    <input 
                      type="number" 
                      id="fraisNotaireAcq" 
                      name="fraisNotaire"
                      value={formData.fraisAcquisition.fraisNotaire} 
                      onChange={(e) => handleFraisChange('fraisAcquisition', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="fraisInspection">Frais d'Inspection</label>
                    <input 
                      type="number" 
                      id="fraisInspection" 
                      name="fraisInspection"
                      value={formData.fraisAcquisition.fraisInspection} 
                      onChange={(e) => handleFraisChange('fraisAcquisition', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="autresFraisAcq">Autres Frais</label>
                    <input 
                      type="number" 
                      id="autresFraisAcq" 
                      name="autresFrais"
                      value={formData.fraisAcquisition.autresFrais} 
                      onChange={(e) => handleFraisChange('fraisAcquisition', e)}
                      min="0"
                    />
                  </div>
                  
                  <h4>Frais de Possession</h4>
                  <div className="form-group">
                    <label htmlFor="assurances">Assurances</label>
                    <input 
                      type="number" 
                      id="assurances" 
                      name="assurances"
                      value={formData.fraisPossession.assurances} 
                      onChange={(e) => handleFraisChange('fraisPossession', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="taxes">Taxes</label>
                    <input 
                      type="number" 
                      id="taxes" 
                      name="taxes"
                      value={formData.fraisPossession.taxes} 
                      onChange={(e) => handleFraisChange('fraisPossession', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="utilites">Utilités (électricité, eau, etc.)</label>
                    <input 
                      type="number" 
                      id="utilites" 
                      name="utilites"
                      value={formData.fraisPossession.utilites} 
                      onChange={(e) => handleFraisChange('fraisPossession', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="interetsFinancement">Intérêts sur Financement</label>
                    <input 
                      type="number" 
                      id="interetsFinancement" 
                      name="interetsFinancement"
                      value={formData.fraisPossession.interetsFinancement} 
                      onChange={(e) => handleFraisChange('fraisPossession', e)}
                      min="0"
                    />
                  </div>
                  
                  <h4>Frais de Vente</h4>
                  <div className="form-group">
                    <label htmlFor="commissionsCourtier">Commissions Courtier</label>
                    <input 
                      type="number" 
                      id="commissionsCourtier" 
                      name="commissionsCourtier"
                      value={formData.fraisVente.commissionsCourtier} 
                      onChange={(e) => handleFraisChange('fraisVente', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="fraisNotaireVente">Frais de Notaire</label>
                    <input 
                      type="number" 
                      id="fraisNotaireVente" 
                      name="fraisNotaire"
                      value={formData.fraisVente.fraisNotaire} 
                      onChange={(e) => handleFraisChange('fraisVente', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="marketing">Marketing</label>
                    <input 
                      type="number" 
                      id="marketing" 
                      name="marketing"
                      value={formData.fraisVente.marketing} 
                      onChange={(e) => handleFraisChange('fraisVente', e)}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="autresFraisVente">Autres Frais</label>
                    <input 
                      type="number" 
                      id="autresFraisVente" 
                      name="autresFrais"
                      value={formData.fraisVente.autresFrais} 
                      onChange={(e) => handleFraisChange('fraisVente', e)}
                      min="0"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {results && (
        <div className="results-section">
          <h3>Résultats de l'Analyse</h3>
          
          <div className="results-summary">
            <div className={`result-card ${results.rentable ? 'positive' : 'negative'}`}>
              <h4>Profit Net</h4>
              <div className="result-value">
                {formatMoney(results.profitNet)}
              </div>
              <div className="result-status">
                {results.rentable 
                  ? '✅ Atteint l\'objectif de 25 000$ de profit' 
                  : '❌ N\'atteint pas l\'objectif de 25 000$ de profit'}
              </div>
            </div>
            
            <div className="result-card">
              <h4>Rendement sur Mise de Fonds</h4>
              <div className="result-value">{results.rendementMiseDeFonds.toFixed(2)}%</div>
            </div>
            
            <div className="result-card">
              <h4>ROI</h4>
              <div className="result-value">{results.ROI.toFixed(2)}%</div>
            </div>
            
            <div className="result-card">
              <h4>Profit par Mois</h4>
              <div className="result-value">{formatMoney(results.profitParMois)}/mois</div>
            </div>
            
            <div className="result-card">
              <h4>Rendement Annualisé</h4>
              <div className="result-value">{results.rendementAnnualise.toFixed(2)}%</div>
            </div>
          </div>
          
          <div className="detailed-results">
            <h4>Détails Financiers</h4>
            
            <div className="result-table">
              <div className="result-row">
                <span>Prix d'Achat:</span>
                <span>{formatMoney(results.prixAchat)}</span>
              </div>
              
              <div className="result-row">
                <span>Coût des Rénovations:</span>
                <span>{formatMoney(results.coutRenovations)}</span>
              </div>
              
              <div className="result-row">
                <span>Frais d'Acquisition:</span>
                <span>{formatMoney(results.fraisAcquisition.total)}</span>
              </div>
              
              <div className="result-row">
                <span>Frais de Possession:</span>
                <span>{formatMoney(results.fraisPossession.total)}</span>
              </div>
              
              <div className="result-row">
                <span>Frais de Vente:</span>
                <span>{formatMoney(results.fraisVente.total)}</span>
              </div>
              
              <div className="result-row">
                <span>Coût Total:</span>
                <span>{formatMoney(results.coutTotal)}</span>
              </div>
              
              <div className="result-row">
                <span>Valeur Après Rénovation:</span>
                <span>{formatMoney(results.valeurApresRenovation)}</span>
              </div>
              
              <div className="result-row bold">
                <span>Profit Brut:</span>
                <span>{formatMoney(results.profitBrut)}</span>
              </div>
              
              <div className="result-row bold">
                <span>Profit Net:</span>
                <span>{formatMoney(results.profitNet)}</span>
              </div>
            </div>
            
            <h4>Financement</h4>
            
            <div className="result-table">
              <div className="result-row">
                <span>Mise de Fonds:</span>
                <span>{formatMoney(results.financement.miseDeFonds)} ({results.financement.pourcentageMiseDeFonds}%)</span>
              </div>
              
              <div className="result-row">
                <span>Total Emprunt:</span>
                <span>{formatMoney(results.financement.totalEmprunt)} ({results.financement.pourcentageEmprunt}%)</span>
              </div>
            </div>
            
            <h4>Ratios de Rentabilité</h4>
            
            <div className="result-table">
              <div className="result-row">
                <span>Rendement sur Mise de Fonds:</span>
                <span>{results.rendementMiseDeFonds.toFixed(2)}%</span>
              </div>
              
              <div className="result-row">
                <span>Rapport Profit/Coût:</span>
                <span>{results.rapportProfit.toFixed(2)}%</span>
              </div>
              
              <div className="result-row">
                <span>ROI:</span>
                <span>{results.ROI.toFixed(2)}%</span>
              </div>
              
              <div className="result-row">
                <span>Profit par Mois:</span>
                <span>{formatMoney(results.profitParMois)}/mois</span>
              </div>
              
              <div className="result-row">
                <span>Rendement Annualisé:</span>
                <span>{results.rendementAnnualise.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlipLiquidityCalculator;
