/**
 * Page de démonstration pour le calculateur de taxes de mutation (taxe de bienvenue)
 */
import React from 'react';
import TransferTaxCalculator from '../components/calculators/financial/TransferTaxCalculator';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card';

const TransferTaxCalculatorPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Calculateur de Taxes de Mutation</h1>
      <p className="text-gray-600 mb-8">
        Calculez facilement les taxes de mutation (aussi appelées "taxe de bienvenue") pour votre 
        prochain achat immobilier au Québec.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <TransferTaxCalculator />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>À propos des taxes de mutation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Les taxes de mutation immobilière, communément appelées "taxe de bienvenue" au Québec, 
                sont des frais que doit payer tout acheteur d'une propriété au moment de l'acquisition. 
                Ces taxes sont calculées sur la base du prix d'achat ou de l'évaluation municipale de 
                la propriété, selon le montant le plus élevé.
              </p>
              
              <h3 className="font-bold mb-2">Taux standard au Québec :</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>0,5% sur la première tranche de 53 700$</li>
                <li>1,0% sur la tranche de 53 700$ à 269 200$</li>
                <li>1,5% sur la tranche excédant 269 200$</li>
              </ul>
              
              <h3 className="font-bold mb-2">Taux spécifiques à Montréal :</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>0,5% sur la première tranche de 53 700$</li>
                <li>1,0% sur la tranche de 53 700$ à 269 200$</li>
                <li>1,5% sur la tranche de 269 200$ à 500 000$</li>
                <li>2,0% sur la tranche de 500 000$ à 1 000 000$</li>
                <li>2,5% sur la tranche excédant 1 000 000$</li>
              </ul>
              
              <p className="text-sm text-gray-600">
                Note: Certaines municipalités peuvent avoir des taux différents. Veuillez vérifier 
                auprès de la municipalité concernée pour obtenir les taux exacts.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Exemptions et particularités</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold mb-2">Exemptions à Montréal :</h3>
              <p className="mb-4">
                La Ville de Montréal offre un programme d'aide à l'acquisition d'une première résidence 
                qui permet d'obtenir une exemption pouvant aller jusqu'à 5 000$ sur les taxes de mutation.
              </p>
              
              <h3 className="font-bold mb-2">Conditions d'admissibilité :</h3>
              <ul className="list-disc pl-5">
                <li>Être un premier acheteur</li>
                <li>Ou acquérir sa première propriété au Québec</li>
                <li>Avoir l'intention d'y établir sa résidence principale</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quand payer ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Les taxes de mutation sont généralement facturées par la municipalité quelques mois 
                après l'achat de la propriété. Elles sont payables en un seul versement et 
                doivent être acquittées dans les 30 jours suivant la réception de la facture.
              </p>
              <p className="mt-4 font-medium">
                N'oubliez pas d'inclure ce montant dans votre budget d'acquisition !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransferTaxCalculatorPage;
