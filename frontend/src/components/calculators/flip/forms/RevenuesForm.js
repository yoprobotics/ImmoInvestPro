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
  Alert,
  Box
} from '@mui/material';
import { formatCurrency } from '../../../../utils/formatters';

const RevenuesForm = ({ data, updateForm }) => {
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [renovationCosts, setRenovationCosts] = useState(0);
  
  // Try to get the purchase price from the form
  useEffect(() => {
    const purchasePriceField = document.querySelector('input[name="purchasePrice"]');
    if (purchasePriceField) {
      setPurchasePrice(Number(purchasePriceField.value || 0));
    }
    
    // Try to get the renovation costs from the form
    const renovationCostsField = document.querySelector('input[name="totalRenovationCosts"]');
    if (renovationCostsField) {
      setRenovationCosts(Number(renovationCostsField.value || 0));
    } else {
      // If not directly available, try to estimate from data
      const renovationTotal = document.querySelectorAll('input[name^="renovation"]');
      let total = 0;
      renovationTotal.forEach(field => {
        total += Number(field.value || 0);
      });
      if (total > 0) {
        setRenovationCosts(total);
      }
    }
  }, []);

  // Calculate total revenues
  useEffect(() => {
    const total = 
      Number(data.expectedSalePrice || 0) + 
      Number(data.rentalIncome || 0) + 
      Number(data.otherRevenues || 0);
    
    setTotalRevenues(total);
    updateForm({ totalRevenues: total });
  }, [
    data.expectedSalePrice,
    data.rentalIncome,
    data.otherRevenues
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    updateForm({ [name]: numValue });
  };

  // Calculate the ARV (After Repair Value) based on purchase price and estimated renovation costs
  const estimatedARV = purchasePrice + (renovationCosts * 1.8); // Rule of thumb: renovations should add about 1.8x their cost
  
  // Calculate potential profit based on current values
  const potentialProfit = data.expectedSalePrice - purchasePrice - renovationCosts;
  const profitMargin = data.expectedSalePrice ? (potentialProfit / data.expectedSalePrice) * 100 : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Revenues
        </Typography>
        <Divider />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Expected Sale Price"
          name="expectedSalePrice"
          type="number"
          value={data.expectedSalePrice || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="The price you expect to sell the property for"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Rental Income"
          name="rentalIncome"
          type="number"
          value={data.rentalIncome || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Any income from renting the property before selling"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Other Revenues"
          name="otherRevenues"
          type="number"
          value={data.otherRevenues || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Any other revenue sources"
        />
      </Grid>

      {purchasePrice > 0 && renovationCosts > 0 && (
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="subtitle1">
              Estimated ARV (After Repair Value): {formatCurrency(estimatedARV)}
            </Typography>
            <Typography variant="body2">
              Based on purchase price ({formatCurrency(purchasePrice)}) and renovation costs ({formatCurrency(renovationCosts)}). 
              This is just an estimate using a 1.8x multiplier on renovation costs.
            </Typography>
          </Alert>
        </Grid>
      )}

      {data.expectedSalePrice > 0 && purchasePrice > 0 && renovationCosts > 0 && (
        <Grid item xs={12}>
          <Alert severity={profitMargin >= 15 ? "success" : profitMargin >= 10 ? "info" : "warning"}>
            <Typography variant="subtitle1">
              Estimated Profit: {formatCurrency(potentialProfit)} ({profitMargin.toFixed(1)}% margin)
            </Typography>
            <Typography variant="body2">
              Based on expected sale price ({formatCurrency(data.expectedSalePrice)}), purchase price ({formatCurrency(purchasePrice)}), 
              and renovation costs ({formatCurrency(renovationCosts)}). This is a simple calculation that doesn't include holding costs, 
              financing costs, or selling costs.
            </Typography>
          </Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant="h6" gutterBottom>
          Revenue Summary
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Revenue Source</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">% of Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Expected Sale Price</TableCell>
                <TableCell align="right">{formatCurrency(data.expectedSalePrice || 0)}</TableCell>
                <TableCell align="right">
                  {totalRevenues ? 
                    ((data.expectedSalePrice || 0) / totalRevenues * 100).toFixed(1) + '%' : 
                    '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rental Income</TableCell>
                <TableCell align="right">{formatCurrency(data.rentalIncome || 0)}</TableCell>
                <TableCell align="right">
                  {totalRevenues ? 
                    ((data.rentalIncome || 0) / totalRevenues * 100).toFixed(1) + '%' : 
                    '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Revenues</TableCell>
                <TableCell align="right">{formatCurrency(data.otherRevenues || 0)}</TableCell>
                <TableCell align="right">
                  {totalRevenues ? 
                    ((data.otherRevenues || 0) / totalRevenues * 100).toFixed(1) + '%' : 
                    '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Total Revenues</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(totalRevenues)}</strong></TableCell>
                <TableCell align="right"><strong>100.0%</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Tips for Estimating Sale Price:
          </Typography>
          <Typography variant="body2">
            • Compare with similar properties that have recently sold in the area<br />
            • Consider the improvements you're making and their impact on value<br />
            • Factor in market trends and expected appreciation during your holding period<br />
            • Get an opinion from a real estate agent familiar with the area<br />
            • Be conservative in your estimate to build in a safety margin
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RevenuesForm;
