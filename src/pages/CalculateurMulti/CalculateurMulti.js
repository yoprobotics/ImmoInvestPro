import React, { useState } from 'react';

/**
 * Calculateur Napkin MULTI - Implémentation des méthodes PAR et HIGH-5
 * @param {Object} props - Props du composant
 * @param {Object} props.initialValues - Valeurs initiales du formulaire
 * @param {Function} props.onCalculate - Fonction appelée après un calcul réussi
 * @param {Function} props.onSave - Fonction pour sauvegarder l'analyse
 * @param {Function} props.onReset - Fonction pour réinitialiser le formulaire
 * @param {string} props.mode - "napkin" (par défaut) ou "detailed" pour afficher les options avancées
 */
const CalculateurMulti = ({
  initialValues = {
    prixAchat: '',
    nombreAppartements: '',
    revenusBruts: '',
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
    const { prixAchat, nombreAppartements, revenusBruts } = formValues;

    if (!prixAchat || isNaN(prixAchat) || parseFloat(prixAchat) <= 0) {
      newErrors.prixAchat = 'Veuillez entrer un prix d\'achat valide';
    }

    if (!nombreAppartements || isNaN(nombreAppartements) || parseInt(nombreAppartements) <= 0) {
      newErrors.nombreAppartements = 'Veuillez entrer un nombre d\'appartements valide';
    }

    if (!revenusBruts || isNaN(revenusBruts) || parseFloat(revenusBruts) <= 0) {
      newErrors.revenusBruts = 'Veuillez entrer des revenus bruts valides';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calcul du taux de dépenses selon le nombre de logements
  const calculerTauxDepenses = (nombreLogements) => {
    if (nombreLogements <= 2) return 30;
    if (nombreLogements <= 4) return 35;
    if (nombreLogements <= 6) return 45;
    return 50;
  };

  // Fonction principale de calcul
  const calculate = () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    try {
      // Conversion des valeurs du formulaire
      const prixAchat = parseFloat(formValues.prixAchat);
      const nombreAppartements = parseInt(formValues.nombreAppartements);
      const revenusBruts = parseFloat(formValues.revenusBruts);

      // Détermination du taux de dépenses
      const tauxDepenses = calculerTauxDepenses(nombreAppartements);

      // Calcul des dépenses d'opération
      const depensesOperation = revenusBruts * (tauxDepenses / 100);

      // Calcul du RNO (Revenu Net d'Opération)
      const revenusNetsOperation = revenusBruts - depensesOperation;

      // Calcul du financement annuel (méthode HIGH-5)
      const paiementMensuel = prixAchat * 0.005;
      const financementAnnuel = paiementMensuel * 12;

      // Calcul de la liquidité
      const liquiditeAnnuelle = revenusNetsOperation - financementAnnuel;
      const liquiditeParPorteMois = liquiditeAnnuelle / nombreAppartements / 12;

      // Calcul du prix d'achat maximum pour 75$/porte/mois
      const liquiditeCible = 75 * nombreAppartements * 12; // 75$ par porte par mois
      const financementMaximum = revenusNetsOperation - liquiditeCible;
      const prixAchatMaximum = (financementMaximum / 12) / 0.005;

      // Préparation des résultats
      const calculationResults = {
        tauxDepenses,
        depensesOperation,
        revenusNetsOperation,
        financementAnnuel,
        liquiditeAnnuelle,
        liquiditeParPorteMois,
        prixAchatMaximum,
        reductionSuggere: Math.max(0, prixAchat - prixAchatMaximum),
        objectifAtteint: liquiditeParPorteMois >= 75
      };

      setResults(calculationResults);
      onCalculate(calculationResults);
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
        <h2 className="text-2xl font-bold text-gray-800">Calculateur Napkin MULTI</h2>
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

      {/* Formulaire de saisie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix d'achat ($)
          </label>
          <input
            type="number"
            name="prixAchat"
            value={formValues.prixAchat}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md ${
              errors.prixAchat ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 500000"
          />
          {errors.prixAchat && (
            <p className="text-red-500 text-sm mt-1">{errors.prixAchat}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre d'appartements
          </label>
          <input
            type="number"
            name="nombreAppartements"
            value={formValues.nombreAppartements}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md ${
              errors.nombreAppartements ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 6"
          />
          {errors.nombreAppartements && (
            <p className="text-red-500 text-sm mt-1">{errors.nombreAppartements}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Revenus bruts annuels ($)
          </label>
          <input
            type="number"
            name="revenusBruts"
            value={formValues.revenusBruts}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md ${
              errors.revenusBruts ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 60000"
          />
          {errors.revenusBruts && (
            <p className="text-red-500 text-sm mt-1">{errors.revenusBruts}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Taux de dépenses:</span>
                <span className="font-medium">{results.tauxDepenses}%</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Dépenses d'opération:</span>
                <span className="font-medium">{results.depensesOperation.toFixed(2)} $</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Revenus nets d'opération (RNO):</span>
                <span className="font-medium">{results.revenusNetsOperation.toFixed(2)} $</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Financement annuel (HIGH-5):</span>
                <span className="font-medium">{results.financementAnnuel.toFixed(2)} $</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Liquidité annuelle:</span>
                <span className="font-medium">{results.liquiditeAnnuelle.toFixed(2)} $</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Liquidité par porte/mois:</span>
                <span className={`font-bold ${results.objectifAtteint ? 'text-green-600' : 'text-red-600'}`}>
                  {results.liquiditeParPorteMois.toFixed(2)} $
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Prix d'achat maximum pour 75$/porte/mois:</span>
                <span className="font-medium">{results.prixAchatMaximum.toFixed(2)} $</span>
              </p>
              {results.reductionSuggere > 0 && (
                <p className="flex justify-between">
                  <span className="text-gray-600">Réduction suggérée:</span>
                  <span className="font-medium text-red-600">{results.reductionSuggere.toFixed(2)} $</span>
                </p>
              )}
            </div>
          </div>

          {/* Message de verdict */}
          <div className={`mt-6 p-4 rounded-md ${results.objectifAtteint ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={`font-bold ${results.objectifAtteint ? 'text-green-700' : 'text-red-700'}`}>
              {results.objectifAtteint
                ? '✅ Cet immeuble atteint l\'objectif de rentabilité de 75$/porte/mois.'
                : '⚠️ Cet immeuble n\'atteint pas l\'objectif de rentabilité de 75$/porte/mois.'}
            </p>
            {!results.objectifAtteint && (
              <p className="mt-2 text-red-600">
                Pour atteindre l'objectif, il faudrait offrir un maximum de {results.prixAchatMaximum.toFixed(0)} $ 
                (soit {((results.prixAchatMaximum / parseFloat(formValues.prixAchat)) * 100).toFixed(1)}% du prix demandé).
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
          href="https://github.com/yoprobotics/ImmoInvestPro/blob/main/docs/calculateurs/napkin-multi.md" 
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

export default CalculateurMulti;
