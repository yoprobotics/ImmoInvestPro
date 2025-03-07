import React from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Enregistrer les composants de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Composant d'affichage des résultats du calculateur FLIP
 * Affiche les indicateurs clés et un graphique de répartition des coûts
 */
const ResultsSection = ({ results }) => {
  // Si pas de résultats à afficher
  if (!results) {
    return (
      <div className="card mb-4">
        <div className="card-header">Résultats</div>
        <div className="card-body">
          <div className="alert alert-info">
            Cliquez sur "Calculer" pour voir les résultats de votre projet FLIP.
          </div>
        </div>
      </div>
    );
  }

  // Formater les montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  // Formater les pourcentages
  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Données pour le graphique en camembert
  const chartData = {
    labels: [
      'Coûts d\'acquisition', 
      'Coûts de rénovation', 
      'Coûts de possession',
      'Coûts de vente', 
      'Coûts de financement'
    ],
    datasets: [
      {
        data: [
          results.breakdownByCategory?.acquisitionCosts || 0,
          results.breakdownByCategory?.renovationCosts || 0,
          results.breakdownByCategory?.holdingCosts || 0,
          results.breakdownByCategory?.sellingCosts || 0,
          results.breakdownByCategory?.financingCosts || 0
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += formatCurrency(context.raw);
            }
            return label;
          }
        }
      }
    }
  };

  // Classes conditionnelles pour afficher les résultats positifs/négatifs
  const getProfitClass = (value) => {
    return value >= 0 ? 'text-success' : 'text-danger';
  };

  return (
    <div className="card mb-4">
      <div className="card-header">Résultats</div>
      <div className="card-body">
        {/* Résultats principaux */}
        <div className="p-3 mb-3 bg-light rounded">
          <h5 className={`mb-3 ${getProfitClass(results.netProfit)}`}>
            Profit net: {formatCurrency(results.netProfit || 0)}
          </h5>
          
          <div className="row">
            <div className="col-sm-6">
              <div className="mb-2">
                <strong>ROI:</strong> <span className={getProfitClass(results.roi)}>{formatPercent(results.roi || 0)}</span>
              </div>
              <div className="mb-2">
                <strong>ROI annualisé:</strong> <span className={getProfitClass(results.annualizedROI)}>{formatPercent(results.annualizedROI || 0)}</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mb-2">
                <strong>Cash sur cash:</strong> <span className={getProfitClass(results.cashOnCash)}>{formatPercent(results.cashOnCash || 0)}</span>
              </div>
              <div className="mb-2">
                <strong>Seuil de rentabilité:</strong> {formatCurrency(results.breakEvenPrice || 0)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Détails des coûts */}
        <div className="row mb-3">
          <div className="col-sm-6">
            <div className="mb-2">
              <strong>Investissement total:</strong> {formatCurrency(results.totalInvestment || 0)}
            </div>
            <div className="mb-2">
              <strong>Total des coûts:</strong> {formatCurrency(results.totalCosts || 0)}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="mb-2">
              <strong>Coûts d'acquisition:</strong> {formatCurrency(results.breakdownByCategory?.acquisitionCosts || 0)}
            </div>
            <div className="mb-2">
              <strong>Coûts de rénovation:</strong> {formatCurrency(results.breakdownByCategory?.renovationCosts || 0)}
            </div>
          </div>
        </div>
        
        {/* Graphique */}
        <div style={{ height: '220px' }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

ResultsSection.propTypes = {
  results: PropTypes.object
};

export default ResultsSection;