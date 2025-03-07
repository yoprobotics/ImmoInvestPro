import React, { useState, useEffect } from 'react';
import { calculerFlip } from '../../utils/calculateurs';

/**
 * Composant pour le calculateur Napkin FLIP
 * Implémente la méthode FIP10 (Final-Initial-Prix des rénovations-10%)
 */
const CalculateurFlip = ({ onSave }) => {
  // Initialisation des états pour le formulaire
  const [formValues, setFormValues] = useState({
    prixFinal: '',
    prixInitial: '',
    prixRenovations: '',
    profitVise: '25000', // Valeur par défaut pour le profit visé
  });

  // État pour les résultats des calculs
  const [results, setResults] = useState(null);

  // État pour gérer les erreurs de validation
  const [errors, setErrors] = useState({});

  // Mode de calcul: "profit" ou "prixOffre"
  const [mode, setMode] = useState('profit');

  // Effectuer les calculs quand les valeurs du formulaire changent ou le mode change
  useEffect(() => {
    if (mode === 'profit') {
      // Ne calculer que si tous les champs nécessaires sont remplis
      if (
        formValues.prixFinal &&
        formValues.prixInitial &&
        formValues.prixRenovations
      ) {
        // Convertir les valeurs en nombres
        const params = {
          prixFinal: Number(formValues.prixFinal),
          prixInitial: Number(formValues.prixInitial),
          prixRenovations: Number(formValues.prixRenovations),
        };

        // Calculer les résultats
        const calculResults = calculerFlip(params);
        setResults(calculResults);
      } else {
        // Réinitialiser les résultats si un champ est vide
        setResults(null);
      }
    } else if (mode === 'prixOffre') {
      // Ne calculer que si tous les champs nécessaires sont remplis
      if (
        formValues.prixFinal &&
        formValues.prixRenovations &&
        formValues.profitVise
      ) {
        // Convertir les valeurs en nombres
        const params = {
          prixFinal: Number(formValues.prixFinal),
          prixRenovations: Number(formValues.prixRenovations),
          profitVise: Number(formValues.profitVise),
        };

        // Calculer les résultats
        const calculResults = calculerFlip(params);
        setResults(calculResults);
      } else {
        // Réinitialiser les résultats si un champ est vide
        setResults(null);
      }
    }
  }, [formValues, mode]);

  // Gestion des changements de champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validation: accepter seulement les nombres
    if (value === '' || /^[0-9]*$/.test(value)) {
      setFormValues({
        ...formValues,
        [name]: value,
      });

      // Effacer l'erreur pour ce champ
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null,
        });
      }
    }
  };

  // Validation du formulaire en fonction du mode
  const validateForm = () => {
    const newErrors = {};
    
    // Champs communs requis pour les deux modes
    if (!formValues.prixFinal) {
      newErrors.prixFinal = 'Le prix final est requis';
    }
    
    if (!formValues.prixRenovations) {
      newErrors.prixRenovations = 'Le coût des rénovations est requis';
    }
    
    if (mode === 'profit' && !formValues.prixInitial) {
      newErrors.prixInitial = 'Le prix initial est requis';
    }
    
    if (mode === 'prixOffre' && !formValues.profitVise) {
      newErrors.profitVise = 'Le profit visé est requis';
    }
    
    setErrors(newErrors);
    
    // Retourner true si aucune erreur
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Sauvegarder l'analyse
      if (onSave && results) {
        onSave(formValues, results);
      }
    }
  };

  // Gestion du changement de mode
  const handleModeChange = (newMode) => {
    setMode(newMode);
    
    // Réinitialiser les erreurs lors du changement de mode
    setErrors({});
  };

  // Gestion de la réinitialisation du formulaire
  const handleReset = () => {
    setFormValues({
      prixFinal: '',
      prixInitial: '',
      prixRenovations: '',
      profitVise: '25000',
    });
    setResults(null);
    setErrors({});
    setMode('profit');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
            <span className="font-bold">?</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Calculateur Napkin FLIP (FIP10)</h2>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          La méthode FIP10 (Final-Initial-Prix des rénovations-10%) permet d'évaluer rapidement la rentabilité d'un projet de flip immobilier.
          L'objectif est d'obtenir au moins 25 000$ de profit.
        </p>
      </div>

      {/* Tabs pour changer de mode */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleModeChange('profit')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                mode === 'profit'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Calculer le profit
            </button>
            <button
              onClick={() => handleModeChange('prixOffre')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                mode === 'prixOffre'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Calculer le prix d'offre maximum
            </button>
          </nav>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="prixFinal" className="block text-sm font-medium text-gray-700 mb-1">
              Prix final (après travaux) ($)
            </label>
            <input
              type="text"
              name="prixFinal"
              id="prixFinal"
              value={formValues.prixFinal}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                errors.prixFinal ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 350000"
            />
            {errors.prixFinal && (
              <p className="mt-1 text-sm text-red-500">{errors.prixFinal}</p>
            )}
          </div>

          {mode === 'profit' && (
            <div>
              <label htmlFor="prixInitial" className="block text-sm font-medium text-gray-700 mb-1">
                Prix initial (achat) ($)
              </label>
              <input
                type="text"
                name="prixInitial"
                id="prixInitial"
                value={formValues.prixInitial}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                  errors.prixInitial ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 250000"
              />
              {errors.prixInitial && (
                <p className="mt-1 text-sm text-red-500">{errors.prixInitial}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="prixRenovations" className="block text-sm font-medium text-gray-700 mb-1">
              Coût des rénovations ($)
            </label>
            <input
              type="text"
              name="prixRenovations"
              id="prixRenovations"
              value={formValues.prixRenovations}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                errors.prixRenovations ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 40000"
            />
            {errors.prixRenovations && (
              <p className="mt-1 text-sm text-red-500">{errors.prixRenovations}</p>
            )}
          </div>

          {mode === 'prixOffre' && (
            <div>
              <label htmlFor="profitVise" className="block text-sm font-medium text-gray-700 mb-1">
                Profit visé ($)
              </label>
              <input
                type="text"
                name="profitVise"
                id="profitVise"
                value={formValues.profitVise}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                  errors.profitVise ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 25000"
              />
              {errors.profitVise && (
                <p className="mt-1 text-sm text-red-500">{errors.profitVise}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
          >
            {mode === 'profit' ? 'Calculer le profit' : 'Calculer le prix d\'offre'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {results && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Résultats du calcul
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Frais divers (10% du prix final)</p>
              <p className="font-medium text-gray-900">
                {results.fraisDivers.toLocaleString('fr-CA')} $
              </p>
            </div>

            {results.modeCalcul === 'profit' && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Profit estimé</p>
                <p className={`font-bold ${
                  results.profitSuffisant ? 'text-green-600' : 'text-red-600'
                }`}>
                  {results.profit.toLocaleString('fr-CA')} $
                </p>
              </div>
            )}

            {results.modeCalcul === 'prixOffre' && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Prix d'offre maximum</p>
                <p className="font-bold text-green-600">
                  {results.prixOffreMaximum.toLocaleString('fr-CA')} $
                </p>
              </div>
            )}
          </div>

          {results.modeCalcul === 'profit' && (
            <div className="mt-6 p-4 rounded-md bg-gray-50 border border-gray-200">
              <p className="font-medium text-gray-900 mb-2">Analyse de rentabilité :</p>
              <p className={`${results.profitSuffisant ? 'text-green-600' : 'text-red-600'}`}>
                {results.profitSuffisant
                  ? `✅ Rentable - Génère un profit de ${results.profit.toLocaleString('fr-CA')}$, ce qui dépasse l'objectif de 25 000$.`
                  : `❌ Non rentable - Génère un profit de seulement ${results.profit.toLocaleString('fr-CA')}$, ce qui est inférieur à l'objectif de 25 000$.`}
              </p>
              {!results.profitSuffisant && (
                <p className="mt-1 text-blue-600">
                  Suggestions :
                  <ul className="list-disc list-inside mt-1">
                    <li>Réduire le prix d'achat</li>
                    <li>Réduire le coût des rénovations</li>
                    <li>Augmenter le prix de vente via des rénovations stratégiques</li>
                  </ul>
                </p>
              )}
            </div>
          )}

          {results.modeCalcul === 'prixOffre' && (
            <div className="mt-6 p-4 rounded-md bg-gray-50 border border-gray-200">
              <p className="font-medium text-gray-900 mb-2">Résultat du calcul :</p>
              <p className="text-green-600">
                Pour obtenir un profit de {Number(formValues.profitVise).toLocaleString('fr-CA')}$, le prix d'achat maximum est de {results.prixOffreMaximum.toLocaleString('fr-CA')}$.
              </p>
              <p className="mt-2 text-gray-600 text-sm">
                Ce calcul prend en compte le prix de vente estimé de {Number(formValues.prixFinal).toLocaleString('fr-CA')}$, 
                un coût de rénovation de {Number(formValues.prixRenovations).toLocaleString('fr-CA')}$ et 
                des frais divers estimés à 10% du prix de vente ({results.fraisDivers.toLocaleString('fr-CA')}$).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculateurFlip;
