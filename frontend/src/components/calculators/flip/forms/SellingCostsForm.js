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
  Slider
} from '@mui/material';
import { formatCurrency } from '../../../../utils/formatters';

const SellingCostsForm = ({ data, updateForm }) => {
  const [totalSellingCosts, setTotalSellingCosts] = useState(0);
  const [commissionRate, setCommissionRate] = useState(5); // Default 5%

  // Calculate real estate commission when rate changes
  useEffect(() => {
    if (data.realEstateCommission !== undefined) {
      const expectedSalePrice = 
        document.querySelector('input[name="expectedSalePrice"]')?.value || 0;
      
      // If we can get the sale price, calculate commission based on that
      if (expectedSalePrice) {
        const commission = Number(expectedSalePrice) * (commissionRate / 100);
        updateForm({ realEstateCommission: commission });
      }
    }
  }, [commissionRate]);

  // Calculate total selling costs
  useEffect(() => {
    const total = 
      Number(data.realEstateCommission || 0) + 
      Number(data.legalFeesForSale || 0) + 
      Number(data.marketingCosts || 0) + 
      Number(data.stagingCosts || 0) + 
      Number(data.prepaymentPenalty || 0) + 
      Number(data.otherSellingCosts || 0);
    
    setTotalSellingCosts(total);
    updateForm({ totalSellingCosts: total });
  }, [
    data.realEstateCommission,
    data.legalFeesForSale,
    data.marketingCosts,
    data.stagingCosts,
    data.prepaymentPenalty,
    data.otherSellingCosts
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    updateForm({ [name]: numValue });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Selling Costs
        </Typography>
        <Divider />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography gutterBottom>Real Estate Commission Rate: {commissionRate}%</Typography>
        <Slider
          value={commissionRate}
          onChange={(e, newValue) => setCommissionRate(newValue)}
          aria-labelledby="commission-rate-slider"
          step={0.5}
          marks={[
            { value: 0, label: '0%' },
            { value: 2.5, label: '2.5%' },
            { value: 5, label: '5%' },
            { value: 7, label: '7%' }
          ]}
          min={0}
          max={7}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Real Estate Commission"
          name="realEstateCommission"
          type="number"
          value={data.realEstateCommission || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText={`Based on ${commissionRate}% of expected sale price`}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Legal Fees for Sale"
          name="legalFeesForSale"
          type="number"
          value={data.legalFeesForSale || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Notary or lawyer fees for the sale"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Marketing Costs"
          name="marketingCosts"
          type="number"
          value={data.marketingCosts || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Photography, virtual tours, advertising, etc."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Staging Costs"
          name="stagingCosts"
          type="number"
          value={data.stagingCosts || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Home staging, furniture rental, etc."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Prepayment Penalty"
          name="prepaymentPenalty"
          type="number"
          value={data.prepaymentPenalty || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Any mortgage prepayment penalties"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Other Selling Costs"
          name="otherSellingCosts"
          type="number"
          value={data.otherSellingCosts || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Any other fees related to selling"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant="h6" gutterBottom>
          Selling Cost Summary
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">% of Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Real Estate Commission</TableCell>
                <TableCell align="right">{formatCurrency(data.realEstateCommission || 0)}</TableCell>
                <TableCell align="right">
                  {totalSellingCosts ? 
                    ((data.realEstateCommission || 0) / totalSellingCosts * 100).toFixed(1) + '%' : 
                    '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Legal Fees</TableCell>
                <TableCell align="right">{formatCurrency(data.legalFeesForSale || 0)}</TableCell>
                <TableCell align="right">
                  {totalSellingCosts ? 
                    ((data.legalFeesForSale || 0) / totalSellingCosts * 100).toFixed(1) + '%' : 
                    '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Marketing & Staging</TableCell>
                <TableCell align="right">{formatCurrency((data.marketingCosts || 0) + (data.stagingCosts || 0))}</TableCell>
                <TableCell align="right">
                  {totalSellingCosts ? 
                    (((data.marketingCosts || 0) + (data.stagingCosts || 0)) / totalSellingCosts * 100).toFixed(1) + '%' : 
                    '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Prepayment Penalty</TableCell>
                <TableCell align="right">{formatCurrency(data.prepaymentPenalty || 0)}</TableCell>
                <TableCell align="right">
                  {totalSellingCosts ? 
                    ((data.prepaymentPenalty || 0) / totalSellingCosts * 100).toFixed(1) + '%' : 
                    '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Selling Costs</TableCell>
                <TableCell align="right">{formatCurrency(data.otherSellingCosts || 0)}</TableCell>
                <TableCell align="right">
                  {totalSellingCosts ? 
                    ((data.otherSellingCosts || 0) / totalSellingCosts * 100).toFixed(1) + '%' : 
                    '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Total Selling Costs</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(totalSellingCosts)}</strong></TableCell>
                <TableCell align="right"><strong>100.0%</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default SellingCostsForm;
