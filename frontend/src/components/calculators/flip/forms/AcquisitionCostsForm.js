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
  InputAdornment
} from '@mui/material';
import { formatCurrency } from '../../../../utils/formatters';

const AcquisitionCostsForm = ({ data, updateForm }) => {
  const [totalAcquisitionCosts, setTotalAcquisitionCosts] = useState(0);

  // Calculate transfer tax automatically based on purchase price
  // This is a simplified calculation and may vary by jurisdiction
  const calculateTransferTax = (purchasePrice) => {
    if (!purchasePrice) return 0;
    
    // Example calculation (Quebec-style welcome tax):
    let tax = 0;
    const price = Number(purchasePrice);
    
    if (price <= 50000) {
      tax = price * 0.005;
    } else if (price <= 250000) {
      tax = 50000 * 0.005 + (price - 50000) * 0.01;
    } else {
      tax = 50000 * 0.005 + 200000 * 0.01 + (price - 250000) * 0.015;
    }
    
    return Math.round(tax * 100) / 100;
  };

  // Update transfer tax when purchase price changes
  useEffect(() => {
    if (data.purchasePrice) {
      const transferTax = calculateTransferTax(data.purchasePrice);
      updateForm({ transferTax });
    }
  }, [data.purchasePrice]);

  // Calculate total acquisition costs
  useEffect(() => {
    const total = 
      Number(data.purchasePrice || 0) + 
      Number(data.transferTax || 0) + 
      Number(data.legalFees || 0) + 
      Number(data.inspectionFees || 0) + 
      Number(data.appraisalFees || 0) + 
      Number(data.mortgageInsurance || 0) + 
      Number(data.mortgageSetupFees || 0) + 
      Number(data.otherAcquisitionFees || 0);
    
    setTotalAcquisitionCosts(total);
    updateForm({ totalAcquisitionCosts: total });
  }, [
    data.purchasePrice,
    data.transferTax,
    data.legalFees,
    data.inspectionFees,
    data.appraisalFees,
    data.mortgageInsurance,
    data.mortgageSetupFees,
    data.otherAcquisitionFees
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
          Acquisition Costs
        </Typography>
        <Divider />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Purchase Price"
          name="purchasePrice"
          type="number"
          value={data.purchasePrice || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Transfer Tax (Welcome Tax)"
          name="transferTax"
          type="number"
          value={data.transferTax || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Automatically calculated based on purchase price, but you can adjust"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Legal Fees"
          name="legalFees"
          type="number"
          value={data.legalFees || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Notary or lawyer fees"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Inspection Fees"
          name="inspectionFees"
          type="number"
          value={data.inspectionFees || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Appraisal Fees"
          name="appraisalFees"
          type="number"
          value={data.appraisalFees || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Mortgage Insurance"
          name="mortgageInsurance"
          type="number"
          value={data.mortgageInsurance || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="CMHC or other mortgage insurance"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Mortgage Setup Fees"
          name="mortgageSetupFees"
          type="number"
          value={data.mortgageSetupFees || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Other Acquisition Fees"
          name="otherAcquisitionFees"
          type="number"
          value={data.otherAcquisitionFees || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Any other fees not covered above"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant="h6" gutterBottom>
          Acquisition Cost Summary
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">% of Purchase Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Purchase Price</TableCell>
                <TableCell align="right">{formatCurrency(data.purchasePrice || 0)}</TableCell>
                <TableCell align="right">100.00%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Transfer Tax</TableCell>
                <TableCell align="right">{formatCurrency(data.transferTax || 0)}</TableCell>
                <TableCell align="right">
                  {data.purchasePrice ? 
                    ((data.transferTax || 0) / data.purchasePrice * 100).toFixed(2) + '%' : 
                    '0.00%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Legal Fees</TableCell>
                <TableCell align="right">{formatCurrency(data.legalFees || 0)}</TableCell>
                <TableCell align="right">
                  {data.purchasePrice ? 
                    ((data.legalFees || 0) / data.purchasePrice * 100).toFixed(2) + '%' : 
                    '0.00%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Inspection & Appraisal</TableCell>
                <TableCell align="right">{formatCurrency((data.inspectionFees || 0) + (data.appraisalFees || 0))}</TableCell>
                <TableCell align="right">
                  {data.purchasePrice ? 
                    (((data.inspectionFees || 0) + (data.appraisalFees || 0)) / data.purchasePrice * 100).toFixed(2) + '%' : 
                    '0.00%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mortgage Related</TableCell>
                <TableCell align="right">{formatCurrency((data.mortgageInsurance || 0) + (data.mortgageSetupFees || 0))}</TableCell>
                <TableCell align="right">
                  {data.purchasePrice ? 
                    (((data.mortgageInsurance || 0) + (data.mortgageSetupFees || 0)) / data.purchasePrice * 100).toFixed(2) + '%' : 
                    '0.00%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Fees</TableCell>
                <TableCell align="right">{formatCurrency(data.otherAcquisitionFees || 0)}</TableCell>
                <TableCell align="right">
                  {data.purchasePrice ? 
                    ((data.otherAcquisitionFees || 0) / data.purchasePrice * 100).toFixed(2) + '%' : 
                    '0.00%'}
                </TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Total Acquisition Costs</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(totalAcquisitionCosts)}</strong></TableCell>
                <TableCell align="right">
                  <strong>
                    {data.purchasePrice ? 
                      ((totalAcquisitionCosts - (data.purchasePrice || 0)) / data.purchasePrice * 100).toFixed(2) + '% (above purchase price)' : 
                      '0.00%'}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default AcquisitionCostsForm;
