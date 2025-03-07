import React, { useState, useEffect } from 'react';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './MultiCalculator.css';

const MultiCalculator = ({ propertyData }) => {
  // État initial du calculateur
  const [data, setData] = useState({
    // Informations générales
    general: {
      propertyName: propertyData?.address || '',
      purchasePrice: propertyData?.price || 0,
      units: propertyData?.units || 0,
      description: ''
    },
    // Revenus
    income: {
      // Loyers pour chaque type d'unité
      rents: [
        { type: '1½', count: 0, pricePerUnit: 0, total: 0 },
        { type: '2½', count: 0, pricePerUnit: 0, total: 0 },
        { type: '3½', count: 0, pricePerUnit: 0, total: 0 },
        { type: '4½', count: 0, pricePerUnit: 0, total: 0 },
        { type: '5½', count: 0, pricePerUnit: 0, total: 0 },
        { type: '6½+', count: 0, pricePerUnit: 0, total: 0 }
      ],
      // Autres revenus
      parking: { count: 0, pricePerUnit: 0, total: 0 },
      storage: { count: 0, pricePerUnit: 0, total: 0 },
      laundry: { revenue: 0 },
      other: { description: '', revenue: 0 },
      // Sommaire
      potentialGrossIncome: 0,
      vacancyRate: 5,
      vacancyLoss: 0,
      effectiveGrossIncome: 0
    },
    // Dépenses
    expenses: {
      // Taxes
      municipalTax: 0,
      schoolTax: 0,
      // Assurances
      insurance: 0,
      // Énergie
      electricity: 0,
      naturalGas: 0,
      oil: 0,
      // Entretien
      maintenance: 0,
      snowRemoval: 0,
      landscaping: 0,
      // Services
      management: { percentage: 5, amount: 0 },
      janitor: 0,
      accounting: 0,
      legal: 0,
      // Autres dépenses
      advertising: 0,
      otherExpenses: { description: '', amount: 0 },
      // Sommaire
      totalExpenses: 0,
      expensesPercentage: 0
    },
    // Financement
    financing: {
      // Financement bancaire traditionnel
      bankLoan: {
        amount: 0,
        percentage: 75,
        rate: 4.5,
        term: 25,
        monthlyPayment: 0,
        annualPayment: 0
      },
      // Love money
      privateLoan: {
        amount: 0,
        percentage: 15,
        rate: 6,
        term: 5,
        monthlyPayment: 0,
        annualPayment: 0
      },
      // Balance de vente
      sellerLoan: {
        amount: 0,
        percentage: 0,
        rate: 5,
        term: 3,
        monthlyPayment: 0,
        annualPayment: 0
      },
      // Mise de fonds
      downPayment: {
        amount: 0,
        percentage: 10
      },
      // Sommaire
      totalFinancing: 0,
      totalMonthlyPayment: 0,
      totalAnnualPayment: 0
    },
    // Résultats
    results: {
      // Sommaire des revenus et dépenses
      potentialGrossIncome: 0,
      effectiveGrossIncome: 0,
      totalExpenses: 0,
      netOperatingIncome: 0,
      // Mesures de rentabilité
      cashFlow: 0,
      cashFlowPerDoor: 0,
      cashFlowPercentage: 0,
      capRate: 0,
      GRM: 0, // Gross Rent Multiplier
      // ROI
      returnOnEquity: 0,
      returnOnInvestment: 0,
      // TGA (Taux Global d'Actualisation)
      tga: 0
    }
  });

  // Effet pour initialiser les données du calculateur
  useEffect(() => {
    if (propertyData) {
      initializeData(propertyData);
    }
  }, [propertyData]);

  // Initialise les données à partir des propriétés fournies
  const initializeData = (property) => {
    // Cloner les données actuelles
    const newData = { ...data };

    // Mettre à jour les informations générales
    newData.general.propertyName = property.address || '';
    newData.general.purchasePrice = property.price || 0;
    newData.general.units = property.units || 0;

    // Si nous avons des informations sur les unités, les ajouter
    if (property.unitDetails) {
      // Réinitialiser les loyers
      newData.income.rents = newData.income.rents.map(rent => ({ ...rent, count: 0, pricePerUnit: 0, total: 0 }));

      // Pour chaque type d'unité dans les données de propriété
      property.unitDetails.forEach(unit => {
        // Trouver le type correspondant dans notre structure
        const rentIndex = newData.income.rents.findIndex(r => r.type === unit.type);
        if (rentIndex !== -1) {
          newData.income.rents[rentIndex].count = unit.count;
          newData.income.rents[rentIndex].pricePerUnit = unit.rent;
          newData.income.rents[rentIndex].total = unit.count * unit.rent;
        }
      });
    }

    // Mettre à jour le financement en fonction du prix d'achat
    updateFinancing(newData);

    // Mettre à jour les calculs
    const updatedData = calculateAll(newData);
    setData(updatedData);
  };

  // Met à jour les montants du financement en fonction du prix d'achat
  const updateFinancing = (data) => {
    const price = data.general.purchasePrice;

    // Mettre à jour les montants en fonction des pourcentages
    data.financing.bankLoan.amount = price * (data.financing.bankLoan.percentage / 100);
    data.financing.privateLoan.amount = price * (data.financing.privateLoan.percentage / 100);
    data.financing.sellerLoan.amount = price * (data.financing.sellerLoan.percentage / 100);
    data.financing.downPayment.amount = price * (data.financing.downPayment.percentage / 100);

    // Recalculer les paiements de financement
    data.financing.bankLoan.monthlyPayment = calculateMortgagePayment(
      data.financing.bankLoan.amount,
      data.financing.bankLoan.rate,
      data.financing.bankLoan.term
    );
    data.financing.bankLoan.annualPayment = data.financing.bankLoan.monthlyPayment * 12;

    data.financing.privateLoan.monthlyPayment = calculateMortgagePayment(
      data.financing.privateLoan.amount,
      data.financing.privateLoan.rate,
      data.financing.privateLoan.term
    );
    data.financing.privateLoan.annualPayment = data.financing.privateLoan.monthlyPayment * 12;

    data.financing.sellerLoan.monthlyPayment = calculateMortgagePayment(
      data.financing.sellerLoan.amount,
      data.financing.sellerLoan.rate,
      data.financing.sellerLoan.term
    );
    data.financing.sellerLoan.annualPayment = data.financing.sellerLoan.monthlyPayment * 12;

    // Calculer les totaux
    data.financing.totalFinancing = data.financing.bankLoan.amount + data.financing.privateLoan.amount + data.financing.sellerLoan.amount + data.financing.downPayment.amount;
    data.financing.totalMonthlyPayment = data.financing.bankLoan.monthlyPayment + data.financing.privateLoan.monthlyPayment + data.financing.sellerLoan.monthlyPayment;
    data.financing.totalAnnualPayment = data.financing.totalMonthlyPayment * 12;
  };

  // Calcul du paiement hypothécaire mensuel
  const calculateMortgagePayment = (principal, annualRate, years) => {
    if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
    
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  // Mise à jour des champs du calculateur
  const handleChange = (section, field, value, subfield = null) => {
    // Cloner les données actuelles
    const newData = { ...data };

    // Mettre à jour le champ approprié
    if (subfield === null) {
      if (field.includes('.')) {
        const [mainField, subField] = field.split('.');
        newData[section][mainField][subField] = value;

        // Si nous modifions le pourcentage de gestion, recalculer le montant
        if (section === 'expenses' && mainField === 'management' && subField === 'percentage') {
          newData.expenses.management.amount = (newData.income.effectiveGrossIncome * value) / 100;
        }
      } else {
        newData[section][field] = value;
      }
    } else {
      // Pour les tableaux comme les loyers
      if (field === 'rents') {
        const updatedRent = { ...newData.income.rents[subfield] };
        updatedRent[value.field] = value.value;
        
        // Calculer le total pour cette ligne
        if (value.field === 'count' || value.field === 'pricePerUnit') {
          updatedRent.total = updatedRent.count * updatedRent.pricePerUnit;
        }
        
        newData.income.rents[subfield] = updatedRent;
      } else if (field === 'parking' || field === 'storage') {
        newData.income[field][subfield] = value;
        
        // Calculer le total pour les stationnements et rangements
        if (subfield === 'count' || subfield === 'pricePerUnit') {
          newData.income[field].total = newData.income[field].count * newData.income[field].pricePerUnit;
        }
      } else {
        newData[section][field][subfield] = value;
      }
    }

    // Mettre à jour les pourcentages de financement en fonction des montants
    if (section === 'financing' && (field === 'bankLoan' || field === 'privateLoan' || field === 'sellerLoan' || field === 'downPayment')) {
      if (subfield === 'amount') {
        const totalPrice = newData.general.purchasePrice;
        if (totalPrice > 0) {
          newData.financing[field].percentage = (value / totalPrice) * 100;
        }
      } else if (subfield === 'percentage') {
        const totalPrice = newData.general.purchasePrice;
        newData.financing[field].amount = (totalPrice * value) / 100;

        // Recalculer les paiements
        if (field !== 'downPayment') {
          newData.financing[field].monthlyPayment = calculateMortgagePayment(
            newData.financing[field].amount,
            newData.financing[field].rate,
            newData.financing[field].term
          );
          newData.financing[field].annualPayment = newData.financing[field].monthlyPayment * 12;
        }
      }
    }

    // Recalculer tous les totaux et résultats
    const updatedData = calculateAll(newData);
    setData(updatedData);
  };

  // Calcul de tous les montants et ratios
  const calculateAll = (data) => {
    // Calcul des revenus potentiels bruts
    let potentialGrossIncome = data.income.rents.reduce((sum, rent) => sum + rent.total, 0);
    potentialGrossIncome += data.income.parking.total + data.income.storage.total + data.income.laundry.revenue + data.income.other.revenue;
    data.income.potentialGrossIncome = potentialGrossIncome;

    // Calcul des pertes dues aux vacances
    data.income.vacancyLoss = (potentialGrossIncome * data.income.vacancyRate) / 100;
    data.income.effectiveGrossIncome = potentialGrossIncome - data.income.vacancyLoss;

    // Calcul du montant de gestion basé sur le pourcentage
    data.expenses.management.amount = (data.income.effectiveGrossIncome * data.expenses.management.percentage) / 100;

    // Calcul des dépenses totales
    let totalExpenses = 
      data.expenses.municipalTax + 
      data.expenses.schoolTax + 
      data.expenses.insurance + 
      data.expenses.electricity + 
      data.expenses.naturalGas + 
      data.expenses.oil + 
      data.expenses.maintenance + 
      data.expenses.snowRemoval + 
      data.expenses.landscaping + 
      data.expenses.management.amount + 
      data.expenses.janitor + 
      data.expenses.accounting + 
      data.expenses.legal + 
      data.expenses.advertising + 
      data.expenses.otherExpenses.amount;
    
    data.expenses.totalExpenses = totalExpenses;
    data.expenses.expensesPercentage = data.income.effectiveGrossIncome > 0 
      ? (totalExpenses / data.income.effectiveGrossIncome) * 100 
      : 0;

    // Calcul du revenu net d'exploitation (NOI)
    const netOperatingIncome = data.income.effectiveGrossIncome - data.expenses.totalExpenses;
    data.results.netOperatingIncome = netOperatingIncome;

    // Calcul du cashflow
    const cashFlow = netOperatingIncome - data.financing.totalAnnualPayment;
    data.results.cashFlow = cashFlow;
    data.results.cashFlowPerDoor = data.general.units > 0 
      ? cashFlow / data.general.units / 12 
      : 0;
    data.results.cashFlowPercentage = data.financing.downPayment.amount > 0 
      ? (cashFlow / data.financing.downPayment.amount) * 100 
      : 0;

    // Calcul du taux de capitalisation (CAP rate)
    data.results.capRate = data.general.purchasePrice > 0 
      ? (netOperatingIncome / data.general.purchasePrice) * 100 
      : 0;

    // Calcul du GRM (Gross Rent Multiplier)
    data.results.GRM = potentialGrossIncome > 0 
      ? data.general.purchasePrice / potentialGrossIncome 
      : 0;

    // Calcul du ROI (Return on Investment)
    data.results.returnOnInvestment = data.financing.downPayment.amount > 0 
      ? (cashFlow / data.financing.downPayment.amount) * 100 
      : 0;

    // Calcul du ROE (Return on Equity)
    // Dans une implémentation complète, nous calculerions aussi l'équité bâtie par le remboursement du capital
    data.results.returnOnEquity = data.results.returnOnInvestment;

    // Calcul du TGA (Taux Global d'Actualisation)
    // Formule simplifiée: TGA = Taux de capitalisation + Taux de croissance annuel moyen de l'immeuble
    // On va supposer un taux de croissance de 2% pour cet exemple
    const growthRate = 2;
    data.results.tga = data.results.capRate + growthRate;

    // Mettre à jour les totaux de financement
    data.financing.totalFinancing = data.financing.bankLoan.amount + data.financing.privateLoan.amount + data.financing.sellerLoan.amount + data.financing.downPayment.amount;
    data.financing.totalMonthlyPayment = data.financing.bankLoan.monthlyPayment + data.financing.privateLoan.monthlyPayment + data.financing.sellerLoan.monthlyPayment;
    data.financing.totalAnnualPayment = data.financing.totalMonthlyPayment * 12;

    // Mettre à jour les résultats
    data.results.potentialGrossIncome = data.income.potentialGrossIncome;
    data.results.effectiveGrossIncome = data.income.effectiveGrossIncome;
    data.results.totalExpenses = data.expenses.totalExpenses;

    return data;
  };

  return (
    <div className="multi-calculator">
      <h2>Calculateur de rendement MULTI</h2>
      
      <Tabs>
        <TabList>
          <Tab>Information générale</Tab>
          <Tab>Revenus</Tab>
          <Tab>Dépenses</Tab>
          <Tab>Financement</Tab>
          <Tab>Résultats</Tab>
        </TabList>

        {/* Onglet d'information générale */}
        <TabPanel>
          <div className="calculator-section">
            <h3>Information générale</h3>
            
            <div className="input-group">
              <label>Nom de la propriété</label>
              <input 
                type="text" 
                value={data.general.propertyName}
                onChange={(e) => handleChange('general', 'propertyName', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>Prix d'achat</label>
              <input 
                type="number" 
                value={data.general.purchasePrice}
                onChange={(e) => handleChange('general', 'purchasePrice', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="input-group">
              <label>Nombre d'unités</label>
              <input 
                type="number" 
                value={data.general.units}
                onChange={(e) => handleChange('general', 'units', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="input-group">
              <label>Description</label>
              <textarea 
                value={data.general.description}
                onChange={(e) => handleChange('general', 'description', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </TabPanel>

        {/* Onglet des revenus */}
        <TabPanel>
          <div className="calculator-section">
            <h3>Revenus locatifs</h3>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Nombre</th>
                  <th>Prix unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.income.rents.map((rent, index) => (
                  <tr key={`rent-${index}`}>
                    <td>{rent.type}</td>
                    <td>
                      <input 
                        type="number" 
                        value={rent.count}
                        onChange={(e) => handleChange('income', 'rents', { field: 'count', value: parseInt(e.target.value) || 0 }, index)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={rent.pricePerUnit}
                        onChange={(e) => handleChange('income', 'rents', { field: 'pricePerUnit', value: parseFloat(e.target.value) || 0 }, index)}
                      />
                    </td>
                    <td className="readonly-cell">{formatCurrency(rent.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Autres revenus</h3>
            
            <div className="revenue-group">
              <h4>Stationnements</h4>
              <div className="input-row">
                <div className="input-group">
                  <label>Nombre</label>
                  <input 
                    type="number" 
                    value={data.income.parking.count}
                    onChange={(e) => handleChange('income', 'parking', parseInt(e.target.value) || 0, 'count')}
                  />
                </div>
                <div className="input-group">
                  <label>Prix unitaire</label>
                  <input 
                    type="number" 
                    value={data.income.parking.pricePerUnit}
                    onChange={(e) => handleChange('income', 'parking', parseFloat(e.target.value) || 0, 'pricePerUnit')}
                  />
                </div>
                <div className="input-group">
                  <label>Total</label>
                  <input 
                    type="text" 
                    value={formatCurrency(data.income.parking.total)}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="revenue-group">
              <h4>Espaces de rangement</h4>
              <div className="input-row">
                <div className="input-group">
                  <label>Nombre</label>
                  <input 
                    type="number" 
                    value={data.income.storage.count}
                    onChange={(e) => handleChange('income', 'storage', parseInt(e.target.value) || 0, 'count')}
                  />
                </div>
                <div className="input-group">
                  <label>Prix unitaire</label>
                  <input 
                    type="number" 
                    value={data.income.storage.pricePerUnit}
                    onChange={(e) => handleChange('income', 'storage', parseFloat(e.target.value) || 0, 'pricePerUnit')}
                  />
                </div>
                <div className="input-group">
                  <label>Total</label>
                  <input 
                    type="text" 
                    value={formatCurrency(data.income.storage.total)}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="revenue-group">
              <h4>Buanderie</h4>
              <div className="input-group">
                <label>Revenu annuel</label>
                <input 
                  type="number" 
                  value={data.income.laundry.revenue}
                  onChange={(e) => handleChange('income', 'laundry', parseFloat(e.target.value) || 0, 'revenue')}
                />
              </div>
            </div>
            
            <div className="revenue-group">
              <h4>Autres revenus</h4>
              <div className="input-row">
                <div className="input-group">
                  <label>Description</label>
                  <input 
                    type="text" 
                    value={data.income.other.description}
                    onChange={(e) => handleChange('income', 'other', e.target.value, 'description')}
                  />
                </div>
                <div className="input-group">
                  <label>Montant annuel</label>
                  <input 
                    type="number" 
                    value={data.income.other.revenue}
                    onChange={(e) => handleChange('income', 'other', parseFloat(e.target.value) || 0, 'revenue')}
                  />
                </div>
              </div>
            </div>
            
            <div className="summary-section">
              <h4>Sommaire des revenus</h4>
              <div className="summary-row">
                <div className="summary-label">Revenu brut potentiel</div>
                <div className="summary-value">{formatCurrency(data.income.potentialGrossIncome)}</div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Taux d'inoccupation (%)</label>
                  <input 
                    type="number" 
                    value={data.income.vacancyRate}
                    onChange={(e) => handleChange('income', 'vacancyRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <label>Perte d'inoccupation</label>
                  <input 
                    type="text" 
                    value={formatCurrency(data.income.vacancyLoss)}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>
              <div className="summary-row">
                <div className="summary-label">Revenu brut effectif</div>
                <div className="summary-value">{formatCurrency(data.income.effectiveGrossIncome)}</div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Onglet des dépenses */}
        <TabPanel>
          <div className="calculator-section">
            <h3>Taxes</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Taxes municipales</label>
                <input 
                  type="number" 
                  value={data.expenses.municipalTax}
                  onChange={(e) => handleChange('expenses', 'municipalTax', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Taxes scolaires</label>
                <input 
                  type="number" 
                  value={data.expenses.schoolTax}
                  onChange={(e) => handleChange('expenses', 'schoolTax', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <h3>Assurances</h3>
            <div className="input-group">
              <label>Assurance</label>
              <input 
                type="number" 
                value={data.expenses.insurance}
                onChange={(e) => handleChange('expenses', 'insurance', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <h3>Énergie</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Électricité</label>
                <input 
                  type="number" 
                  value={data.expenses.electricity}
                  onChange={(e) => handleChange('expenses', 'electricity', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Gaz naturel</label>
                <input 
                  type="number" 
                  value={data.expenses.naturalGas}
                  onChange={(e) => handleChange('expenses', 'naturalGas', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Mazout</label>
                <input 
                  type="number" 
                  value={data.expenses.oil}
                  onChange={(e) => handleChange('expenses', 'oil', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <h3>Entretien</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Entretien et réparations</label>
                <input 
                  type="number" 
                  value={data.expenses.maintenance}
                  onChange={(e) => handleChange('expenses', 'maintenance', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Déneigement</label>
                <input 
                  type="number" 
                  value={data.expenses.snowRemoval}
                  onChange={(e) => handleChange('expenses', 'snowRemoval', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Aménagement paysager</label>
                <input 
                  type="number" 
                  value={data.expenses.landscaping}
                  onChange={(e) => handleChange('expenses', 'landscaping', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <h3>Services professionnels</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Gestion (%)</label>
                <input 
                  type="number" 
                  value={data.expenses.management.percentage}
                  onChange={(e) => handleChange('expenses', 'management.percentage', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Gestion (montant)</label>
                <input 
                  type="text" 
                  value={formatCurrency(data.expenses.management.amount)}
                  readOnly
                  className="readonly-input"
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Conciergerie</label>
                <input 
                  type="number" 
                  value={data.expenses.janitor}
                  onChange={(e) => handleChange('expenses', 'janitor', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Comptabilité</label>
                <input 
                  type="number" 
                  value={data.expenses.accounting}
                  onChange={(e) => handleChange('expenses', 'accounting', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Services juridiques</label>
                <input 
                  type="number" 
                  value={data.expenses.legal}
                  onChange={(e) => handleChange('expenses', 'legal', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <h3>Autres dépenses</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Publicité</label>
                <input 
                  type="number" 
                  value={data.expenses.advertising}
                  onChange={(e) => handleChange('expenses', 'advertising', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <input 
                  type="text" 
                  value={data.expenses.otherExpenses.description}
                  onChange={(e) => handleChange('expenses', 'otherExpenses', e.target.value, 'description')}
                />
              </div>
              <div className="input-group">
                <label>Montant</label>
                <input 
                  type="number" 
                  value={data.expenses.otherExpenses.amount}
                  onChange={(e) => handleChange('expenses', 'otherExpenses', parseFloat(e.target.value) || 0, 'amount')}
                />
              </div>
            </div>
            
            <div className="summary-section">
              <h4>Sommaire des dépenses</h4>
              <div className="summary-row">
                <div className="summary-label">Total des dépenses</div>
                <div className="summary-value">{formatCurrency(data.expenses.totalExpenses)}</div>
              </div>
              <div className="summary-row">
                <div className="summary-label">Pourcentage des revenus</div>
                <div className="summary-value">{formatPercentage(data.expenses.expensesPercentage)}</div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Onglet du financement */}
        <TabPanel>
          <div className="calculator-section">
            <h3>Financement bancaire traditionnel</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Montant</label>
                <input 
                  type="number" 
                  value={data.financing.bankLoan.amount}
                  onChange={(e) => handleChange('financing', 'bankLoan', parseFloat(e.target.value) || 0, 'amount')}
                />
              </div>
              <div className="input-group">
                <label>Pourcentage</label>
                <input 
                  type="number" 
                  value={data.financing.bankLoan.percentage}
                  onChange={(e) => handleChange('financing', 'bankLoan', parseFloat(e.target.value) || 0, 'percentage')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Taux d'intérêt (%)</label>
                <input 
                  type="number" 
                  value={data.financing.bankLoan.rate}
                  onChange={(e) => handleChange('financing', 'bankLoan', parseFloat(e.target.value) || 0, 'rate')}
                  step="0.01"
                />
              </div>
              <div className="input-group">
                <label>Terme (années)</label>
                <input 
                  type="number" 
                  value={data.financing.bankLoan.term}
                  onChange={(e) => handleChange('financing', 'bankLoan', parseInt(e.target.value) || 0, 'term')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Paiement mensuel</label>
                <input 
                  type="text" 
                  value={formatCurrency(data.financing.bankLoan.monthlyPayment)}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <div className="input-group">
                <label>Paiement annuel</label>
                <input 
                  type="text" 
                  value={formatCurrency(data.financing.bankLoan.annualPayment)}
                  readOnly
                  className="readonly-input"
                />
              </div>
            </div>
            
            <h3>Love Money (prêt privé)</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Montant</label>
                <input 
                  type="number" 
                  value={data.financing.privateLoan.amount}
                  onChange={(e) => handleChange('financing', 'privateLoan', parseFloat(e.target.value) || 0, 'amount')}
                />
              </div>
              <div className="input-group">
                <label>Pourcentage</label>
                <input 
                  type="number" 
                  value={data.financing.privateLoan.percentage}
                  onChange={(e) => handleChange('financing', 'privateLoan', parseFloat(e.target.value) || 0, 'percentage')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Taux d'intérêt (%)</label>
                <input 
                  type="number" 
                  value={data.financing.privateLoan.rate}
                  onChange={(e) => handleChange('financing', 'privateLoan', parseFloat(e.target.value) || 0, 'rate')}
                  step="0.01"
                />
              </div>
              <div className="input-group">
                <label>Terme (années)</label>
                <input 
                  type="number" 
                  value={data.financing.privateLoan.term}
                  onChange={(e) => handleChange('financing', 'privateLoan', parseInt(e.target.value) || 0, 'term')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Paiement mensuel</label>
                <input 
                  type="text" 
                  value={formatCurrency(data.financing.privateLoan.monthlyPayment)}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <div className="input-group">
                <label>Paiement annuel</label>
                <input 
                  type="text" 
                  value={formatCurrency(data.financing.privateLoan.annualPayment)}
                  readOnly
                  className="readonly-input"
                />
              </div>
            </div>
            
            <h3>Balance de vente</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Montant</label>
                <input 
                  type="number" 
                  value={data.financing.sellerLoan.amount}
                  onChange={(e) => handleChange('financing', 'sellerLoan', parseFloat(e.target.value) || 0, 'amount')}
                />
              </div>
              <div className="input-group">
                <label>Pourcentage</label>
                <input 
                  type="number" 
                  value={data.financing.sellerLoan.percentage}
                  onChange={(e) => handleChange('financing', 'sellerLoan', parseFloat(e.target.value) || 0, 'percentage')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Taux d'intérêt (%)</label>
                <input 
                  type="number" 
                  value={data.financing.sellerLoan.rate}
                  onChange={(e) => handleChange('financing', 'sellerLoan', parseFloat(e.target.value) || 0, 'rate')}
                  step="0.01"
                />
              </div>
              <div className="input-group">
                <label>Terme (années)</label>
                <input 
                  type="number" 
                  value={data.financing.sellerLoan.term}
                  onChange={(e) => handleChange('financing', 'sellerLoan', parseInt(e.target.value) || 0, 'term')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Paiement mensuel</label>
                <input 
                  type="text" 
                  value={formatCurrency(data.financing.sellerLoan.monthlyPayment)}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <div className="input-group">
                <label>Paiement annuel</label>
                <input 
                  type="text" 
                  value={formatCurrency(data.financing.sellerLoan.annualPayment)}
                  readOnly
                  className="readonly-input"
                />
              </div>
            </div>
            
            <h3>Mise de fonds</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Montant</label>
                <input 
                  type="number" 
                  value={data.financing.downPayment.amount}
                  onChange={(e) => handleChange('financing', 'downPayment', parseFloat(e.target.value) || 0, 'amount')}
                />
              </div>
              <div className="input-group">
                <label>Pourcentage</label>
                <input 
                  type="number" 
                  value={data.financing.downPayment.percentage}
                  onChange={(e) => handleChange('financing', 'downPayment', parseFloat(e.target.value) || 0, 'percentage')}
                />
              </div>
            </div>
            
            <div className="summary-section">
              <h4>Sommaire du financement</h4>
              <div className="summary-row">
                <div className="summary-label">Total du financement</div>
                <div className="summary-value">{formatCurrency(data.financing.totalFinancing)}</div>
              </div>
              <div className="summary-row">
                <div className="summary-label">Paiement mensuel total</div>
                <div className="summary-value">{formatCurrency(data.financing.totalMonthlyPayment)}</div>
              </div>
              <div className="summary-row">
                <div className="summary-label">Paiement annuel total</div>
                <div className="summary-value">{formatCurrency(data.financing.totalAnnualPayment)}</div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Onglet des résultats */}
        <TabPanel>
          <div className="calculator-section">
            <h3>Sommaire des revenus et dépenses</h3>
            <div className="summary-row">
              <div className="summary-label">Revenu brut potentiel</div>
              <div className="summary-value">{formatCurrency(data.results.potentialGrossIncome)}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">Revenu brut effectif</div>
              <div className="summary-value">{formatCurrency(data.results.effectiveGrossIncome)}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">Total des dépenses</div>
              <div className="summary-value">{formatCurrency(data.results.totalExpenses)}</div>
            </div>
            <div className="summary-row highlight">
              <div className="summary-label">Revenu net d'exploitation (NOI)</div>
              <div className="summary-value">{formatCurrency(data.results.netOperatingIncome)}</div>
            </div>
            
            <h3>Mesures de rentabilité</h3>
            <div className="summary-row">
              <div className="summary-label">Cashflow annuel</div>
              <div className="summary-value">{formatCurrency(data.results.cashFlow)}</div>
            </div>
            <div className="summary-row highlight">
              <div className="summary-label">Cashflow par porte par mois</div>
              <div className="summary-value">{formatCurrency(data.results.cashFlowPerDoor)}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">Cashflow en pourcentage de la mise de fonds</div>
              <div className="summary-value">{formatPercentage(data.results.cashFlowPercentage)}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">Taux de capitalisation (CAP Rate)</div>
              <div className="summary-value">{formatPercentage(data.results.capRate)}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">GRM (Gross Rent Multiplier)</div>
              <div className="summary-value">{data.results.GRM.toFixed(2)}</div>
            </div>
            
            <h3>Retour sur investissement</h3>
            <div className="summary-row">
              <div className="summary-label">Retour sur investissement (ROI)</div>
              <div className="summary-value">{formatPercentage(data.results.returnOnInvestment)}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">Retour sur équité (ROE)</div>
              <div className="summary-value">{formatPercentage(data.results.returnOnEquity)}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">TGA (Taux Global d'Actualisation)</div>
              <div className="summary-value">{formatPercentage(data.results.tga)}</div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MultiCalculator;