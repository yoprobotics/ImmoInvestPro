import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Composant de formulaire pour la comparaison de scénarios d'investissement
 */
const ScenarioComparisonForm = () => {
  const [scenarios, setScenarios] = useState([
    {
      name: 'Scénario 1',
      type: 'FLIP',
      purchasePrice: 0,
      renovationCost: 0,
      salePrice: 0,
      monthsHeld: 6
    }
  ]);
  
  const [options, setOptions] = useState({
    prioritizeCashflow: true,
    weightCashflow: 0.5,
    weightCapRate: 0.3,
    weightCashOnCash: 0.2,
    minViableCashflowPerUnit: 75
  });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Met à jour les données d'un scénario
   */
  const updateScenario = (index, field, value) => {
    const updatedScenarios = [...scenarios];
    
    if (field === 'type') {
      // Si on change le type, on réinitialise les champs spécifiques
      if (value === 'FLIP') {
        updatedScenarios[index] = {
          ...updatedScenarios[index],
          type: 'FLIP',
          purchasePrice: updatedScenarios[index].purchasePrice || 0,
          renovationCost: updatedScenarios[index].renovationCost || 0,
          salePrice: 0,
          monthsHeld: 6
        };
      } else {
        updatedScenarios[index] = {
          ...updatedScenarios[index],
          type: 'MULTI',
          purchasePrice: updatedScenarios[index].purchasePrice || 0,
          renovationCost: updatedScenarios[index].renovationCost || 0,
          units: 1,
          grossAnnualRent: 0,
          downPaymentRatio: 0.25,
          interestRate: 4.5,
          amortizationYears: 25
        };
      }
    } else {
      // Sinon on met simplement à jour le champ spécifié
      updatedScenarios[index] = {
        ...updatedScenarios[index],
        [field]: value
      };
    }
    
    setScenarios(updatedScenarios);
  };
  
  /**
   * Ajoute un nouveau scénario au formulaire
   */
  const addScenario = () => {
    setScenarios([
      ...scenarios, 
      {
        name: `Scénario ${scenarios.length + 1}`,
        type: 'FLIP',
        purchasePrice: 0,
        renovationCost: 0,
        salePrice: 0,
        monthsHeld: 6
      }
    ]);
  };
  
  /**
   * Supprime un scénario du formulaire
   */
  const removeScenario = (index) => {
    if (scenarios.length <= 1) return;
    
    const updatedScenarios = [...scenarios];
    updatedScenarios.splice(index, 1);
    setScenarios(updatedScenarios);
  };
  
  /**
   * Met à jour les options de comparaison
   */
  const updateOption = (field, value) => {
    setOptions({
      ...options,
      [field]: value
    });
  };
  
  /**
   * Soumet le formulaire pour comparaison
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Préparation des données pour l'API
      const scenariosToSubmit = scenarios.map(scenario => {
        // Conversion des chaînes en nombres
        const prepared = { ...scenario };
        
        // Champs communs
        prepared.purchasePrice = Number(prepared.purchasePrice);
        prepared.renovationCost = Number(prepared.renovationCost);
        
        if (scenario.type === 'FLIP') {
          prepared.salePrice = Number(prepared.salePrice);
          prepared.monthsHeld = Number(prepared.monthsHeld);
        } else {
          prepared.units = Number(prepared.units);
          prepared.grossAnnualRent = Number(prepared.grossAnnualRent);
          prepared.downPaymentRatio = Number(prepared.downPaymentRatio);
          prepared.interestRate = Number(prepared.interestRate);
          prepared.amortizationYears = Number(prepared.amortizationYears);
        }
        
        return prepared;
      });
      
      // Options de comparaison
      const optionsToSubmit = {
        ...options,
        prioritizeCashflow: options.prioritizeCashflow === 'true' || options.prioritizeCashflow === true,
        weightCashflow: Number(options.weightCashflow),
        weightCapRate: Number(options.weightCapRate),
        weightCashOnCash: Number(options.weightCashOnCash),
        minViableCashflowPerUnit: Number(options.minViableCashflowPerUnit)
      };
      
      // Appel à l'API
      const response = await axios.post(`${API_URL}/comparison/compare`, {
        scenarios: scenariosToSubmit,
        options: optionsToSubmit
      });
      
      setResults(response.data.data);
    } catch (err) {
      console.error('Erreur lors de la comparaison:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la comparaison des scénarios');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Rendu des champs spécifiques selon le type de scénario
   */
  const renderScenarioFields = (scenario, index) => {
    return (
      <div>
        <Form.Group className="mb-3">
          <Form.Label>Type de scénario</Form.Label>
          <Form.Select 
            value={scenario.type} 
            onChange={e => updateScenario(index, 'type', e.target.value)}
          >
            <option value="FLIP">FLIP (Achat-Rénovation-Revente)</option>
            <option value="MULTI">MULTI (Immeuble à revenus)</option>
          </Form.Select>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Prix d'achat ($)</Form.Label>
          <Form.Control 
            type="number" 
            placeholder="Prix d'achat"
            value={scenario.purchasePrice} 
            onChange={e => updateScenario(index, 'purchasePrice', e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Coût des rénovations ($)</Form.Label>
          <Form.Control 
            type="number" 
            placeholder="Coût des rénovations"
            value={scenario.renovationCost} 
            onChange={e => updateScenario(index, 'renovationCost', e.target.value)}
          />
        </Form.Group>
        
        {scenario.type === 'FLIP' ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Prix de vente ($)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Prix de vente"
                value={scenario.salePrice} 
                onChange={e => updateScenario(index, 'salePrice', e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Durée du projet (mois)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Durée en mois"
                value={scenario.monthsHeld} 
                onChange={e => updateScenario(index, 'monthsHeld', e.target.value)}
              />
            </Form.Group>
          </>
        ) : (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Nombre d'unités</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Nombre d'unités"
                value={scenario.units} 
                onChange={e => updateScenario(index, 'units', e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Revenus bruts annuels ($)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Revenus bruts annuels"
                value={scenario.grossAnnualRent} 
                onChange={e => updateScenario(index, 'grossAnnualRent', e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Mise de fonds (%)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Mise de fonds (%)"
                step="0.01"
                min="0.01"
                max="1"
                value={scenario.downPaymentRatio} 
                onChange={e => updateScenario(index, 'downPaymentRatio', e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Taux d'intérêt (%)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Taux d'intérêt"
                step="0.01"
                value={scenario.interestRate} 
                onChange={e => updateScenario(index, 'interestRate', e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Amortissement (années)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Amortissement"
                value={scenario.amortizationYears} 
                onChange={e => updateScenario(index, 'amortizationYears', e.target.value)}
              />
            </Form.Group>
          </>
        )}
      </div>
    );
  };
  
  /**
   * Affichage des résultats
   */
  const renderResults = () => {
    if (!results) return null;
    
    return (
      <Card className="mt-4">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">Résultats de la comparaison</h5>
        </Card.Header>
        <Card.Body>
          <h6>Résumé</h6>
          <p>{results.summary}</p>
          
          <h6>Meilleur scénario global</h6>
          <p><strong>{results.bestOverall.name}</strong></p>
          
          {results.scenarios.map((scenario, index) => (
            <Card key={scenario.id} className="mb-3" border={scenario.id === results.bestOverall.id ? 'success' : undefined}>
              <Card.Header>
                <h6 className="mb-0">{scenario.name} {scenario.id === results.bestOverall.id && '(Recommandé)'}</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p>Type: {scenario.analysis.type}</p>
                    <p>Investissement total: {scenario.analysis.investment.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                    {scenario.analysis.type === 'FLIP' ? (
                      <>
                        <p>Profit: {scenario.analysis.profit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                        <p>ROI: {scenario.analysis.roi.toFixed(2)}%</p>
                        <p>ROI annualisé: {scenario.analysis.annualizedRoi.toFixed(2)}%</p>
                      </>
                    ) : (
                      <>
                        <p>Mise de fonds: {scenario.analysis.downPayment.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                        <p>NOI: {scenario.analysis.noi.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                        <p>Taux de capitalisation: {scenario.analysis.capRate.toFixed(2)}%</p>
                        <p>Cashflow annuel: {scenario.analysis.cashflow.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                        <p>Cashflow mensuel par unité: {scenario.analysis.cashflowPerUnit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                        <p>Rendement sur mise de fonds: {scenario.analysis.cashOnCash.toFixed(2)}%</p>
                      </>
                    )}
                    <p>Score: {scenario.score.toFixed(2)}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>
    );
  };
  
  return (
    <Container>
      <h2 className="my-4">Comparaison de scénarios d'investissement</h2>
      
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <h4>Scénarios</h4>
            
            {scenarios.map((scenario, index) => (
              <Card key={index} className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Form.Group className="mb-0 flex-grow-1 me-2">
                    <Form.Control 
                      type="text" 
                      placeholder="Nom du scénario"
                      value={scenario.name} 
                      onChange={e => updateScenario(index, 'name', e.target.value)}
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => removeScenario(index)}
                    disabled={scenarios.length <= 1}
                  >
                    Supprimer
                  </Button>
                </Card.Header>
                
                <Card.Body>
                  {renderScenarioFields(scenario, index)}
                </Card.Body>
              </Card>
            ))}
            
            <Button 
              variant="outline-primary" 
              className="mb-4 w-100"
              onClick={addScenario}
            >
              Ajouter un scénario
            </Button>
          </Col>
          
          <Col md={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Options de comparaison</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Prioriser le cashflow?</Form.Label>
                  <Form.Select 
                    value={options.prioritizeCashflow} 
                    onChange={e => updateOption('prioritizeCashflow', e.target.value)}
                  >
                    <option value={true}>Oui</option>
                    <option value={false}>Non</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Poids du cashflow</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="1"
                    value={options.weightCashflow} 
                    onChange={e => updateOption('weightCashflow', e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Poids du taux de capitalisation</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="1"
                    value={options.weightCapRate} 
                    onChange={e => updateOption('weightCapRate', e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Poids du rendement sur investissement</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="1"
                    value={options.weightCashOnCash} 
                    onChange={e => updateOption('weightCashOnCash', e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Cashflow minimum par unité ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={options.minViableCashflowPerUnit} 
                    onChange={e => updateOption('minViableCashflowPerUnit', e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div className="d-grid gap-2 mb-4">
          <Button 
            variant="primary" 
            type="submit" 
            size="lg"
            disabled={loading}
          >
            {loading ? 'Analyse en cours...' : 'Comparer les scénarios'}
          </Button>
        </div>
      </Form>
      
      {renderResults()}
    </Container>
  );
};

export default ScenarioComparisonForm;
