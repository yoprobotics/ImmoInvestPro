import React, { useState } from 'react';

/**
 * Calculateur Napkin FLIP - Implémentation de la méthode FIP10
 * @param {Object} props - Props du composant
 * @param {Object} props.initialValues - Valeurs initiales du formulaire
 * @param {Function} props.onCalculate - Fonction appelée après un calcul réussi
 * @param {Function} props.onSave - Fonction pour sauvegarder l'analyse
 * @param {Function} props.onReset - Fonction pour réinitialiser le formulaire
 * @param {string} props.mode - "napkin" (par défaut) ou "detailed" pour afficher les options avancées
 */
const CalculateurFlip = ({
  initialValues = {
    prixFinal: '',
    prixInitial: '',
    prixRenovations: '',
    profitVise: '25000',
  },
  onCalculate = () => {},
  onSave = () => {},
  onReset = () => {},
  mode: initialMode = 'napkin',
}) => {
  // États du composant
  const [formValues, setFormValues] = useState(initialValues);
  const [results, setResults] = useState(null);
  const [mode, setMode] = useState(initialMode);
  const [calcMode, setCalcMode] = useState('profit'); // profit ou prix_offre
  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Gestionnaires d'événements
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (calcMode === 'profit') {
      // Validation pour le mode de calcul du profit
      const { prixFinal, prixInitial, prixRenovations } = formValues;
      
      if (!prixFinal || isNaN(prixFinal) || parseFloat(prixFinal) <= 0) {
        newErrors.prixFinal = 'Veuillez entrer un prix de revente valide';
      }
      
      if (!prixInitial || isNaN(prixInitial) || parseFloat(prixInitial) <= 0) {
        newErrors.prixInitial = 'Veuillez entrer un prix d\'achat valide';
      }
      
      if (!prixRenovations || isNaN(prixRenovations)) {
        newErrors.prixRenovations = 'Veuillez entrer un coût de rénovations valide';
      }
    } else {
      // Validation pour le mode de calcul du prix d'offre
      const { prixFinal, prixRenovations, profitVise } = formValues;
      
      if (!prixFinal || isNaN(prixFinal) || parseFloat(prixFinal) <= 0) {
        newErrors.prixFinal = 'Veuillez entrer un prix de revente valide';
      }
      
      if (!prixRenovations || isNaN(prixRenovations)) {
        newErrors.prixRenovations = 'Veuillez entrer un coût de rénovations valide';
      }
      
      if (!profitVise || isNaN(profitVise) || parseFloat(profitVise) < 0) {
        newErrors.profitVise = 'Veuillez entrer un profit visé valide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction principale de calcul
  const calculate = () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    try {
      if (calcMode === 'profit') {
        // Calcul du profit avec la méthode FIP10
        const prixFinal = parseFloat(formValues.prixFinal);
        const prixInitial = parseFloat(formValues.prixInitial);
        const prixRenovations = parseFloat(formValues.prixRenovations || 0);
        
        const pourcentageFrais = 10; // 10% pour représenter tous les frais
        const frais = prixFinal * (pourcentageFrais / 100);
        
        const profit = prixFinal - prixInitial - prixRenovations - frais;
        const profitPourcentage = (profit / (prixInitial + prixRenovations)) * 100;
        
        // Préparation des résultats
        const calculationResults = {
          prixFinal,
          prixInitial,
          prixRenovations,
          frais,
          profit,
          profitPourcentage,
          profitSuffisant: profit >= 25000,
          pourcentageFrais
        };
        
        setResults(calculationResults);
        onCalculate(calculationResults);
      } else {
        // Calcul du prix d'offre optimal
        const prixFinal = parseFloat(formValues.prixFinal);
        const prixRenovations = parseFloat(formValues.prixRenovations || 0);
        const profitVise = parseFloat(formValues.profitVise || 25000);
        
        const pourcentageFrais = 10; // 10% pour représenter tous les frais
        const frais = prixFinal * (pourcentageFrais / 100);
        
        const prixOffreMaximum = prixFinal - prixRenovations - frais - profitVise;
        
        // Préparation des résultats
        const calculationResults = {
          prixFinal,
          prixRenovations,
          profitVise,
          frais,
          prixOffreMaximum,
          pourcentageFrais
        };
        
        setResults(calculationResults);
        onCalculate(calculationResults);
      }
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Réinitialisation du formulaire
  const reset = () => {
    setFormValues(initialValues);
    setResults(null);
    setErrors({});
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Calculateur Napkin FLIP (FIP10)</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              mode === 'napkin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setMode('napkin')}
          >
            Mode Napkin
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              mode === 'detailed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setMode('detailed')}
          >
            Mode Détaillé
          </button>
        </div>
      </div>

      {/* Onglets pour choisir le mode de calcul */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex -mb-px">
          <button
            className={`py-2 px-4 text-center ${
              calcMode === 'profit'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setCalcMode('profit')}
          >
            Calculer le profit
          </button>
          <button
            className={`py-2 px-4 text-center ${
              calcMode === 'prix_offre'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setCalcMode('prix_offre')}
          >
            Calculer le prix d'offre
          </button>
        </div>
      </div>

      {/* Formulaire de saisie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix final (valeur de revente) ($)
          </label>
          <input
            type="number"
            name="prixFinal"
            value={formValues.prixFinal}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md ${
              errors.prixFinal ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 350000"
          />
          {errors.prixFinal && (
            <p className="text-red-500 text-sm mt-1">{errors.prixFinal}</p>
          )}
        </div>

        {calcMode === 'profit' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix initial (prix d'achat) ($)
            </label>
            <input
              type="number"
              name="prixInitial"
              value={formValues.prixInitial}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.prixInitial ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 250000"
            />
            {errors.prixInitial && (
              <p className="text-red-500 text-sm mt-1">{errors.prixInitial}</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profit visé ($)
            </label>
            <input
              type="number"
              name="profitVise"
              value={formValues.profitVise}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.profitVise ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 25000"
            />
            {errors.profitVise && (
              <p className="text-red-500 text-sm mt-1">{errors.profitVise}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix des rénovations ($)
          </label>
          <input
            type="number"
            name="prixRenovations"
            value={formValues.prixRenovations}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md ${
              errors.prixRenovations ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 30000"
          />
          {errors.prixRenovations && (
            <p className="text-red-500 text-sm mt-1">{errors.prixRenovations}</p>
          )}
        </div>
      </div>

      {/* Options supplémentaires pour le mode détaillé */}
      {mode === 'detailed' && (
        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Options avancées</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Options avancées ici */}
            <p className="text-gray-500 col-span-3">
              Le mode détaillé sera implémenté prochainement.
            </p>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={calculate}
          disabled={isCalculating}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isCalculating ? 'Calcul en cours...' : 'Calculer'}
        </button>
      </div>

      {/* Résultats */}
      {results && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Résultats</h3>

          {calcMode === 'profit' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Prix final (revente):</span>
                  <span className="font-medium">{results.prixFinal.toFixed(2)} $</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Prix initial (achat):</span>
                  <span className="font-medium">{results.prixInitial.toFixed(2)} $</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Prix des rénovations:</span>
                  <span className="font-medium">{results.prixRenovations.toFixed(2)} $</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Frais ({results.pourcentageFrais}% du prix de revente):</span>
                  <span className="font-medium">{results.frais.toFixed(2)} $</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Profit estimé:</span>
                  <span className={`font-bold ${results.profitSuffisant ? 'text-green-600' : 'text-red-600'}`}>
                    {results.profit.toFixed(2)} $
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Rendement sur investissement:</span>
                  <span className="font-medium">{results.profitPourcentage.toFixed(2)} %</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Prix final (revente):</span>
                  <span className="font-medium">{results.prixFinal.toFixed(2)} $</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Prix des rénovations:</span>
                  <span className="font-medium">{results.prixRenovations.toFixed(2)} $</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Profit visé:</span>
                  <span className="font-medium">{results.profitVise.toFixed(2)} $</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Frais ({results.pourcentageFrais}% du prix de revente):</span>
                  <span className="font-medium">{results.frais.toFixed(2)} $</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Prix d'offre maximum recommandé:</span>
                  <span className="font-bold text-blue-600">{results.prixOffreMaximum.toFixed(2)} $</span>
                </p>
              </div>
            </div>
          )}

          {/* Message de verdict */}
          <div className={`mt-6 p-4 rounded-md ${
            calcMode === 'profit' 
              ? (results.profitSuffisant ? 'bg-green-100' : 'bg-red-100')
              : 'bg-blue-100'
          }`}>
            {calcMode === 'profit' ? (
              <p className={`font-bold ${results.profitSuffisant ? 'text-green-700' : 'text-red-700'}`}>
                {results.profitSuffisant
                  ? `✅ Ce flip est rentable avec un profit estimé de ${results.profit.toFixed(0)} $.`
                  : `⚠️ Ce flip n'est pas assez rentable. Le profit estimé de ${results.profit.toFixed(0)} $ est inférieur à l'objectif recommandé de 25 000 $.`}
              </p>
            ) : (
              <p className="font-bold text-blue-700">
                💡 Pour atteindre un profit de {results.profitVise.toFixed(0)} $, vous devriez offrir un maximum de {results.prixOffreMaximum.toFixed(0)} $.
              </p>
            )}
          </div>

          {/* Bouton de sauvegarde */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => onSave(formValues, results)}
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Sauvegarder cette analyse
            </button>
          </div>
        </div>
      )}

      {/* Lien vers la documentation */}
      <div className="mt-4 text-sm text-gray-600">
        <a 
          href="https://github.com/yoprobotics/ImmoInvestPro/blob/main/docs/calculateurs/napkin-flip.md" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Consulter la documentation complète
        </a>
      </div>
    </div>
  );
};

export default CalculateurFlip;
