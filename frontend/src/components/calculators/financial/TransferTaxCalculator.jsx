/**
 * Composant React pour le calculateur de taxes de mutation (taxe de bienvenue)
 */
import React, { useState, useEffect, useMemo } from 'react';
import transferTaxService from '../../../services/transferTaxService';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/Switch';
import { Label } from '../../ui/Label';
import { Alert, AlertTitle, AlertDescription } from '../../ui/Alert';
import { Spinner } from '../../ui/Spinner';
import { InfoTooltip } from '../../ui/InfoTooltip';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Calculateur de taxes de mutation (taxe de bienvenue)
 */
const TransferTaxCalculator = ({ 
  initialValue = 300000, 
  initialMunicipality = '',
  onCalculationComplete = null,
  standalone = true,
  hideTitle = false
}) => {
  // État local
  const [propertyValue, setPropertyValue] = useState(initialValue);
  const [municipality, setMunicipality] = useState(initialMunicipality);
  const [isFirstTimeHomeBuyer, setIsFirstTimeHomeBuyer] = useState(false);
  const [isFirstHomeInQuebec, setIsFirstHomeInQuebec] = useState(false);
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [customRatePercentage, setCustomRatePercentage] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Calcul local approximatif pour avoir un retour immédiat
  const localCalculation = useMemo(() => {
    try {
      const params = {
        propertyValue,
        municipality,
        isFirstTimeHomeBuyer,
        isFirstHomeInQuebec,
        customRatePercentage: useCustomRate ? customRatePercentage : null
      };
      
      return transferTaxService.calculateTransferTaxLocal(params);
    } catch (err) {
      return null;
    }
  }, [propertyValue, municipality, isFirstTimeHomeBuyer, isFirstHomeInQuebec, useCustomRate, customRatePercentage]);

  // Calculer automatiquement lors des changements de paramètres importants
  useEffect(() => {
    if (localCalculation && typeof onCalculationComplete === 'function') {
      onCalculationComplete(localCalculation);
    }
  }, [localCalculation, onCalculationComplete]);

  // Gérer le calcul précis via l'API backend
  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        propertyValue,
        municipality,
        isFirstTimeHomeBuyer,
        isFirstHomeInQuebec,
        customRatePercentage: useCustomRate ? customRatePercentage : null
      };
      
      const data = await transferTaxService.calculateTransferTax(params);
      setResult(data);
      
      if (typeof onCalculationComplete === 'function') {
        onCalculationComplete(data);
      }
    } catch (err) {
      setError('Erreur lors du calcul des taxes de mutation. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Formater la valeur pour l'affichage du montant total
  const formattedTransferTax = result 
    ? formatCurrency(result.transferTaxTotal) 
    : localCalculation 
      ? formatCurrency(localCalculation.transferTaxTotal)
      : formatCurrency(0);

  // Wrapper conditionnellement dans un Card seulement en mode standalone
  const content = (
    <>
      {!hideTitle && <CardTitle className="mb-4">Calculateur de taxes de mutation</CardTitle>}
      
      <div className="space-y-4">
        {/* Valeur de la propriété */}
        <div>
          <Label htmlFor="propertyValue">
            Valeur de la propriété
            <InfoTooltip text="Utiliser le prix d'achat ou l'évaluation municipale, le montant le plus élevé." />
          </Label>
          <div className="flex items-center mt-1">
            <Input
              id="propertyValue"
              type="number"
              value={propertyValue}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
              min="0"
              step="1000"
              className="flex-1"
            />
            <span className="ml-2 text-gray-600">$</span>
          </div>
        </div>
        
        {/* Municipalité */}
        <div>
          <Label htmlFor="municipality">
            Municipalité
            <InfoTooltip text="Les taux diffèrent à Montréal pour les propriétés de plus de 500 000$." />
          </Label>
          <Input
            id="municipality"
            type="text"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            placeholder="ex: Montréal, Laval, Longueuil"
            className="mt-1"
          />
        </div>
        
        {/* Options pour Montréal */}
        {municipality && 
         (municipality.toLowerCase().includes('montréal') || 
          municipality.toLowerCase().includes('montreal')) && (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <h4 className="font-medium mb-2">Options spécifiques à Montréal</h4>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Switch
                  id="firstTimeBuyer"
                  checked={isFirstTimeHomeBuyer}
                  onCheckedChange={setIsFirstTimeHomeBuyer}
                />
                <Label htmlFor="firstTimeBuyer" className="ml-2">
                  Premier acheteur
                  <InfoTooltip text="Exemption jusqu'à 5000$ pour les premiers acheteurs à Montréal." />
                </Label>
              </div>
              
              <div className="flex items-center">
                <Switch
                  id="firstHomeInQuebec"
                  checked={isFirstHomeInQuebec}
                  onCheckedChange={setIsFirstHomeInQuebec}
                />
                <Label htmlFor="firstHomeInQuebec" className="ml-2">
                  Première propriété au Québec
                  <InfoTooltip text="Exemption similaire pour les personnes qui achètent leur première propriété au Québec." />
                </Label>
              </div>
            </div>
          </div>
        )}
        
        {/* Taux personnalisé */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="flex items-center">
            <Switch
              id="useCustomRate"
              checked={useCustomRate}
              onCheckedChange={setUseCustomRate}
            />
            <Label htmlFor="useCustomRate" className="ml-2">
              Utiliser un taux personnalisé
              <InfoTooltip text="Certaines municipalités ont des taux différents du standard provincial." />
            </Label>
          </div>
          
          {useCustomRate && (
            <div className="mt-2">
              <Label htmlFor="customRate">Taux personnalisé (%)</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="customRate"
                  type="number"
                  value={customRatePercentage}
                  onChange={(e) => setCustomRatePercentage(Number(e.target.value))}
                  min="0"
                  max="10"
                  step="0.1"
                  className="flex-1"
                />
                <span className="ml-2 text-gray-600">%</span>
              </div>
            </div>
          )}
        </div>
        
        {standalone && (
          <Button 
            onClick={handleCalculate} 
            disabled={loading}
            className="w-full"
          >
            {loading ? <Spinner className="mr-2" /> : null}
            Calculer avec précision
          </Button>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Résultat */}
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h3 className="font-medium mb-2">Taxes de mutation (taxe de bienvenue)</h3>
          <div className="text-2xl font-bold text-blue-800">{formattedTransferTax}</div>
          {result && result.exemption && result.exemption.amount > 0 && (
            <div className="mt-2 text-sm text-green-600">
              Exemption appliquée: {formatCurrency(result.exemption.amount)}
              <div>{result.exemption.reason}</div>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            {result ? 'Calcul précis' : 'Calcul approximatif (local)'}
          </div>
        </div>
        
        {/* Détails du calcul */}
        {result && result.details && result.details.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <h4 className="font-medium mb-2">Détails du calcul</h4>
            <div className="text-sm">
              {result.details.map((detail, index) => (
                <div key={`bracket-${index}`} className="flex justify-between mb-1">
                  <span>Tranche {index + 1} ({formatCurrency(detail.min)} - {detail.max === Infinity ? 'et plus' : formatCurrency(detail.max)})</span>
                  <span>{detail.rate}% : {formatCurrency(detail.taxAmount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Retourner le contenu enveloppé dans une Card en mode standalone
  return standalone ? (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Calculateur de Taxes de Mutation</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  ) : content;
};

export default TransferTaxCalculator;
