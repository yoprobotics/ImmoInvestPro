import React, { useState, useEffect } from 'react';
import { calculLiquiditeMulti } from '../../utils/calculators';

/**
 * Composant de calculateur détaillé de liquidité pour immeubles MULTI
 * Permet de calculer la rentabilité d'un immeuble à revenus avec différentes options de financement
 */
const MultiLiquidityCalculator = ({ propertyData, onCalculationComplete }) => {
  // Valeurs par défaut
  const initialState = {
    prixAchat: propertyData?.prixAchat || 500000,
    revenusBruts: propertyData?.revenusBruts || 60000,
    nombreLogements: propertyData?.nombreLogements || 4,
    
    // Dépenses personnalisées (null pour utiliser l'estimation automatique)
    depensesPersonnalisees: false,
    depenses: {
      taxesMunicipales: 5000,
      taxesScolaires: 1000,
      assurances: 3000,
      entretienReparations: 3000,
      electriciteChauffage: 2000,
      gestion: 2000,
      autres: 2000
    },
    
    // Financement
    financement: {
      bancaire: { pourcentage: 75, taux: 5, terme: 25 },
      vendeur: { pourcentage: 15, taux: 8, terme: 5 },
      prive: { pourcentage: 0, taux: 10, terme: 3 },
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

  // Gérer le changement de type de dépenses
  const handleDepensesTypeChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      depensesPersonnalisees: e.target.checked
    }));
  };

  // Mise à jour des dépenses personnalisées
  const handleDepensesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      depenses: {
        ...prevData.depenses,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  // Calcul des résultats
  const calculateResults = () => {
    const params = {
      prixAchat: formData.prixAchat,
      revenusBruts: formData.revenusBruts,
      nombreLogements: formData.nombreLogements,
      depenses: formData.depensesPersonnalisees ? formData.depenses : null,
      financement: formData.financement
    };
    
    const calculResults = calculLiquiditeMulti(params);
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
      <h2>Calculateur de Liquidité pour MULTI</h2>
      
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
            <label htmlFor="revenusBruts">Revenus Bruts Annuels</label>
            <input 
              type="number" 
              id="revenusBruts" 
              name="revenusBruts"
              value={formData.revenusBruts} 
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nombreLogements">Nombre de Logements</label>
            <input 
              type="number" 
              id="nombreLogements" 
              name="nombreLogements"
              value={formData.nombreLogements} 
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
            <div className="input-group">
              <label>Terme (ans):</label>
              <input 
                type="number" 
                name="financement.bancaire.terme"
                value={formData.financement.bancaire.terme} 
                onChange={handleChange}
                min="1"
              />
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
            <div className="input-group">
              <label>Terme (ans):</label>
              <input 
                type="number" 
                name="financement.vendeur.terme"
                value={formData.financement.vendeur.terme} 
                onChange={handleChange}
                min="1"
              />
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
            <div className="input-group">
              <label>Terme (ans):</label>
              <input 
                type="number" 
                name="financement.prive.terme"
                value={formData.financement.prive.terme} 
                onChange={handleChange}
                min="1"
              />
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
              <h3>Dépenses d'Opération</h3>
              <div className="form-group">
                <label htmlFor="depensesPersonnalisees">
                  <input 
                    type="checkbox" 
                    id="depensesPersonnalisees" 
                    checked={formData.depensesPersonnalisees} 
                    onChange={handleDepensesTypeChange} 
                  />
                  Utiliser des dépenses personnalisées
                </label>
              </div>
              
              {formData.depensesPersonnalisees && (
                <div className="depenses-personnalisees">
                  <div className="form-group">
                    <label htmlFor="taxesMunicipales">Taxes Municipales</label>
                    <input 
                      type="number" 
                      id="taxesMunicipales" 
                      name="taxesMunicipales"
                      value={formData.depenses.taxesMunicipales} 
                      onChange={handleDepensesChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="taxesScolaires">Taxes Scolaires</label>
                    <input 
                      type="number" 
                      id="taxesScolaires" 
                      name="taxesScolaires"
                      value={formData.depenses.taxesScolaires} 
                      onChange={handleDepensesChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="assurances">Assurances</label>
                    <input 
                      type="number" 
                      id="assurances" 
                      name="assurances"
                      value={formData.depenses.assurances} 
                      onChange={handleDepensesChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="entretienReparations">Entretien et Réparations</label>
                    <input 
                      type="number" 
                      id="entretienReparations" 
                      name="entretienReparations"
                      value={formData.depenses.entretienReparations} 
                      onChange={handleDepensesChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="electriciteChauffage">Électricité et Chauffage</label>
                    <input 
                      type="number" 
                      id="electriciteChauffage" 
                      name="electriciteChauffage"
                      value={formData.depenses.electriciteChauffage} 
                      onChange={handleDepensesChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="gestion">Frais de Gestion</label>
                    <input 
                      type="number" 
                      id="gestion" 
                      name="gestion"
                      value={formData.depenses.gestion} 
                      onChange={handleDepensesChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="autres">Autres Dépenses</label>
                    <input 
                      type="number" 
                      id="autres" 
                      name="autres"
                      value={formData.depenses.autres} 
                      onChange={handleDepensesChange}
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
              <h4>Cashflow par Porte</h4>
              <div className="result-value">
                {formatMoney(results.cashflowParPorteMois)}/mois
              </div>
              <div className="result-status">
                {results.rentable 
                  ? '✅ Atteint l\'objectif de 75$/porte/mois' 
                  : '❌ N\'atteint pas l\'objectif de 75$/porte/mois'}
              </div>
            </div>
            
            <div className="result-card">
              <h4>Revenus Nets d'Opération (RNO)</h4>
              <div className="result-value">{formatMoney(results.rno)}/an</div>
            </div>
            
            <div className="result-card">
              <h4>Liquidité Totale</h4>
              <div className="result-value">{formatMoney(results.liquiditeAnnuelle)}/an</div>
            </div>
            
            <div className="result-card">
              <h4>Rendement sur Mise de Fonds</h4>
              <div className="result-value">{results.rendementMiseDeFonds.toFixed(2)}%</div>
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
                <span>Revenus Bruts:</span>
                <span>{formatMoney(results.revenusBruts)}/an</span>
              </div>
              
              <div className="result-row">
                <span>Dépenses d'Opération:</span>
                <span>{formatMoney(results.depensesTotal)}/an</span>
              </div>
              
              <div className="result-row bold">
                <span>Revenus Nets d'Opération:</span>
                <span>{formatMoney(results.rno)}/an</span>
              </div>
              
              <div className="result-row">
                <span>Paiements Hypothécaires:</span>
                <span>{formatMoney(results.paiementAnnuelTotal)}/an</span>
              </div>
              
              <div className="result-row bold">
                <span>Liquidité (Cashflow):</span>
                <span>{formatMoney(results.liquiditeAnnuelle)}/an</span>
              </div>
              
              <div className="result-row bold">
                <span>Cashflow par Porte:</span>
                <span>{formatMoney(results.cashflowParPorteMois)}/mois</span>
              </div>
            </div>
            
            <h4>Ratios d'Évaluation</h4>
            
            <div className="result-table">
              <div className="result-row">
                <span>Taux de Capitalisation (Cap Rate):</span>
                <span>{results.tauxCapitalisation.toFixed(2)}%</span>
              </div>
              
              <div className="result-row">
                <span>Multiplicateur de Revenus Bruts (GRM):</span>
                <span>{results.multiplicateur.toFixed(2)}x</span>
              </div>
              
              <div className="result-row">
                <span>Ratio de Couverture de Dette (DCR):</span>
                <span>{results.ratioCouvertureDette.toFixed(2)}</span>
              </div>
              
              <div className="result-row">
                <span>Rendement sur Mise de Fonds:</span>
                <span>{results.rendementMiseDeFonds.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiLiquidityCalculator;
