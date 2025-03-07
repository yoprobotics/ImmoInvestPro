import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  TextField, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  InputAdornment,
  Slider,
  Box,
  Button,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { formatCurrency, formatPercent } from '../../../../utils/formatters';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`financing-tabpanel-${index}`}
      aria-labelledby={`financing-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

// Function to get props for tabs
function a11yProps(index) {
  return {
    id: `financing-tab-${index}`,
    'aria-controls': `financing-tabpanel-${index}`,
  };
}

const FinancingForm = ({ data, updateForm }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [renovationCosts, setRenovationCosts] = useState(0);
  const [holdingPeriod, setHoldingPeriod] = useState(6); // Default 6 months
  
  // Try to get purchase price, renovation costs, and holding period from the form
  useEffect(() => {
    const purchasePriceField = document.querySelector('input[name="purchasePrice"]');
    if (purchasePriceField) {
      setPurchasePrice(Number(purchasePriceField.value || 0));
    }
    
    const renovationCostsField = document.querySelector('input[name="totalRenovationCosts"]');
    if (renovationCostsField) {
      setRenovationCosts(Number(renovationCostsField.value || 0));
    }
    
    const holdingPeriodField = document.querySelector('input[name="holdingPeriodMonths"]');
    if (holdingPeriodField) {
      setHoldingPeriod(Number(holdingPeriodField.value || 6));
    }
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Update property financing data
  const handlePropertyFinancingChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    updateForm('property', { [name]: numValue });
    
    // If downPayment or downPaymentPercentage changes, update the other value
    if (name === 'downPayment') {
      if (purchasePrice > 0) {
        const percentage = (numValue / purchasePrice) * 100;
        updateForm('property', { downPaymentPercentage: parseFloat(percentage.toFixed(2)) });
      }
    } else if (name === 'downPaymentPercentage') {
      if (purchasePrice > 0) {
        const amount = (purchasePrice * numValue) / 100;
        updateForm('property', { downPayment: parseFloat(amount.toFixed(2)) });
      }
    }
  };

  // Update renovation financing data
  const handleRenovationFinancingChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    updateForm('renovation', { [name]: numValue });
  };

  // Calculate and update mortgage details when values change
  useEffect(() => {
    if (purchasePrice > 0 && data.property.downPaymentPercentage > 0) {
      // Calculate first mortgage amount (if downPayment changed directly)
      const firstMortgageAmount = purchasePrice - data.property.downPayment;
      
      // Calculate monthly payment for first mortgage
      if (data.property.firstMortgageRate > 0 && data.property.firstMortgageAmortization > 0) {
        const monthlyRate = data.property.firstMortgageRate / 100 / 12;
        const numberOfPayments = data.property.firstMortgageAmortization * 12;
        
        let monthlyPayment = 0;
        if (monthlyRate > 0) {
          monthlyPayment = firstMortgageAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        } else {
          monthlyPayment = firstMortgageAmount / numberOfPayments;
        }
        
        updateForm('property', {
          firstMortgageAmount,
          monthlyPaymentFirstMortgage: parseFloat(monthlyPayment.toFixed(2))
        });
      } else {
        updateForm('property', { firstMortgageAmount });
      }
    }
  }, [
    purchasePrice,
    data.property.downPayment,
    data.property.downPaymentPercentage,
    data.property.firstMortgageRate,
    data.property.firstMortgageAmortization
  ]);

  // Calculate and update second mortgage
  useEffect(() => {
    if (data.property.secondMortgageAmount > 0 && data.property.secondMortgageRate > 0 && data.property.secondMortgageAmortization > 0) {
      const monthlyRate = data.property.secondMortgageRate / 100 / 12;
      const numberOfPayments = data.property.secondMortgageAmortization * 12;
      
      let monthlyPayment = 0;
      if (monthlyRate > 0) {
        monthlyPayment = data.property.secondMortgageAmount * 
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      } else {
        monthlyPayment = data.property.secondMortgageAmount / numberOfPayments;
      }
      
      updateForm('property', {
        monthlyPaymentSecondMortgage: parseFloat(monthlyPayment.toFixed(2))
      });
    }
  }, [
    data.property.secondMortgageAmount,
    data.property.secondMortgageRate,
    data.property.secondMortgageAmortization
  ]);

  // Calculate and update private loan
  useEffect(() => {
    if (data.property.privateLoanAmount > 0 && data.property.privateLoanRate > 0 && data.property.privateLoanTerm > 0) {
      const monthlyRate = data.property.privateLoanRate / 100 / 12;
      const numberOfPayments = data.property.privateLoanTerm * 12;
      
      let monthlyPayment = 0;
      if (monthlyRate > 0) {
        monthlyPayment = data.property.privateLoanAmount * 
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      } else {
        monthlyPayment = data.property.privateLoanAmount / numberOfPayments;
      }
      
      updateForm('property', {
        monthlyPaymentPrivateLoan: parseFloat(monthlyPayment.toFixed(2))
      });
    }
  }, [
    data.property.privateLoanAmount,
    data.property.privateLoanRate,
    data.property.privateLoanTerm
  ]);

  // Calculate and update vendor take back
  useEffect(() => {
    if (data.property.vendorTakeBackAmount > 0 && data.property.vendorTakeBackRate > 0 && data.property.vendorTakeBackTerm > 0) {
      const monthlyRate = data.property.vendorTakeBackRate / 100 / 12;
      const numberOfPayments = data.property.vendorTakeBackTerm * 12;
      
      let monthlyPayment = 0;
      if (monthlyRate > 0) {
        monthlyPayment = data.property.vendorTakeBackAmount * 
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      } else {
        monthlyPayment = data.property.vendorTakeBackAmount / numberOfPayments;
      }
      
      updateForm('property', {
        monthlyPaymentVendorTakeBack: parseFloat(monthlyPayment.toFixed(2))
      });
    }
  }, [
    data.property.vendorTakeBackAmount,
    data.property.vendorTakeBackRate,
    data.property.vendorTakeBackTerm
  ]);

  // Calculate total monthly payment for property financing
  useEffect(() => {
    const totalMonthlyPayment = 
      (data.property.monthlyPaymentFirstMortgage || 0) + 
      (data.property.monthlyPaymentSecondMortgage || 0) + 
      (data.property.monthlyPaymentPrivateLoan || 0) + 
      (data.property.monthlyPaymentVendorTakeBack || 0);
    
    updateForm('property', { totalMonthlyPayment });
    
    // Calculate total interest paid during the holding period
    // This is a simplified calculation that assumes interest-only payments for the short holding period
    const totalInterestPaid = 
      (data.property.firstMortgageAmount || 0) * (data.property.firstMortgageRate || 0) / 100 / 12 * holdingPeriod +
      (data.property.secondMortgageAmount || 0) * (data.property.secondMortgageRate || 0) / 100 / 12 * holdingPeriod +
      (data.property.privateLoanAmount || 0) * (data.property.privateLoanRate || 0) / 100 / 12 * holdingPeriod +
      (data.property.vendorTakeBackAmount || 0) * (data.property.vendorTakeBackRate || 0) / 100 / 12 * holdingPeriod;
    
    updateForm('property', { totalInterestPaid });
  }, [
    data.property.monthlyPaymentFirstMortgage,
    data.property.monthlyPaymentSecondMortgage,
    data.property.monthlyPaymentPrivateLoan,
    data.property.monthlyPaymentVendorTakeBack,
    data.property.firstMortgageAmount,
    data.property.firstMortgageRate,
    data.property.secondMortgageAmount,
    data.property.secondMortgageRate,
    data.property.privateLoanAmount,
    data.property.privateLoanRate,
    data.property.vendorTakeBackAmount,
    data.property.vendorTakeBackRate,
    holdingPeriod
  ]);

  // Calculate and update renovation financing details
  useEffect(() => {
    if (data.renovation.creditLineAmount > 0 && data.renovation.creditLineRate > 0) {
      // Simplified calculation for credit line payment (interest only)
      const monthlyPayment = data.renovation.creditLineAmount * data.renovation.creditLineRate / 100 / 12;
      
      updateForm('renovation', {
        monthlyPaymentCreditLine: parseFloat(monthlyPayment.toFixed(2))
      });
    }
    
    if (data.renovation.renovationLoanAmount > 0 && data.renovation.renovationLoanRate > 0 && data.renovation.renovationLoanTerm > 0) {
      const monthlyRate = data.renovation.renovationLoanRate / 100 / 12;
      const numberOfPayments = data.renovation.renovationLoanTerm; // Already in months
      
      let monthlyPayment = 0;
      if (monthlyRate > 0) {
        monthlyPayment = data.renovation.renovationLoanAmount * 
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      } else {
        monthlyPayment = data.renovation.renovationLoanAmount / numberOfPayments;
      }
      
      updateForm('renovation', {
        monthlyPaymentRenovationLoan: parseFloat(monthlyPayment.toFixed(2))
      });
    }
  }, [
    data.renovation.creditLineAmount,
    data.renovation.creditLineRate,
    data.renovation.renovationLoanAmount,
    data.renovation.renovationLoanRate,
    data.renovation.renovationLoanTerm
  ]);

  // Calculate total monthly payment and interest for renovation financing
  useEffect(() => {
    const totalMonthlyPaymentRenovation = 
      (data.renovation.monthlyPaymentCreditLine || 0) + 
      (data.renovation.monthlyPaymentRenovationLoan || 0);
    
    updateForm('renovation', { totalMonthlyPaymentRenovation });
    
    // Calculate total interest paid during the holding period
    const totalInterestPaidRenovation = 
      (data.renovation.creditLineAmount || 0) * (data.renovation.creditLineRate || 0) / 100 / 12 * holdingPeriod +
      (data.renovation.renovationLoanAmount || 0) * (data.renovation.renovationLoanRate || 0) / 100 / 12 * holdingPeriod;
    
    updateForm('renovation', { totalInterestPaidRenovation });
  }, [
    data.renovation.monthlyPaymentCreditLine,
    data.renovation.monthlyPaymentRenovationLoan,
    data.renovation.creditLineAmount,
    data.renovation.creditLineRate,
    data.renovation.renovationLoanAmount,
    data.renovation.renovationLoanRate,
    holdingPeriod
  ]);

  // Function to set up default creative financing structure
  const applyCreativeFinancingTemplate = () => {
    if (!purchasePrice) {
      alert("Please enter a purchase price first!");
      return;
    }
    
    // Typical creative financing structure: 75% bank, 15% vendor/private, 10% down payment
    const downPayment = purchasePrice * 0.10;
    const firstMortgage = purchasePrice * 0.75;
    const vendorTakeBack = purchasePrice * 0.15;
    
    updateForm('property', {
      downPayment,
      downPaymentPercentage: 10,
      firstMortgageAmount: firstMortgage,
      firstMortgageRate: 4.5,
      firstMortgageTerm: 5,
      firstMortgageAmortization: 25,
      vendorTakeBackAmount: vendorTakeBack,
      vendorTakeBackRate: 6.5,
      vendorTakeBackTerm: 3
    });
  };

  // Function to set up renovation financing
  const applyRenovationFinancingTemplate = () => {
    if (!renovationCosts) {
      alert("Please enter renovation costs first!");
      return;
    }
    
    // Split renovation costs: 25% personal funds, 75% credit line
    const personalFunds = renovationCosts * 0.25;
    const creditLine = renovationCosts * 0.75;
    
    updateForm('renovation', {
      personalFunds,
      creditLineAmount: creditLine,
      creditLineRate: 6.5
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Financing
        </Typography>
        <Divider />
      </Grid>
      
      <Grid item xs={12}>
        <Paper>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Property Financing" {...a11yProps(0)} />
            <Tab label="Renovation Financing" {...a11yProps(1)} />
          </Tabs>
          
          <TabPanel value={tabIndex} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mt={2} mb={3}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={applyCreativeFinancingTemplate}
                  >
                    Apply Creative Financing Template
                  </Button>
                </Box>
                
                {purchasePrice > 0 && (
                  <Alert severity="info" style={{ marginBottom: 16 }}>
                    <Typography variant="body2">
                      Property Purchase Price: <strong>{formatCurrency(purchasePrice)}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Creative financing typically uses: 75% bank financing, 15% vendor take-back/private lender, and 10% down payment.
                    </Typography>
                  </Alert>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Down Payment
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Down Payment"
                  name="downPayment"
                  type="number"
                  value={data.property.downPayment || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Down Payment Percentage: {data.property.downPaymentPercentage || 0}%</Typography>
                <Slider
                  value={data.property.downPaymentPercentage || 0}
                  onChange={(e, newValue) => handlePropertyFinancingChange({ target: { name: 'downPaymentPercentage', value: newValue } })}
                  aria-labelledby="down-payment-slider"
                  step={1}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 5, label: '5%' },
                    { value: 10, label: '10%' },
                    { value: 15, label: '15%' },
                    { value: 20, label: '20%' },
                    { value: 25, label: '25%' }
                  ]}
                  min={0}
                  max={25}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  First Mortgage
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Mortgage Amount"
                  name="firstMortgageAmount"
                  type="number"
                  value={data.property.firstMortgageAmount || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                  helperText={purchasePrice > 0 ? `${formatPercent((data.property.firstMortgageAmount || 0) / purchasePrice * 100)} of purchase price` : ''}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Mortgage Rate"
                  name="firstMortgageRate"
                  type="number"
                  value={data.property.firstMortgageRate || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, step: 0.05 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Mortgage Term"
                  name="firstMortgageTerm"
                  type="number"
                  value={data.property.firstMortgageTerm || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Mortgage Amortization"
                  name="firstMortgageAmortization"
                  type="number"
                  value={data.property.firstMortgageAmortization || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Second Mortgage (Optional)
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Second Mortgage Amount"
                  name="secondMortgageAmount"
                  type="number"
                  value={data.property.secondMortgageAmount || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                  helperText={purchasePrice > 0 ? `${formatPercent((data.property.secondMortgageAmount || 0) / purchasePrice * 100)} of purchase price` : ''}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Second Mortgage Rate"
                  name="secondMortgageRate"
                  type="number"
                  value={data.property.secondMortgageRate || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, step: 0.05 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Second Mortgage Term"
                  name="secondMortgageTerm"
                  type="number"
                  value={data.property.secondMortgageTerm || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Second Mortgage Amortization"
                  name="secondMortgageAmortization"
                  type="number"
                  value={data.property.secondMortgageAmortization || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Private Loan / Balance de Vendeur
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Private Loan Amount"
                  name="privateLoanAmount"
                  type="number"
                  value={data.property.privateLoanAmount || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                  helperText={purchasePrice > 0 ? `${formatPercent((data.property.privateLoanAmount || 0) / purchasePrice * 100)} of purchase price` : ''}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Private Loan Rate"
                  name="privateLoanRate"
                  type="number"
                  value={data.property.privateLoanRate || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, step: 0.05 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Private Loan Term"
                  name="privateLoanTerm"
                  type="number"
                  value={data.property.privateLoanTerm || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vendor Take Back Amount"
                  name="vendorTakeBackAmount"
                  type="number"
                  value={data.property.vendorTakeBackAmount || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                  helperText={purchasePrice > 0 ? `${formatPercent((data.property.vendorTakeBackAmount || 0) / purchasePrice * 100)} of purchase price` : ''}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vendor Take Back Rate"
                  name="vendorTakeBackRate"
                  type="number"
                  value={data.property.vendorTakeBackRate || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, step: 0.05 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vendor Take Back Term"
                  name="vendorTakeBackTerm"
                  type="number"
                  value={data.property.vendorTakeBackTerm || ''}
                  onChange={handlePropertyFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider style={{ margin: '20px 0' }} />
                <Typography variant="h6" gutterBottom>
                  Property Financing Summary
                </Typography>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Financing Type</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Monthly Payment</TableCell>
                        <TableCell align="right">% of Purchase</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>First Mortgage</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.firstMortgageAmount || 0)}</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.monthlyPaymentFirstMortgage || 0)}</TableCell>
                        <TableCell align="right">
                          {purchasePrice ? 
                            ((data.property.firstMortgageAmount || 0) / purchasePrice * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Second Mortgage</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.secondMortgageAmount || 0)}</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.monthlyPaymentSecondMortgage || 0)}</TableCell>
                        <TableCell align="right">
                          {purchasePrice ? 
                            ((data.property.secondMortgageAmount || 0) / purchasePrice * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Private Loan</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.privateLoanAmount || 0)}</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.monthlyPaymentPrivateLoan || 0)}</TableCell>
                        <TableCell align="right">
                          {purchasePrice ? 
                            ((data.property.privateLoanAmount || 0) / purchasePrice * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Vendor Take Back</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.vendorTakeBackAmount || 0)}</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.monthlyPaymentVendorTakeBack || 0)}</TableCell>
                        <TableCell align="right">
                          {purchasePrice ? 
                            ((data.property.vendorTakeBackAmount || 0) / purchasePrice * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Down Payment</TableCell>
                        <TableCell align="right">{formatCurrency(data.property.downPayment || 0)}</TableCell>
                        <TableCell align="right">-</TableCell>
                        <TableCell align="right">
                          {purchasePrice ? 
                            ((data.property.downPayment || 0) / purchasePrice * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(
                          (data.property.firstMortgageAmount || 0) + 
                          (data.property.secondMortgageAmount || 0) + 
                          (data.property.privateLoanAmount || 0) + 
                          (data.property.vendorTakeBackAmount || 0) + 
                          (data.property.downPayment || 0)
                        )}</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(data.property.totalMonthlyPayment || 0)}</strong></TableCell>
                        <TableCell align="right">
                          {purchasePrice ? 
                            (((data.property.firstMortgageAmount || 0) + 
                             (data.property.secondMortgageAmount || 0) + 
                             (data.property.privateLoanAmount || 0) + 
                             (data.property.vendorTakeBackAmount || 0) + 
                             (data.property.downPayment || 0)) / purchasePrice * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>Total Interest (for {holdingPeriod} months)</TableCell>
                        <TableCell align="right" colSpan={2}>{formatCurrency(data.property.totalInterestPaid || 0)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabIndex} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mt={2} mb={3}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={applyRenovationFinancingTemplate}
                  >
                    Apply Renovation Financing Template
                  </Button>
                </Box>
                
                {renovationCosts > 0 && (
                  <Alert severity="info" style={{ marginBottom: 16 }}>
                    <Typography variant="body2">
                      Total Renovation Costs: <strong>{formatCurrency(renovationCosts)}</strong>
                    </Typography>
                    <Typography variant="body2">
                      A common approach is to use 25% personal funds and 75% credit line or renovation loan.
                    </Typography>
                  </Alert>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Personal Funds"
                  name="personalFunds"
                  type="number"
                  value={data.renovation.personalFunds || ''}
                  onChange={handleRenovationFinancingChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                  helperText={renovationCosts > 0 ? `${formatPercent((data.renovation.personalFunds || 0) / renovationCosts * 100)} of renovation costs` : ''}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Credit Line Amount"
                  name="creditLineAmount"
                  type="number"
                  value={data.renovation.creditLineAmount || ''}
                  onChange={handleRenovationFinancingChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                  helperText={renovationCosts > 0 ? `${formatPercent((data.renovation.creditLineAmount || 0) / renovationCosts * 100)} of renovation costs` : ''}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Credit Line Rate"
                  name="creditLineRate"
                  type="number"
                  value={data.renovation.creditLineRate || ''}
                  onChange={handleRenovationFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, step: 0.05 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Renovation Loan Amount"
                  name="renovationLoanAmount"
                  type="number"
                  value={data.renovation.renovationLoanAmount || ''}
                  onChange={handleRenovationFinancingChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                  helperText={renovationCosts > 0 ? `${formatPercent((data.renovation.renovationLoanAmount || 0) / renovationCosts * 100)} of renovation costs` : ''}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Renovation Loan Rate"
                  name="renovationLoanRate"
                  type="number"
                  value={data.renovation.renovationLoanRate || ''}
                  onChange={handleRenovationFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, step: 0.05 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Renovation Loan Term"
                  name="renovationLoanTerm"
                  type="number"
                  value={data.renovation.renovationLoanTerm || ''}
                  onChange={handleRenovationFinancingChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">months</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider style={{ margin: '20px 0' }} />
                <Typography variant="h6" gutterBottom>
                  Renovation Financing Summary
                </Typography>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Financing Type</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Monthly Payment</TableCell>
                        <TableCell align="right">% of Renovation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Personal Funds</TableCell>
                        <TableCell align="right">{formatCurrency(data.renovation.personalFunds || 0)}</TableCell>
                        <TableCell align="right">-</TableCell>
                        <TableCell align="right">
                          {renovationCosts ? 
                            ((data.renovation.personalFunds || 0) / renovationCosts * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Credit Line</TableCell>
                        <TableCell align="right">{formatCurrency(data.renovation.creditLineAmount || 0)}</TableCell>
                        <TableCell align="right">{formatCurrency(data.renovation.monthlyPaymentCreditLine || 0)}</TableCell>
                        <TableCell align="right">
                          {renovationCosts ? 
                            ((data.renovation.creditLineAmount || 0) / renovationCosts * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Renovation Loan</TableCell>
                        <TableCell align="right">{formatCurrency(data.renovation.renovationLoanAmount || 0)}</TableCell>
                        <TableCell align="right">{formatCurrency(data.renovation.monthlyPaymentRenovationLoan || 0)}</TableCell>
                        <TableCell align="right">
                          {renovationCosts ? 
                            ((data.renovation.renovationLoanAmount || 0) / renovationCosts * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(
                          (data.renovation.personalFunds || 0) + 
                          (data.renovation.creditLineAmount || 0) + 
                          (data.renovation.renovationLoanAmount || 0)
                        )}</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(data.renovation.totalMonthlyPaymentRenovation || 0)}</strong></TableCell>
                        <TableCell align="right">
                          {renovationCosts ? 
                            (((data.renovation.personalFunds || 0) + 
                             (data.renovation.creditLineAmount || 0) + 
                             (data.renovation.renovationLoanAmount || 0)) / renovationCosts * 100).toFixed(1) + '%' : 
                            '0.0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>Total Interest (for {holdingPeriod} months)</TableCell>
                        <TableCell align="right" colSpan={2}>{formatCurrency(data.renovation.totalInterestPaidRenovation || 0)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Creative Financing Tips:
          </Typography>
          <Typography variant="body2">
            • Use a balance de vendeur (vendor take-back) to reduce the amount of cash needed<br />
            • Consider private lenders for short-term FLIP projects<br />
            • Credit lines often have lower interest rates than renovation-specific loans<br />
            • Typical FLIP financing uses higher interest rates but for shorter periods<br />
            • Be strategic about which parts of the renovation to finance vs. pay cash for
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FinancingForm;
