import React, { useState, useEffect } from 'react';
import { calculerMulti } from '../../utils/calculateurs';

/**
 * Composant pour le calculateur Napkin MULTI
 * Implémente la méthode PAR (Prix-Appartements-Revenus) et HIGH-5
 */
const CalculateurMulti = ({ onSave }) => {
  // Initialisation des états pour le formulaire
  const [formValues, setFormValues] = useState({
    prixAchat: '',
    nombreAppartements: '',
    revenusBruts: '',
  });

  // État pour les résultats des calculs
  const [results, setResults] = useState(null);

  // État pour gérer les erreurs de validation
  const [errors, setErrors] = useState({});

  // Mode de calcul: "evaluer" ou "offreMax"
  const [mode, setMode] = useState('evaluer');

  // Effectuer les calculs quand les valeurs du formulaire changent
  useEffect(() => {
    // Ne calculer que si tous les champs sont remplis
    if (
      formValues.prixAchat &&
      formValues.nombreAppartements &&
      formValues.revenusBruts
    ) {
      // Convertir les valeurs en nombres
      const params = {
        prixAchat: Number(formValues.prixAchat),
        nombreAppartements: Number(formValues.nombreAppartements),
        revenusBruts: Number(formValues.revenusBruts),
      };

      // Calculer les résultats
      const calculResults = calculerMulti(params);
      setResults(calculResults);
    } else {
      // Réinitialiser les résultats si un champ est vide
      setResults(null);
    }
  }, [formValues]);

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

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Vérifier que tous les champs requis sont remplis
    if (!formValues.prixAchat) {
      newErrors.prixAchat = 'Le prix d\'achat est requis';
    }
    
    if (!formValues.nombreAppartements) {
      newErrors.nombreAppartements = 'Le nombre d\'appartements est requis';
    } else if (Number(formValues.nombreAppartements) < 1) {
      newErrors.nombreAppartements = 'Le nombre d\'appartements doit être au moins 1';
    }
    
    if (!formValues.revenusBruts) {
      newErrors.revenusBruts = 'Les revenus bruts sont requis';
    }
    
    setErrors(newErrors);
    
    // Retourner true si aucune erreur
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Si en mode "offreMax", utiliser le prix d'offre maximum comme prix d'achat
      if (mode === 'offreMax' && results) {
        const updatedFormValues = {
          ...formValues,
          prixAchat: Math.floor(results.prixOffreMaximum),
        };
        
        setFormValues(updatedFormValues);
        
        // Recalculer avec le nouveau prix d'achat
        const params = {
          prixAchat: Math.floor(results.prixOffreMaximum),
          nombreAppartements: Number(formValues.nombreAppartements),
          revenusBruts: Number(formValues.revenusBruts),
        };
        
        const newResults = calculerMulti(params);
        setResults(newResults);
        
        // Changer le mode en "evaluer" après le calcul
        setMode('evaluer');

        // Sauvegarder l'analyse
        if (onSave) {
          onSave(updatedFormValues, newResults);
        }
      } else if (results) {
        // Sauvegarder l'analyse en mode "evaluer"
        if (onSave) {
          onSave(formValues, results);
        }
      }
    }
  };

  // Gestion de la réinitialisation du formulaire
  const handleReset = () => {
    setFormValues({
      prixAchat: '',
      nombreAppartements: '',
      revenusBruts: '',
    });
    setResults(null);
    setErrors({});
    setMode('evaluer');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
            <span className="font-bold">?</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Calculateur Napkin MULTI (PAR)</h2>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          La méthode PAR (Prix-Appartements-Revenus) permet d'évaluer rapidement la rentabilité d'un immeuble à revenus.
          L'objectif est d'obtenir au moins 75$ de liquidité par porte par mois.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="prixAchat" className="block text-sm font-medium text-gray-700 mb-1">
              Prix d'achat ($)
            </label>
            <input
              type="text"
              name="prixAchat"
              id="prixAchat"
              value={formValues.prixAchat}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.prixAchat ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 450000"
            />
            {errors.prixAchat && (
              <p className="mt-1 text-sm text-red-500">{errors.prixAchat}</p>
            )}
          </div>

          <div>
            <label htmlFor="nombreAppartements" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre d'appartements
            </label>
            <input
              type="text"
              name="nombreAppartements"
              id="nombreAppartements"
              value={formValues.nombreAppartements}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.nombreAppartements ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 4"
            />
            {errors.nombreAppartements && (
              <p className="mt-1 text-sm text-red-500">{errors.nombreAppartements}</p>
            )}
          </div>

          <div>
            <label htmlFor="revenusBruts" className="block text-sm font-medium text-gray-700 mb-1">
              Revenus bruts annuels ($)
            </label>
            <input
              type="text"
              name="revenusBruts"
              id="revenusBruts"
              value={formValues.revenusBruts}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.revenusBruts ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 60000"
            />
            {errors.revenusBruts && (
              <p className="mt-1 text-sm text-red-500">{errors.revenusBruts}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            type="submit"
            className={`px-6 py-2 ${
              mode === 'evaluer'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white font-medium rounded-md transition-colors`}
            onClick={() => setMode('evaluer')}
          >
            Évaluer la rentabilité
          </button>

          <button
            type="submit"
            className={`px-6 py-2 ${
              mode === 'offreMax'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white font-medium rounded-md transition-colors`}
            onClick={() => setMode('offreMax')}
          >
            Calculer l'offre maximale
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
              <p className="text-sm text-gray-600 mb-1">Dépenses d'opération</p>
              <p className="font-medium text-gray-900">
                {results.depensesOperation.toLocaleString('fr-CA')} $ ({results.pourcentageDeDependances.toFixed(0)}% des revenus bruts)
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Revenus nets d'opération (RNO)</p>
              <p className="font-medium text-gray-900">
                {results.rno.toLocaleString('fr-CA')} $
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Financement mensuel (HIGH-5)</p>
              <p className="font-medium text-gray-900">
                {results.financementMensuel.toLocaleString('fr-CA')} $
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Financement annuel</p>
              <p className="font-medium text-gray-900">
                {results.financementAnnuel.toLocaleString('fr-CA')} $
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Liquidité annuelle</p>
              <p className="font-medium text-gray-900">
                {results.liquidite.toLocaleString('fr-CA')} $
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Liquidité par porte/mois</p>
              <p className={`font-bold ${
                results.objectifAtteint ? 'text-green-600' : 'text-red-600'
              }`}>
                {results.liquiditeParPorteMois.toFixed(2)} $
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">Prix d'offre maximum pour 75$/porte/mois</p>
              <p className="font-bold text-blue-600">
                {results.prixOffreMaximum > 0 
                  ? `${results.prixOffreMaximum.toLocaleString('fr-CA')} $` 
                  : "Non rentable avec cet objectif"}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-md bg-gray-50 border border-gray-200">
            <p className="font-medium text-gray-900 mb-2">Analyse de rentabilité :</p>
            <p className={`${results.objectifAtteint ? 'text-green-600' : 'text-red-600'}`}>
              {results.objectifAtteint
                ? `✅ Rentable - Génère ${results.liquiditeParPorteMois.toFixed(2)}$ par porte/mois, ce qui dépasse l'objectif de 75$.`
                : `❌ Non rentable - Génère seulement ${results.liquiditeParPorteMois.toFixed(2)}$ par porte/mois, ce qui est inférieur à l'objectif de 75$.`}
            </p>
            {!results.objectifAtteint && results.prixOffreMaximum > 0 && (
              <p className="mt-1 text-blue-600">
                Suggestion : Offrir au maximum {Math.floor(results.prixOffreMaximum).toLocaleString('fr-CA')}$ pour atteindre l'objectif de 75$/porte/mois.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculateurMulti;
