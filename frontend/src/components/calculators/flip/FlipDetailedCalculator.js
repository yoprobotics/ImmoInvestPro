import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import GeneralInfoForm from './forms/GeneralInfoForm';
import AcquisitionCostsForm from './forms/AcquisitionCostsForm';
import RenovationCostsForm from './forms/RenovationCostsForm';
import SellingCostsForm from './forms/SellingCostsForm';
import RevenuesForm from './forms/RevenuesForm';
import HoldingCostsForm from './forms/HoldingCostsForm';
import FinancingForm from './forms/FinancingForm';
import FlipResults from './results/FlipResults';
import FlipComparison from './results/FlipComparison';
import LoadingBackdrop from '../../common/LoadingBackdrop';
import { calculateFlipDetailed } from '../../../services/calculatorService';
import { useSnackbar } from 'notistack';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`flip-tabpanel-${index}`}
      aria-labelledby={`flip-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

// Function to get props for tabs
function a11yProps(index) {
  return {
    id: `flip-tab-${index}`,
    'aria-controls': `flip-tabpanel-${index}`,
  };
}

// Initialize default data for a new Flip project
const initializeDefaultData = () => {
  return {
    actions: {
      flipPlan: "Renovation and sale",
      acquisitionDate: new Date().toISOString().split('T')[0],
      expectedSaleDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
      holdingPeriodMonths: 6
    },
    generalInfo: {
      address: "",
      city: "",
      province: "",
      postalCode: "",
      propertyType: "Residential",
      yearBuilt: new Date().getFullYear() - 30,
      lotSize: 0,
      buildingSize: 0,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      parkingSpaces: 1,
      description: ""
    },
    acquisitionCosts: {
      purchasePrice: 0,
      transferTax: 0,
      legalFees: 1500,
      inspectionFees: 500,
      appraisalFees: 350,
      mortgageInsurance: 0,
      mortgageSetupFees: 250,
      otherAcquisitionFees: 0
    },
    renovationCosts: {
      kitchen: 0,
      bathroom: 0,
      flooring: 0,
      painting: 0,
      windows: 0,
      doors: 0,
      roofing: 0,
      electrical: 0,
      plumbing: 0,
      hvac: 0,
      foundation: 0,
      exterior: 0,
      landscape: 0,
      permits: 0,
      laborCosts: 0,
      materials: 0,
      contingency: 0,
      otherRenovationCosts: 0
    },
    sellingCosts: {
      realEstateCommission: 0,
      legalFeesForSale: 1200,
      marketingCosts: 500,
      stagingCosts: 2000,
      prepaymentPenalty: 0,
      otherSellingCosts: 0
    },
    revenues: {
      expectedSalePrice: 0,
      rentalIncome: 0,
      otherRevenues: 0
    },
    holdingCosts: {
      propertyTaxes: 0,
      insurance: 0,
      utilities: 0,
      maintenance: 0,
      otherHoldingCosts: 0
    },
    maintenanceCosts: {
      repairs: 0,
      cleaning: 0,
      landscaping: 0,
      snowRemoval: 0,
      otherMaintenanceCosts: 0
    },
    propertyFinancing: {
      downPayment: 0,
      downPaymentPercentage: 20,
      firstMortgageAmount: 0,
      firstMortgageRate: 4.5,
      firstMortgageTerm: 5,
      firstMortgageAmortization: 25,
      secondMortgageAmount: 0,
      secondMortgageRate: 0,
      secondMortgageTerm: 0,
      secondMortgageAmortization: 0,
      privateLoanAmount: 0,
      privateLoanRate: 0,
      privateLoanTerm: 0,
      vendorTakeBackAmount: 0,
      vendorTakeBackRate: 0,
      vendorTakeBackTerm: 0
    },
    renovationFinancing: {
      personalFunds: 0,
      creditLineAmount: 0,
      creditLineRate: 6.5,
      renovationLoanAmount: 0,
      renovationLoanRate: 0,
      renovationLoanTerm: 0
    }
  };
};

const FlipDetailedCalculator = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Initialize scenarios
  const [scenario1, setScenario1] = useState(initializeDefaultData());
  const [scenario2, setScenario2] = useState(initializeDefaultData());
  const [scenario3, setScenario3] = useState(initializeDefaultData());
  const [activeScenario, setActiveScenario] = useState(1);

  // Update active scenario data
  const handleScenarioChange = (event, newValue) => {
    setActiveScenario(newValue);
  };

  // Get current scenario data and setter
  const getCurrentScenarioData = () => {
    switch (activeScenario) {
      case 1:
        return { data: scenario1, setData: setScenario1 };
      case 2:
        return { data: scenario2, setData: setScenario2 };
      case 3:
        return { data: scenario3, setData: setScenario3 };
      default:
        return { data: scenario1, setData: setScenario1 };
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Update form data for the current scenario
  const updateForm = (section, newData) => {
    const { data, setData } = getCurrentScenarioData();
    setData({
      ...data,
      [section]: {
        ...data[section],
        ...newData
      }
    });
  };

  // Calculate results
  const calculateResults = async () => {
    setLoading(true);
    try {
      const calculationResults = await calculateFlipDetailed({
        scenario1,
        scenario2,
        scenario3
      });
      setResults(calculationResults);
      enqueueSnackbar('Calculations completed successfully!', { variant: 'success' });
      // Switch to results tab
      setTabIndex(7);
    } catch (error) {
      console.error('Error calculating results:', error);
      enqueueSnackbar('Error calculating results. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Reset all scenarios to default
  const resetCalculator = () => {
    setScenario1(initializeDefaultData());
    setScenario2(initializeDefaultData());
    setScenario3(initializeDefaultData());
    setResults(null);
    setTabIndex(0);
    setActiveScenario(1);
    enqueueSnackbar('Calculator reset successfully!', { variant: 'info' });
  };

  return (
    <Container maxWidth="lg">
      <LoadingBackdrop open={loading} />
      
      <Typography variant="h4" component="h1" gutterBottom align="center">
        FLIP Detailed Calculator
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={activeScenario}
              onChange={handleScenarioChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Scenario 1" />
              <Tab label="Scenario 2" />
              <Tab label="Scenario 3" />
            </Tabs>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="General Info" {...a11yProps(0)} />
              <Tab label="Acquisition" {...a11yProps(1)} />
              <Tab label="Renovation" {...a11yProps(2)} />
              <Tab label="Selling" {...a11yProps(3)} />
              <Tab label="Revenues" {...a11yProps(4)} />
              <Tab label="Holding Costs" {...a11yProps(5)} />
              <Tab label="Financing" {...a11yProps(6)} />
              <Tab label="Results" {...a11yProps(7)} disabled={!results} />
            </Tabs>

            <TabPanel value={tabIndex} index={0}>
              <GeneralInfoForm 
                data={getCurrentScenarioData().data.generalInfo} 
                updateForm={(newData) => updateForm('generalInfo', newData)}
                actionsData={getCurrentScenarioData().data.actions}
                updateActions={(newData) => updateForm('actions', newData)}
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
              <AcquisitionCostsForm 
                data={getCurrentScenarioData().data.acquisitionCosts} 
                updateForm={(newData) => updateForm('acquisitionCosts', newData)} 
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={2}>
              <RenovationCostsForm 
                data={getCurrentScenarioData().data.renovationCosts} 
                updateForm={(newData) => updateForm('renovationCosts', newData)} 
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={3}>
              <SellingCostsForm 
                data={getCurrentScenarioData().data.sellingCosts} 
                updateForm={(newData) => updateForm('sellingCosts', newData)} 
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={4}>
              <RevenuesForm 
                data={getCurrentScenarioData().data.revenues} 
                updateForm={(newData) => updateForm('revenues', newData)} 
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={5}>
              <HoldingCostsForm 
                data={{
                  ...getCurrentScenarioData().data.holdingCosts,
                  ...getCurrentScenarioData().data.maintenanceCosts
                }} 
                updateForm={(newData) => {
                  // Split the form data between holdingCosts and maintenanceCosts
                  const holdingKeys = Object.keys(getCurrentScenarioData().data.holdingCosts);
                  const maintenanceKeys = Object.keys(getCurrentScenarioData().data.maintenanceCosts);

                  const holdingData = {};
                  const maintenanceData = {};

                  Object.keys(newData).forEach(key => {
                    if (holdingKeys.includes(key)) {
                      holdingData[key] = newData[key];
                    } else if (maintenanceKeys.includes(key)) {
                      maintenanceData[key] = newData[key];
                    }
                  });

                  updateForm('holdingCosts', holdingData);
                  updateForm('maintenanceCosts', maintenanceData);
                }} 
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={6}>
              <FinancingForm 
                data={{
                  property: getCurrentScenarioData().data.propertyFinancing,
                  renovation: getCurrentScenarioData().data.renovationFinancing
                }} 
                updateForm={(section, newData) => {
                  if (section === 'property') {
                    updateForm('propertyFinancing', newData);
                  } else if (section === 'renovation') {
                    updateForm('renovationFinancing', newData);
                  }
                }} 
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={7}>
              {results && (
                <>
                  <FlipResults results={results.scenario1} scenarioNumber={1} />
                  <Box mt={4}>
                    <FlipComparison comparison={results.comparison} bestScenario={results.bestScenario} />
                  </Box>
                </>
              )}
            </TabPanel>

            <Box p={3} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="secondary"
                onClick={resetCalculator}
              >
                Reset
              </Button>

              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setTabIndex(Math.max(0, tabIndex - 1))}
                  disabled={tabIndex === 0}
                  style={{ marginRight: 8 }}
                >
                  Previous
                </Button>
                
                {tabIndex < 6 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setTabIndex(tabIndex + 1)}
                  >
                    Next
                  </Button>
                ) : tabIndex === 6 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={calculateResults}
                  >
                    Calculate
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.print()}
                  >
                    Print Results
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FlipDetailedCalculator;
