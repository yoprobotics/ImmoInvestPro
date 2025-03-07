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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button
} from '@mui/material';
import { formatCurrency } from '../../../../utils/formatters';

const contingencyOptions = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 10, label: '10%' },
  { value: 15, label: '15%' },
  { value: 20, label: '20%' },
  { value: 25, label: '25%' }
];

const RenovationCostsForm = ({ data, updateForm }) => {
  const [subTotal, setSubTotal] = useState(0);
  const [contingencyPercentage, setContingencyPercentage] = useState(10);

  // Calculate subtotal (excluding contingency)
  useEffect(() => {
    const calculatedSubTotal = 
      Number(data.kitchen || 0) + 
      Number(data.bathroom || 0) + 
      Number(data.flooring || 0) + 
      Number(data.painting || 0) + 
      Number(data.windows || 0) + 
      Number(data.doors || 0) + 
      Number(data.roofing || 0) + 
      Number(data.electrical || 0) + 
      Number(data.plumbing || 0) + 
      Number(data.hvac || 0) + 
      Number(data.foundation || 0) + 
      Number(data.exterior || 0) + 
      Number(data.landscape || 0) + 
      Number(data.permits || 0) + 
      Number(data.laborCosts || 0) + 
      Number(data.materials || 0) +
      Number(data.otherRenovationCosts || 0);
    
    setSubTotal(calculatedSubTotal);
    
    // Update contingency amount based on percentage
    const contingencyAmount = calculatedSubTotal * (contingencyPercentage / 100);
    updateForm({ contingency: contingencyAmount });
    
  }, [
    data.kitchen,
    data.bathroom,
    data.flooring,
    data.painting,
    data.windows,
    data.doors,
    data.roofing,
    data.electrical,
    data.plumbing,
    data.hvac,
    data.foundation,
    data.exterior,
    data.landscape,
    data.permits,
    data.laborCosts,
    data.materials,
    data.otherRenovationCosts,
    contingencyPercentage
  ]);

  // Calculate total renovation costs
  useEffect(() => {
    const total = subTotal + Number(data.contingency || 0);
    updateForm({ totalRenovationCosts: total });
  }, [subTotal, data.contingency]);

  // Update contingency when percentage changes
  const handleContingencyChange = (event) => {
    const value = typeof event.target.value === 'string' 
      ? parseFloat(event.target.value) 
      : event.target.value;
    
    setContingencyPercentage(value);
    const contingencyAmount = subTotal * (value / 100);
    updateForm({ contingency: contingencyAmount });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    updateForm({ [name]: numValue });
  };

  // Apply a "500$ rule" template for quick estimation
  const apply500Rule = () => {
    // Predefined values based on the "500$ rule" from Secrets de l'immobilier
    updateForm({
      kitchen: 10000,        // Base cost for kitchen
      bathroom: 5000,        // Base cost for bathroom
      flooring: 5000,        // Approx $5/sqft for 1000 sqft
      painting: 2500,        // Approx $500 per gallon, 5 gallons
      windows: 3500,         // $500 per window, 7 windows
      doors: 2000,           // $500 per door, 4 doors
      exterior: 3000,        // Basic exterior improvements
      permits: 1000,         // Building permits
      contingency: subTotal * 0.1 // 10% of subtotal
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Renovation Costs
        </Typography>
        <Divider />
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={apply500Rule}
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          Apply "500$ Rule" Template
        </Button>
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
          Applies a quick estimation template based on the "500$ Rule" from Secrets de l'immobilier.
          You can adjust the values afterward.
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Kitchen"
          name="kitchen"
          type="number"
          value={data.kitchen || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Starts at $10,000"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Bathroom"
          name="bathroom"
          type="number"
          value={data.bathroom || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Starts at $5,000"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Flooring"
          name="flooring"
          type="number"
          value={data.flooring || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Approx. $5/sqft"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Painting"
          name="painting"
          type="number"
          value={data.painting || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="$500 per gallon"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Windows"
          name="windows"
          type="number"
          value={data.windows || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="$500 per standard window"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Doors"
          name="doors"
          type="number"
          value={data.doors || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="$500 per interior door"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Roofing"
          name="roofing"
          type="number"
          value={data.roofing || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Electrical"
          name="electrical"
          type="number"
          value={data.electrical || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Plumbing"
          name="plumbing"
          type="number"
          value={data.plumbing || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="HVAC"
          name="hvac"
          type="number"
          value={data.hvac || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Heating, Ventilation, Air Conditioning"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Foundation"
          name="foundation"
          type="number"
          value={data.foundation || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Exterior"
          name="exterior"
          type="number"
          value={data.exterior || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="Siding, trim, etc."
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Landscape"
          name="landscape"
          type="number"
          value={data.landscape || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Permits"
          name="permits"
          type="number"
          value={data.permits || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Labor Costs"
          name="laborCosts"
          type="number"
          value={data.laborCosts || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="If not included in individual categories"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Materials"
          name="materials"
          type="number"
          value={data.materials || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
          helperText="If not included in individual categories"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Other Renovation Costs"
          name="otherRenovationCosts"
          type="number"
          value={data.otherRenovationCosts || ''}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography gutterBottom>Contingency ({contingencyPercentage}%)</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={contingencyPercentage}
              onChange={(e, newValue) => setContingencyPercentage(newValue)}
              aria-labelledby="contingency-slider"
              step={5}
              marks
              min={0}
              max={25}
            />
          </Grid>
          <Grid item>
            <FormControl variant="outlined" style={{ minWidth: 80 }}>
              <Select
                value={contingencyPercentage}
                onChange={handleContingencyChange}
                label="Contingency"
              >
                {contingencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Contingency Amount"
              value={data.contingency || ''}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                readOnly: true
              }}
              helperText="Based on percentage of subtotal"
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant="h6" gutterBottom>
          Renovation Cost Summary
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
                <TableCell>Kitchen</TableCell>
                <TableCell align="right">{formatCurrency(data.kitchen || 0)}</TableCell>
                <TableCell align="right">
                  {subTotal ? ((data.kitchen || 0) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bathroom</TableCell>
                <TableCell align="right">{formatCurrency(data.bathroom || 0)}</TableCell>
                <TableCell align="right">
                  {subTotal ? ((data.bathroom || 0) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Flooring & Painting</TableCell>
                <TableCell align="right">{formatCurrency((data.flooring || 0) + (data.painting || 0))}</TableCell>
                <TableCell align="right">
                  {subTotal ? (((data.flooring || 0) + (data.painting || 0)) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Windows & Doors</TableCell>
                <TableCell align="right">{formatCurrency((data.windows || 0) + (data.doors || 0))}</TableCell>
                <TableCell align="right">
                  {subTotal ? (((data.windows || 0) + (data.doors || 0)) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Major Systems (Electrical, Plumbing, HVAC)</TableCell>
                <TableCell align="right">{formatCurrency((data.electrical || 0) + (data.plumbing || 0) + (data.hvac || 0))}</TableCell>
                <TableCell align="right">
                  {subTotal ? (((data.electrical || 0) + (data.plumbing || 0) + (data.hvac || 0)) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Structural (Roofing, Foundation)</TableCell>
                <TableCell align="right">{formatCurrency((data.roofing || 0) + (data.foundation || 0))}</TableCell>
                <TableCell align="right">
                  {subTotal ? (((data.roofing || 0) + (data.foundation || 0)) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Exterior & Landscape</TableCell>
                <TableCell align="right">{formatCurrency((data.exterior || 0) + (data.landscape || 0))}</TableCell>
                <TableCell align="right">
                  {subTotal ? (((data.exterior || 0) + (data.landscape || 0)) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Labor & Materials</TableCell>
                <TableCell align="right">{formatCurrency((data.laborCosts || 0) + (data.materials || 0))}</TableCell>
                <TableCell align="right">
                  {subTotal ? (((data.laborCosts || 0) + (data.materials || 0)) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Permits & Other</TableCell>
                <TableCell align="right">{formatCurrency((data.permits || 0) + (data.otherRenovationCosts || 0))}</TableCell>
                <TableCell align="right">
                  {subTotal ? (((data.permits || 0) + (data.otherRenovationCosts || 0)) / subTotal * 100).toFixed(1) + '%' : '0.0%'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell align="right">{formatCurrency(subTotal)}</TableCell>
                <TableCell align="right">100.0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contingency ({contingencyPercentage}%)</TableCell>
                <TableCell align="right">{formatCurrency(data.contingency || 0)}</TableCell>
                <TableCell align="right">
                  {contingencyPercentage}% of subtotal
                </TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Total Renovation Costs</strong></TableCell>
                <TableCell align="right"><strong>{formatCurrency(subTotal + (data.contingency || 0))}</strong></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default RenovationCostsForm;
