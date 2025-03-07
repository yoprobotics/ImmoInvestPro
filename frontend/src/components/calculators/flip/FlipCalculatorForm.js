import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import flipCalculatorService from '../../../services/flipCalculatorService';

// Import des composants du formulaire
import GeneralInfoForm from './forms/GeneralInfoForm';
import AcquisitionCostsForm from './forms/AcquisitionCostsForm';
import RenovationCostsForm from './forms/RenovationCostsForm';
import HoldingCostsForm from './forms/HoldingCostsForm';
import SellingCostsForm from './forms/SellingCostsForm';
import FinancingForm from './forms/FinancingForm';
import RevenuesForm from './forms/RevenuesForm';
import ResultsSection from './ResultsSection';
import ScenarioManager from './ScenarioManager';

/**
 * Composant principal du formulaire du calculateur FLIP 3.0
 * Gère l'état global du formulaire, les calculs et les scénarios
 */
const FlipCalculatorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // État initial du formulaire
  const [formData, setFormData] = useState({
    generalInfo: {
      propertyAddress: '',
      propertyCity: '',
      propertyState: '',
      propertyZip: '',
      purchaseDate: '',
      expectedSaleDate: '',
      scenarioName: 'Scénario 1'
    },
    acquisitionCosts: {
      purchasePrice: 0,
      closingCosts: 0,
      transferTax: 0,
      inspectionCost: 0,
      otherAcquisitionCosts: 0
    },
    renovationCosts: {
      kitchenRenovation: 0,
      bathroomRenovation: 0,
      flooringCosts: 0,
      paintingCosts: 0,
      exteriorWork: 0,
      otherRenovationCosts: 0,
      contingencyPercentage: 10
    },
    holdingCosts: {
      propertyTaxes: 0,
      insurance: 0,
      utilities: 0,
      holdingPeriodMonths: 3
    },
    sellingCosts: {
      realtorCommission: 5, // pourcentage
      closingCosts: 0,
      stagingCosts: 0,
      marketingCosts: 0
    },
    financing: {
      acquisitionLoanAmount: 0,
      acquisitionLoanInterestRate: 0,
      renovationLoanAmount: 0,
      renovationLoanInterestRate: 0
    },
    revenue: {
      expectedSalePrice: 0
    }
  });
  
  // États pour la gestion des résultats, scénarios et chargement
  const [calculationResults, setCalculationResults] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Charger les données existantes si on est en mode édition
  useEffect(() => {
    if (id) {
      const fetchCalculation = async () => {
        setIsLoading(true);
        try {
          const data = await flipCalculatorService.getFlipCalculation(id);
          setFormData(data.inputData);
          setCalculationResults(data.results);
          
          if (data.scenarios && data.scenarios.length > 0) {
            setScenarios(data.scenarios);
          } else {
            setScenarios([{
              scenarioName: data.inputData.generalInfo.scenarioName || 'Scénario 1',
              inputData: data.inputData,
              results: data.results
            }]);
          }
        } catch (error) {
          toast.error("Erreur lors du chargement du calcul: " + (error.response?.data?.message || error.message));
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCalculation();
    } else {
      // Initialiser avec un premier scénario vide
      setScenarios([{
        scenarioName: 'Scénario 1',
        inputData: formData,
        results: null
      }]);
    }
  }, [id]);
  
  // Gestion des changements dans le formulaire
  const handleInputChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };
  
  // Calcul FLIP sans sauvegarde
  const calculateFlip = async () => {
    setIsLoading(true);
    try {
      const results = await flipCalculatorService.calculateFlip(formData);
      setCalculationResults(results);
      
      // Mettre à jour le scénario actif
      const updatedScenarios = [...scenarios];
      if (updatedScenarios[activeScenario]) {
        updatedScenarios[activeScenario] = {
          ...updatedScenarios[activeScenario],
          inputData: formData,
          results: results
        };
      } else {
        updatedScenarios.push({
          scenarioName: formData.generalInfo.scenarioName || 'Scénario 1',
          inputData: formData,
          results: results
        });
      }
      
      setScenarios(updatedScenarios);
      toast.success("Calcul effectué avec succès");
    } catch (error) {
      toast.error("Erreur lors du calcul: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sauvegarde du calcul FLIP
  const saveFlipCalculation = async () => {
    setIsSaving(true);
    try {
      let response;
      
      // Sauvegarder les modifications du scénario actif avant l'envoi
      const updatedScenarios = [...scenarios];
      updatedScenarios[activeScenario] = {
        ...updatedScenarios[activeScenario],
        inputData: formData,
        results: calculationResults
      };
      
      if (id) {
        // Mise à jour d'un calcul existant
        response = await flipCalculatorService.updateFlipCalculation(id, {
          inputData: formData,
          results: calculationResults,
          scenarios: updatedScenarios
        });
        toast.success("Calcul mis à jour avec succès");
      } else {
        // Création d'un nouveau calcul
        response = await flipCalculatorService.saveFlipCalculation({
          inputData: formData,
          results: calculationResults,
          scenarios: updatedScenarios
        });
        toast.success("Calcul sauvegardé avec succès");
        navigate(`/calculators/flip/${response._id}`);
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Gestion des scénarios
  const addNewScenario = () => {
    // Sauvegarder les modifications du scénario actif
    const updatedScenarios = [...scenarios];
    updatedScenarios[activeScenario] = {
      ...updatedScenarios[activeScenario],
      inputData: formData,
      results: calculationResults
    };
    
    // Créer un nouveau scénario basé sur le scénario actif
    const newScenario = {
      scenarioName: `Scénario ${scenarios.length + 1}`,
      inputData: {...formData, generalInfo: {...formData.generalInfo, scenarioName: `Scénario ${scenarios.length + 1}`}},
      results: null
    };
    
    // Mettre à jour l'état
    setScenarios([...updatedScenarios, newScenario]);
    setActiveScenario(updatedScenarios.length);
    setFormData(newScenario.inputData);
    setCalculationResults(null);
  };
  
  const switchScenario = (index) => {
    // Sauvegarder les modifications du scénario actif
    const updatedScenarios = [...scenarios];
    updatedScenarios[activeScenario] = {
      ...updatedScenarios[activeScenario],
      inputData: formData,
      results: calculationResults
    };
    
    setScenarios(updatedScenarios);
    
    // Charger le nouveau scénario
    setActiveScenario(index);
    setFormData(updatedScenarios[index].inputData);
    setCalculationResults(updatedScenarios[index].results);
  };
  
  const compareScenarios = () => {
    if (scenarios.length < 2) {
      toast.warning("Vous avez besoin d'au moins 2 scénarios pour faire une comparaison");
      return;
    }
    
    // Sauvegarder les modifications du scénario actif avant de naviguer
    const updatedScenarios = [...scenarios];
    updatedScenarios[activeScenario] = {
      ...updatedScenarios[activeScenario],
      inputData: formData,
      results: calculationResults
    };
    
    navigate('/calculators/flip/compare', { state: { scenarios: updatedScenarios } });
  };
  
  return (
    <div className="flip-calculator container py-4">
      <h2 className="mb-4">{id ? 'Modifier le calcul FLIP' : 'Nouveau calcul FLIP'}</h2>
      
      {/* Gestionnaire de scénarios */}
      <ScenarioManager 
        scenarios={scenarios}
        activeScenario={activeScenario}
        onAddScenario={addNewScenario}
        onSwitchScenario={switchScenario}
        onCompareScenarios={compareScenarios}
      />
      
      <div className="row">
        <div className="col-md-8">
          {/* Formulaire d'entrée */}
          <div className="card mb-4">
            <div className="card-body">
              <GeneralInfoForm 
                data={formData.generalInfo}
                onChange={(field, value) => handleInputChange('generalInfo', field, value)}
              />
              
              <AcquisitionCostsForm 
                data={formData.acquisitionCosts}
                onChange={(field, value) => handleInputChange('acquisitionCosts', field, value)}
              />
              
              <RenovationCostsForm 
                data={formData.renovationCosts}
                onChange={(field, value) => handleInputChange('renovationCosts', field, value)}
              />
              
              <HoldingCostsForm 
                data={formData.holdingCosts}
                onChange={(field, value) => handleInputChange('holdingCosts', field, value)}
              />
              
              <SellingCostsForm 
                data={formData.sellingCosts}
                onChange={(field, value) => handleInputChange('sellingCosts', field, value)}
              />
              
              <RevenuesForm 
                data={formData.revenue}
                onChange={(field, value) => handleInputChange('revenue', field, value)}
              />
              
              <FinancingForm 
                data={formData.financing}
                onChange={(field, value) => handleInputChange('financing', field, value)}
              />
              
              <div className="mt-4 d-flex gap-2">
                <button 
                  className="btn btn-secondary" 
                  onClick={calculateFlip}
                  disabled={isLoading}
                >
                  {isLoading ? 'Calcul en cours...' : 'Calculer'}
                </button>
                
                <button 
                  className="btn btn-primary" 
                  onClick={saveFlipCalculation}
                  disabled={isSaving || !calculationResults}
                >
                  {isSaving ? 'Sauvegarde en cours...' : (id ? 'Mettre à jour' : 'Sauvegarder')}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          {/* Affichage des résultats */}
          <ResultsSection results={calculationResults} />
        </div>
      </div>
    </div>
  );
};

export default FlipCalculatorForm;