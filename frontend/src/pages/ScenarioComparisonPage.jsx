import React from 'react';
import { Container } from 'react-bootstrap';
import ScenarioComparisonForm from '../components/ScenarioComparison/ScenarioComparisonForm';

/**
 * Page de comparaison de scénarios d'investissement
 */
const ScenarioComparisonPage = () => {
  return (
    <Container>
      <div className="py-4">
        <h1>Comparaison de scénarios d'investissement</h1>
        <p className="lead">
          Cet outil vous permet de comparer différents scénarios d'investissement immobilier
          (Flips et Multis) pour déterminer la meilleure option selon vos critères.
        </p>
        
        <hr className="my-4" />
        
        <ScenarioComparisonForm />
      </div>
    </Container>
  );
};

export default ScenarioComparisonPage;
