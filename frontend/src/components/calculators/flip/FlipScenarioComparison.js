import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import flipCalculatorService from '../../../services/flipCalculatorService';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Composant de comparaison des scénarios FLIP
 * Permet de visualiser et comparer plusieurs scénarios côte-à-côte
 */
const FlipScenarioComparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const compareScenarios = async () => {
      if (!location.state?.scenarios || location.state.scenarios.length < 2) {
        toast.error("Données de scénarios insuffisantes pour la comparaison");
        navigate('/calculators/flip');
        return;
      }
      
      setIsLoading(true);
      try {
        // Extraire les données d'entrée de chaque scénario pour l'API
        const scenariosData = location.state.scenarios.map(s => s.inputData);
        
        // Si les résultats existent déjà dans les scénarios, les utiliser
        // Sinon, faire un appel API pour les calculer
        if (location.state.scenarios.every(s => s.results)) {
          setComparisonData({
            scenarios: location.state.scenarios,
            results: location.state.scenarios.map(s => s.results)
          });
        } else {
          const results = await flipCalculatorService.compareFlipScenarios(scenariosData);
          setComparisonData({
            scenarios: location.state.scenarios,
            results: results
          });
        }
      } catch (error) {
        toast.error("Erreur lors de la comparaison des scénarios: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    };
    
    compareScenarios();
  }, [location.state, navigate]);
  
  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement de la comparaison...</span>
          </div>
        </div>
        <p className="text-center mt-3">Chargement de la comparaison des scénarios...</p>
      </div>
    );
  }
  
  if (!comparisonData || !comparisonData.scenarios.length) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">Aucune donnée de comparaison disponible</h4>
          <p>Impossible de charger les données des scénarios. Veuillez retourner à l'écran principal et réessayer.</p>
          <button className="btn btn-primary" onClick={() => navigate('/calculators/flip')}>
            Retour au calculateur FLIP
          </button>
        </div>
      </div>
    );
  }
  
  // Formater les montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);
  };
  
  // Préparation des données pour le graphique
  const chartData = {
    labels: comparisonData.scenarios.map(s => s.scenarioName || 'Scénario sans nom'),
    datasets: [
      {
        label: 'Prix d\'achat',
        data: comparisonData.scenarios.map(s => s.inputData.acquisitionCosts.purchasePrice || 0),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Coûts de rénovation',
        data: comparisonData.scenarios.map(s => {
          const renovCosts = s.inputData.renovationCosts;
          return Object.keys(renovCosts)
            .filter(key => key !== 'contingencyPercentage')
            .reduce((sum, key) => sum + parseFloat(renovCosts[key] || 0), 0);
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Prix de vente',
        data: comparisonData.scenarios.map(s => s.inputData.revenue?.expectedSalePrice || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Profit net',
        data: comparisonData.results.map(r => r.netProfit || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      }
    ],
  };
  
  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparaison des Scénarios FLIP',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
  };
  
  return (
    <div className="container py-4">
      <h2 className="mb-4">Comparaison des Scénarios FLIP</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ height: '400px' }}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">Tableau comparatif</div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Métrique</th>
                  {comparisonData.scenarios.map((scenario, index) => (
                    <th key={index}>{scenario.scenarioName || `Scénario ${index + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prix d'achat</td>
                  {comparisonData.scenarios.map((scenario, index) => (
                    <td key={index}>
                      {formatCurrency(scenario.inputData.acquisitionCosts.purchasePrice)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Coûts de rénovation</td>
                  {comparisonData.scenarios.map((scenario, index) => {
                    const renovCosts = scenario.inputData.renovationCosts;
                    const total = Object.keys(renovCosts)
                      .filter(key => key !== 'contingencyPercentage')
                      .reduce((sum, key) => sum + parseFloat(renovCosts[key] || 0), 0);
                    
                    return (
                      <td key={index}>
                        {formatCurrency(total)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td>Prix de vente</td>
                  {comparisonData.scenarios.map((scenario, index) => (
                    <td key={index}>
                      {formatCurrency(scenario.inputData.revenue?.expectedSalePrice)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Profit net</td>
                  {comparisonData.results.map((result, index) => (
                    <td key={index} className={result.netProfit >= 0 ? 'text-success' : 'text-danger'}>
                      {formatCurrency(result.netProfit)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>ROI</td>
                  {comparisonData.results.map((result, index) => (
                    <td key={index} className={result.roi >= 0 ? 'text-success' : 'text-danger'}>
                      {(result.roi || 0).toFixed(2)}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Période de détention</td>
                  {comparisonData.scenarios.map((scenario, index) => (
                    <td key={index}>
                      {scenario.inputData.holdingCosts?.holdingPeriodMonths || 0} mois
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>ROI annualisé</td>
                  {comparisonData.results.map((result, index) => (
                    <td key={index} className={result.annualizedROI >= 0 ? 'text-success' : 'text-danger'}>
                      {(result.annualizedROI || 0).toFixed(2)}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Retour
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/calculators/flip/new')}
        >
          Nouveau calcul FLIP
        </button>
      </div>
    </div>
  );
};

export default FlipScenarioComparison;