import React, { useState } from 'react';
import CalculateurFlip from '../CalculateurFlip/CalculateurFlip';
import CalculateurMulti from '../CalculateurMulti/CalculateurMulti';

/**
 * Page principale des calculateurs Napkin
 * Permet de passer d'un calculateur à l'autre
 */
const CalculateursPage = () => {
  const [activeCalculator, setActiveCalculator] = useState('multi'); // 'multi' ou 'flip'
  const [savedAnalyses, setSavedAnalyses] = useState({
    multi: [],
    flip: []
  });

  // Enregistrer une analyse
  const handleSaveAnalysis = (type, formValues, results) => {
    const newAnalysis = {
      id: Date.now(),
      date: new Date().toISOString(),
      formValues,
      results,
    };

    setSavedAnalyses((prev) => ({
      ...prev,
      [type]: [...prev[type], newAnalysis],
    }));
  };

  // Supprimer une analyse
  const handleDeleteAnalysis = (type, id) => {
    setSavedAnalyses((prev) => ({
      ...prev,
      [type]: prev[type].filter((analysis) => analysis.id !== id),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Calculateurs Napkin - Analyse rapide
      </h1>

      {/* Onglets pour switcher entre les calculateurs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex justify-center -mb-px">
          <button
            className={`px-6 py-3 text-center ${
              activeCalculator === 'multi'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveCalculator('multi')}
          >
            Calculateur MULTI
          </button>
          <button
            className={`px-6 py-3 text-center ${
              activeCalculator === 'flip'
                ? 'border-b-2 border-green-500 text-green-600 font-medium'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveCalculator('flip')}
          >
            Calculateur FLIP
          </button>
        </div>
      </div>

      {/* Affichage du calculateur actif */}
      <div className="mb-12">
        {activeCalculator === 'multi' ? (
          <CalculateurMulti
            onSave={(formValues, results) => handleSaveAnalysis('multi', formValues, results)}
          />
        ) : (
          <CalculateurFlip
            onSave={(formValues, results) => handleSaveAnalysis('flip', formValues, results)}
          />
        )}
      </div>

      {/* Analyses sauvegardées */}
      {savedAnalyses[activeCalculator].length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Analyses sauvegardées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedAnalyses[activeCalculator].map((analysis) => (
              <div
                key={analysis.id}
                className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Analyse du {new Date(analysis.date).toLocaleDateString()}
                  </h3>
                  <button
                    onClick={() => handleDeleteAnalysis(activeCalculator, analysis.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Supprimer l'analyse"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {activeCalculator === 'multi' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">Prix d'achat:</div>
                      <div className="font-medium text-right">{Number(analysis.formValues.prixAchat).toLocaleString('fr-CA')} $</div>
                      
                      <div className="text-gray-600">Nombre d'appartements:</div>
                      <div className="font-medium text-right">{analysis.formValues.nombreAppartements}</div>
                      
                      <div className="text-gray-600">Revenus bruts:</div>
                      <div className="font-medium text-right">{Number(analysis.formValues.revenusBruts).toLocaleString('fr-CA')} $</div>
                      
                      <div className="text-gray-600">Liquidité par porte/mois:</div>
                      <div className={`font-bold text-right ${
                        analysis.results.liquiditeParPorteMois >= 75 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {analysis.results.liquiditeParPorteMois.toFixed(2)} $
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        analysis.results.objectifAtteint ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {analysis.results.objectifAtteint ? 'Rentable' : 'Non rentable'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">Prix final:</div>
                      <div className="font-medium text-right">{Number(analysis.formValues.prixFinal).toLocaleString('fr-CA')} $</div>
                      
                      {analysis.results.modeCalcul === 'profit' ? (
                        <>
                          <div className="text-gray-600">Prix initial:</div>
                          <div className="font-medium text-right">{Number(analysis.formValues.prixInitial).toLocaleString('fr-CA')} $</div>
                          
                          <div className="text-gray-600">Coût des rénovations:</div>
                          <div className="font-medium text-right">{Number(analysis.formValues.prixRenovations).toLocaleString('fr-CA')} $</div>
                          
                          <div className="text-gray-600">Profit:</div>
                          <div className={`font-bold text-right ${
                            analysis.results.profitSuffisant ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {analysis.results.profit.toLocaleString('fr-CA')} $
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-gray-600">Coût des rénovations:</div>
                          <div className="font-medium text-right">{Number(analysis.formValues.prixRenovations).toLocaleString('fr-CA')} $</div>
                          
                          <div className="text-gray-600">Profit visé:</div>
                          <div className="font-medium text-right">{Number(analysis.formValues.profitVise).toLocaleString('fr-CA')} $</div>
                          
                          <div className="text-gray-600">Prix d'offre max:</div>
                          <div className="font-bold text-right text-green-600">
                            {analysis.results.prixOffreMaximum.toLocaleString('fr-CA')} $
                          </div>
                        </>
                      )}
                    </div>
                    {analysis.results.modeCalcul === 'profit' && (
                      <div className="mt-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysis.results.profitSuffisant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {analysis.results.profitSuffisant ? 'Rentable' : 'Non rentable'}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Information sur les calculateurs */}
      <div className="mt-16 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">À propos des calculateurs Napkin</h2>
        <p className="text-blue-700 mb-4">
          Les calculateurs Napkin sont conçus pour évaluer rapidement la rentabilité potentielle d'un investissement immobilier,
          avant de procéder à une analyse détaillée.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Calculateur MULTI (PAR)</h3>
            <p className="text-blue-700 text-sm">
              Utilise la méthode PAR (Prix-Appartements-Revenus) et HIGH-5 pour évaluer rapidement la rentabilité d'un immeuble 
              à revenus. L'objectif est d'obtenir au moins 75$ de liquidité par porte par mois.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Calculateur FLIP (FIP10)</h3>
            <p className="text-blue-700 text-sm">
              Utilise la méthode FIP10 (Final-Initial-Prix des rénovations-10%) pour évaluer rapidement la rentabilité d'un projet
              de transformation immobilière. L'objectif est d'obtenir au moins 25 000$ de profit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculateursPage;