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
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import { formatCurrency } from '../../../../utils/formatters';

const HoldingCostsForm = ({ data, updateForm }) => {
  const [totalMonthlyHoldingCosts, setTotalMonthlyHoldingCosts] = useState(0);
  const [totalMonthlyMaintenanceCosts, setTotalMonthlyMaintenanceCosts] = useState(0);
  const [holdingPeriod, setHoldingPeriod] = useState(6); // Default 6 months
  const [taxBasis, setTaxBasis] = useState('annual'); // 'annual' or 'monthly'

  // Try to get the holding period from the form
  useEffect(() => {
    const holdingPeriodField = document.querySelector('input[name="holdingPeriodMonths"]');
    if (holdingPeriodField) {
      setHoldingPeriod(Number(holdingPeriodField.value || 6));
    }
  }, []);

  // Calculate total monthly holding costs
  useEffect(() => {
    // Convert annual taxes to monthly if needed
    const monthlyPropertyTax = taxBasis === 'annual' 
      ? (data.propertyTaxes || 0) / 12 
      : (data.propertyTaxes || 0);
    
    const monthlyInsurance = taxBasis === 'annual' 
      ? (data.insurance || 0) / 12 
      : (data.insurance || 0);
    
    const monthlyTotal = 
      monthlyPropertyTax + 
      monthlyInsurance + 
      Number(data.utilities || 0) + 
      Number(data.maintenance || 0) + 
      Number(data.otherHoldingCosts || 0);
    
    setTotalMonthlyHoldingCosts(monthlyTotal);
    
    // Update total holding costs for the entire holding period
    updateForm({ 
      totalHoldingCosts: monthlyTotal * holdingPeriod 
    });
  }, [
    data.propertyTaxes,
    data.insurance,
    data.utilities,
    data.maintenance,
    data.otherHoldingCosts,
    taxBasis,
    holdingPeriod
  ]);

  // Calculate total monthly maintenance costs
  useEffect(() => {
    const monthlyTotal = 
      Number(data.repairs || 0) + 
      Number(data.cleaning || 0) + 
      Number(data.landscaping || 0) + 
      Number(data.snowRemoval || 0) + 
      Number(data.otherMaintenanceCosts || 0);
    
    setTotalMonthlyMaintenanceCosts(monthlyTotal);
    
    // Update total maintenance costs for the entire holding period
    updateForm({ 
      totalMaintenanceCosts: monthlyTotal * holdingPeriod 
    });
  }, [
    data.repairs,
    data.cleaning,
    data.landscaping,
    data.snowRemoval,
    data.otherMaintenanceCosts,
    holdingPeriod
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    updateForm({ [name]: numValue });
  };

  const handleTaxBasisChange = (e) => {
    setTaxBasis(e.target.value);
    
    // Convert existing values when changing basis
    if (e.target.value === 'monthly' && taxBasis === 'annual') {
      // Convert annual to monthly
      updateForm({
        propertyTaxes: (data.propertyTaxes || 0) / 12,
        insurance: (data.insurance || 0) / 12
      });
    } else if (e.target.value === 'annual' && taxBasis === 'monthly') {
      // Convert monthly to annual
      updateForm({
        propertyTaxes: (data.propertyTaxes || 0) * 12,
        insurance: (data.insurance || 0) * 12
      });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Holding Costs
        </Typography>
        <Divider />
      </Grid>

      <Grid item xs={12} md={6}>
        <Alert severity="info" style={{ marginBottom: 16 }}>
          <Typography variant="body2">
            Holding period from project settings: <strong>{holdingPeriod} months</strong>
          </Typography>
        </Alert>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="tax-basis-label">Tax & Insurance Basis</InputLabel>
          <Select
            labelId="tax-basis-label"
            value={taxBasis}
            onChange={handleTaxBasisChange}
            label="Tax & Insurance Basis"
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="annual">Annual</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Operating Costs
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Property Taxes (${taxBasis})`}
          name="propertyTaxes"
          type="number"
          value={data.propertyTaxes || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText={taxBasis === 'annual' ? "Annual property taxes" : "Monthly property taxes"}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Insurance (${taxBasis})`}
          name="insurance"
          type="number"
          value={data.insurance || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText={taxBasis === 'annual' ? "Annual insurance premium" : "Monthly insurance premium"}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Utilities (monthly)"
          name="utilities"
          type="number"
          value={data.utilities || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Electricity, water, gas, etc."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Maintenance (monthly)"
          name="maintenance"
          type="number"
          value={data.maintenance || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="General maintenance costs"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Other Holding Costs (monthly)"
          name="otherHoldingCosts"
          type="number"
          value={data.otherHoldingCosts || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="HOA fees, security, etc."
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom style={{ marginTop: 16 }}>
          Maintenance Costs
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Repairs (monthly)"
          name="repairs"
          type="number"
          value={data.repairs || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Monthly average for minor repairs"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Cleaning (monthly)"
          name="cleaning"
          type="number"
          value={data.cleaning || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Regular cleaning costs"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Landscaping (monthly)"
          name="landscaping"
          type="number"
          value={data.landscaping || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Lawn care, gardening, etc."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Snow Removal (monthly)"
          name="snowRemoval"
          type="number"
          value={data.snowRemoval || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Snow removal services (seasonal average)"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Other Maintenance Costs (monthly)"
          name="otherMaintenanceCosts"
          type="number"
          value={data.otherMaintenanceCosts || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Any other maintenance related costs"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant="h6" gutterBottom>
          Holding Cost Summary
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Monthly</TableCell>
                <TableCell align="right">Total ({holdingPeriod} months)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Property Taxes</TableCell>
                <TableCell align="right">
                  {formatCurrency(taxBasis === 'annual' ? (data.propertyTaxes || 0) / 12 : (data.propertyTaxes || 0))}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency((taxBasis === 'annual' ? (data.propertyTaxes || 0) / 12 : (data.propertyTaxes || 0)) * holdingPeriod)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Insurance</TableCell>
                <TableCell align="right">
                  {formatCurrency(taxBasis === 'annual' ? (data.insurance || 0) / 12 : (data.insurance || 0))}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency((taxBasis === 'annual' ? (data.insurance || 0) / 12 : (data.insurance || 0)) * holdingPeriod)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Utilities</TableCell>
                <TableCell align="right">{formatCurrency(data.utilities || 0)}</TableCell>
                <TableCell align="right">{formatCurrency((data.utilities || 0) * holdingPeriod)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Maintenance</TableCell>
                <TableCell align="right">{formatCurrency(data.maintenance || 0)}</TableCell>
                <TableCell align="right">{formatCurrency((data.maintenance || 0) * holdingPeriod)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Holding Costs</TableCell>
                <TableCell align="right">{formatCurrency(data.otherHoldingCosts || 0)}</TableCell>
                <TableCell align="right">{formatCurrency((data.otherHoldingCosts || 0) * holdingPeriod)}</TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Subtotal: Operating Costs</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(totalMonthlyHoldingCosts)}</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(totalMonthlyHoldingCosts * holdingPeriod)}</strong></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Repairs</TableCell>
                <TableCell align="right">{formatCurrency(data.repairs || 0)}</TableCell>
                <TableCell align="right">{formatCurrency((data.repairs || 0) * holdingPeriod)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cleaning</TableCell>
                <TableCell align="right">{formatCurrency(data.cleaning || 0)}</TableCell>
                <TableCell align="right">{formatCurrency((data.cleaning || 0) * holdingPeriod)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Landscaping</TableCell>
                <TableCell align="right">{formatCurrency(data.landscaping || 0)}</TableCell>
                <TableCell align="right">{formatCurrency((data.landscaping || 0) * holdingPeriod)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Snow Removal</TableCell>
                <TableCell align="right">{formatCurrency(data.snowRemoval || 0)}</TableCell>
                <TableCell align="right">{formatCurrency((data.snowRemoval || 0) * holdingPeriod)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Maintenance Costs</TableCell>
                <TableCell align="right">{formatCurrency(data.otherMaintenanceCosts || 0)}</TableCell>
                <TableCell align="right">{formatCurrency((data.otherMaintenanceCosts || 0) * holdingPeriod)}</TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Subtotal: Maintenance Costs</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(totalMonthlyMaintenanceCosts)}</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(totalMonthlyMaintenanceCosts * holdingPeriod)}</strong></TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: '#e8f5e9' }}>
                <TableCell><strong>Total Holding Costs</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(totalMonthlyHoldingCosts + totalMonthlyMaintenanceCosts)}</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency((totalMonthlyHoldingCosts + totalMonthlyMaintenanceCosts) * holdingPeriod)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Tips for Estimating Holding Costs:
          </Typography>
          <Typography variant="body2">
            • Check property tax records for the most accurate tax information<br />
            • Get insurance quotes specific to vacant/renovation properties<br />
            • Contact utility companies for estimates based on similar properties<br />
            • Factor in seasonal costs (higher heating in winter, cooling in summer)<br />
            • Always budget extra for unexpected repairs and maintenance
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HoldingCostsForm;
