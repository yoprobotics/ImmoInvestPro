import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant de gestion des scénarios pour le calculateur FLIP
 * Permet de créer, sélectionner et comparer différents scénarios
 */
const ScenarioManager = ({ 
  scenarios = [], 
  activeScenario = 0, 
  onAddScenario, 
  onSwitchScenario, 
  onCompareScenarios 
}) => {
  return (
    <div className="scenario-manager card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Scénarios</h5>
          <div>
            <button 
              className="btn btn-success btn-sm me-2" 
              onClick={onAddScenario}
              title="Créer un nouveau scénario basé sur le scénario actuel"
            >
              <i className="fas fa-plus me-1"></i> Nouveau scénario
            </button>
            
            {scenarios.length >= 2 && (
              <button 
                className="btn btn-info btn-sm"
                onClick={onCompareScenarios}
                title="Comparer tous les scénarios"
              >
                <i className="fas fa-chart-bar me-1"></i> Comparer
              </button>
            )}
          </div>
        </div>
        
        {scenarios.length > 0 ? (
          <div className="scenario-tabs">
            <ul className="nav nav-tabs">
              {scenarios.map((scenario, index) => (
                <li className="nav-item" key={index}>
                  <button
                    className={`nav-link ${index === activeScenario ? 'active' : ''}`}
                    onClick={() => onSwitchScenario(index)}
                  >
                    {scenario.scenarioName || `Scénario ${index + 1}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="alert alert-info mb-0">
            Aucun scénario créé. Cliquez sur "Nouveau scénario" pour commencer.
          </div>
        )}
      </div>
    </div>
  );
};

ScenarioManager.propTypes = {
  scenarios: PropTypes.array,
  activeScenario: PropTypes.number,
  onAddScenario: PropTypes.func.isRequired,
  onSwitchScenario: PropTypes.func.isRequired,
  onCompareScenarios: PropTypes.func.isRequired
};

export default ScenarioManager;