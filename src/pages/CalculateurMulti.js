import React, { useState, useEffect } from 'react';

const CalculateurMulti = () => {
  // État initial pour le formulaire
  const [formData, setFormData] = useState({
    prixAchat: '',
    nombreAppartements: '',
    revenusBruts: '',
    depensesPersonnalisees: false,
    tauxDepenses: '',
    depensesAnnuelles: '',
    financementPersonnalise: false,
    tauxInteret: 5.0,
    amortissement: 25,
    miseEnFonds: 20
  });

  // États pour les résultats
  const [resultats, setResultats] = useState({
    depensesAnnuelles: 0,
    revenusNetsOperation: 0,
    financementAnnuel: 0,
    liquidite: 0,
    liquiditeParPorte: 0,
    tauxRendementLiquidite: 0,
    prixAchatMaximal: 0
  });

  // État pour contrôler l'affichage des résultats
  const [afficherResultats, setAfficherResultats] = useState(false);
  
  // État pour le mode (rapide/détaillé)
  const [modeCalcul, setModeCalcul] = useState('rapide');
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Conversion en nombre pour les champs numériques
    const processedValue = type === 'checkbox' ? checked : 
                           (type === 'number' || name === 'prixAchat' || name === 'revenusBruts') ? 
                           (value === '' ? '' : parseFloat(value)) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  // Déterminer automatiquement le taux de dépenses en fonction du nombre d'appartements
  useEffect(() => {
    if (!formData.depensesPersonnalisees && formData.nombreAppartements) {
      let tauxCalcule;
      
      if (formData.nombreAppartements <= 2) {
        tauxCalcule = 30;
      } else if (formData.nombreAppartements <= 4) {
        tauxCalcule = 35;
      } else if (formData.nombreAppartements <= 6) {
        tauxCalcule = 45;
      } else {
        tauxCalcule = 50;
      }
      
      setFormData(prev => ({
        ...prev,
        tauxDepenses: tauxCalcule
      }));
    }
  }, [formData.nombreAppartements, formData.depensesPersonnalisees]);

  // Mettre à jour les dépenses annuelles quand les revenus bruts ou le taux de dépenses change
  useEffect(() => {
    if (formData.revenusBruts && formData.tauxDepenses && !formData.depensesPersonnalisees) {
      const depensesCalculees = formData.revenusBruts * (formData.tauxDepenses / 100);
      setFormData(prev => ({
        ...prev,
        depensesAnnuelles: depensesCalculees
      }));
    }
  }, [formData.revenusBruts, formData.tauxDepenses, formData.depensesPersonnalisees]);

  // Méthode HIGH-5 pour calculer le paiement hypothécaire mensuel
  const calculerPaiementHypothecaireMensuel = (prixAchat) => {
    if (formData.financementPersonnalise) {
      // Calcul détaillé du prêt hypothécaire si le financement personnalisé est activé
      const montantMiseEnFonds = prixAchat * (formData.miseEnFonds / 100);
      const montantHypotheque = prixAchat - montantMiseEnFonds;
      const tauxMensuel = formData.tauxInteret / 100 / 12;
      const nombrePaiements = formData.amortissement * 12;
      
      const paiementMensuel = montantHypotheque * 
        (tauxMensuel * Math.pow(1 + tauxMensuel, nombrePaiements)) / 
        (Math.pow(1 + tauxMensuel, nombrePaiements) - 1);
      
      return paiementMensuel;
    } else {
      // Méthode HIGH-5 simplifiée (0.5% du prix d'achat par mois)
      return prixAchat * 0.005;
    }
  };

  // Calculer les résultats
  const calculerResultats = () => {
    if (!formData.prixAchat || !formData.nombreAppartements || !formData.revenusBruts) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Calcul des dépenses d'opération
    let depensesAnnuelles = formData.depensesPersonnalisees ? 
                           formData.depensesAnnuelles : 
                           formData.revenusBruts * (formData.tauxDepenses / 100);

    // Calcul du Revenu Net d'Opération (RNO)
    const revenusNetsOperation = formData.revenusBruts - depensesAnnuelles;

    // Calcul du financement annuel selon la méthode HIGH-5
    const paiementMensuel = calculerPaiementHypothecaireMensuel(formData.prixAchat);
    const financementAnnuel = paiementMensuel * 12;

    // Calcul de la liquidité
    const liquidite = revenusNetsOperation - financementAnnuel;

    // Calcul de la liquidité par porte par mois
    const liquiditeParPorte = liquidite / formData.nombreAppartements / 12;

    // Calcul du taux de rendement sur la liquidité
    const montantMiseEnFonds = formData.prixAchat * (formData.miseEnFonds / 100);
    const tauxRendementLiquidite = (liquidite / montantMiseEnFonds) * 100;

    // Calcul du prix d'achat maximal pour 75$ par porte par mois
    const liquiditeCible = 75 * formData.nombreAppartements * 12; // 75$ par porte par mois
    const financementMaximal = revenusNetsOperation - liquiditeCible;
    // Utilisant la méthode HIGH-5 à l'inverse
    const prixAchatMaximal = financementMaximal > 0 ? (financementMaximal / 12) / 0.005 : 0;

    // Mise à jour des résultats
    setResultats({
      depensesAnnuelles,
      revenusNetsOperation,
      financementAnnuel,
      liquidite,
      liquiditeParPorte,
      tauxRendementLiquidite,
      prixAchatMaximal
    });

    setAfficherResultats(true);
  };

  // Fonction pour formater les montants en dollars
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };
  
  // Fonction pour formater les pourcentages
  const formatPercentage = (percentage) => {
    return new Intl.NumberFormat('fr-CA', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(percentage / 100);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Calculateur Napkin MULTI (PAR + HIGH-5)</h1>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button 
            className={`mr-4 py-2 px-4 rounded ${modeCalcul === 'rapide' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setModeCalcul('rapide')}
          >
            Mode Napkin (Rapide)
          </button>
          <button 
            className={`py-2 px-4 rounded ${modeCalcul === 'detaille' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setModeCalcul('detaille')}
          >
            Mode Détaillé
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 mb-4 rounded">
          <p className="mb-2"><strong>Méthode PAR:</strong> Prix d'achat, Appartements (nombre), Revenus bruts</p>
          <p className="mb-2"><strong>Méthode HIGH-5:</strong> Estimation rapide du paiement hypothécaire mensuel (0.5% du prix d'achat)</p>
        </div>
      </div>

      {/* Formulaire principal */}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Prix d'achat */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prixAchat">
              Prix d'achat ($) *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="prixAchat"
              name="prixAchat"
              type="number"
              value={formData.prixAchat}
              onChange={handleChange}
              placeholder="Ex: 500000"
              required
            />
          </div>

          {/* Nombre d'appartements */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreAppartements">
              Nombre d'appartements (portes) *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nombreAppartements"
              name="nombreAppartements"
              type="number"
              value={formData.nombreAppartements}
              onChange={handleChange}
              placeholder="Ex: 6"
              required
            />
          </div>

          {/* Revenus bruts */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revenusBruts">
              Revenus bruts annuels ($) *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="revenusBruts"
              name="revenusBruts"
              type="number"
              value={formData.revenusBruts}
              onChange={handleChange}
              placeholder="Ex: 80000"
              required
            />
          </div>
        </div>

        {/* Dépenses d'opération */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              id="depensesPersonnalisees"
              name="depensesPersonnalisees"
              type="checkbox"
              className="mr-2"
              checked={formData.depensesPersonnalisees}
              onChange={handleChange}
            />
            <label className="text-gray-700 text-sm font-bold" htmlFor="depensesPersonnalisees">
              Personnaliser les dépenses d'opération
            </label>
          </div>
          
          {formData.depensesPersonnalisees ? (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="depensesAnnuelles">
                Dépenses annuelles totales ($)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="depensesAnnuelles"
                name="depensesAnnuelles"
                type="number"
                value={formData.depensesAnnuelles}
                onChange={handleChange}
                placeholder="Entrez le montant des dépenses annuelles"
              />
            </div>
          ) : (
            <div className="flex items-center">
              <label className="block text-gray-700 text-sm font-bold mr-2" htmlFor="tauxDepenses">
                Taux de dépenses:
              </label>
              <input
                className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="tauxDepenses"
                name="tauxDepenses"
                type="number"
                value={formData.tauxDepenses}
                onChange={handleChange}
                placeholder="0"
                readOnly={!formData.depensesPersonnalisees}
              />
              <span className="ml-2">%</span>
              <span className="ml-4 text-sm text-gray-600">
                (1-2 logements: 30%, 3-4: 35%, 5-6: 45%, 7+: 50%)
              </span>
            </div>
          )}
        </div>

        {/* Options de financement avancées (visible seulement en mode détaillé) */}
        {modeCalcul === 'detaille' && (
          <div className="mb-4 border-t pt-4">
            <div className="flex items-center mb-2">
              <input
                id="financementPersonnalise"
                name="financementPersonnalise"
                type="checkbox"
                className="mr-2"
                checked={formData.financementPersonnalise}
                onChange={handleChange}
              />
              <label className="text-gray-700 text-sm font-bold" htmlFor="financementPersonnalise">
                Personnaliser les paramètres de financement
              </label>
            </div>
            
            {formData.financementPersonnalise && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tauxInteret">
                    Taux d'intérêt (%)
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="tauxInteret"
                    name="tauxInteret"
                    type="number"
                    value={formData.tauxInteret}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amortissement">
                    Amortissement (années)
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="amortissement"
                    name="amortissement"
                    type="number"
                    value={formData.amortissement}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="miseEnFonds">
                    Mise de fonds (%)
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="miseEnFonds"
                    name="miseEnFonds"
                    type="number"
                    value={formData.miseEnFonds}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={calculerResultats}
          >
            Calculer
          </button>
        </div>
      </form>

      {/* Affichage des résultats */}
      {afficherResultats && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">Résultats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Analyse des revenus et dépenses</h3>
              <div className="mb-1">Revenus bruts annuels: {formatCurrency(formData.revenusBruts)}</div>
              <div className="mb-1">Dépenses d'opération: {formatCurrency(resultats.depensesAnnuelles)}</div>
              <div className="mb-1 font-bold">Revenus nets d'opération (RNO): {formatCurrency(resultats.revenusNetsOperation)}</div>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Analyse de la liquidité</h3>
              <div className="mb-1">Financement annuel: {formatCurrency(resultats.financementAnnuel)}</div>
              <div className="mb-1 font-bold">Liquidité annuelle: {formatCurrency(resultats.liquidite)}</div>
              <div className="mb-1">Liquidité par porte/mois: {formatCurrency(resultats.liquiditeParPorte)}</div>
              <div className={`mb-1 ${resultats.liquiditeParPorte >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                Cible de 75$/porte/mois: {resultats.liquiditeParPorte >= 75 ? 'Atteinte' : 'Non atteinte'}
              </div>
            </div>
          </div>
          
          <div className="border p-4 rounded mb-6">
            <h3 className="font-bold mb-2">Prix d'achat maximum pour atteindre 75$/porte/mois</h3>
            <div className="text-lg">{formatCurrency(resultats.prixAchatMaximal)}</div>
            <div className="text-sm text-gray-600 mt-1">
              {formData.prixAchat > resultats.prixAchatMaximal 
                ? `Vous devriez négocier une réduction de ${formatCurrency(formData.prixAchat - resultats.prixAchatMaximal)}` 
                : 'Le prix est dans votre marge cible'}
            </div>
          </div>
          
          {modeCalcul === 'detaille' && (
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Indicateurs de rentabilité</h3>
              <div className="mb-1">Taux de rendement sur la liquidité: {formatPercentage(resultats.tauxRendementLiquidite)}</div>
              <div className="mb-1">Multiplicateur de revenus bruts: {(formData.prixAchat / formData.revenusBruts).toFixed(2)}</div>
              <div className="mb-1">Taux de capitalisation: {formatPercentage((resultats.revenusNetsOperation / formData.prixAchat) * 100)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculateurMulti;