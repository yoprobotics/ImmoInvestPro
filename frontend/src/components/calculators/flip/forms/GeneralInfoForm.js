import React from 'react';
import { 
  Grid, 
  TextField, 
  Typography, 
  MenuItem, 
  Divider,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

const propertyTypes = [
  'Residential',
  'Condo',
  'Duplex',
  'Triplex',
  'Multiplex',
  'Commercial',
  'Mixed-use',
  'Land'
];

const GeneralInfoForm = ({ data, updateForm, actionsData, updateActions }) => {
  // Calculate holding period when dates change
  const calculateHoldingPeriod = (acquisition, sale) => {
    if (!acquisition || !sale) return;
    
    const acquisitionDate = new Date(acquisition);
    const saleDate = new Date(sale);
    
    if (isNaN(acquisitionDate) || isNaN(saleDate)) return;
    
    // Calculate the difference in months
    const diffMonths = (saleDate.getFullYear() - acquisitionDate.getFullYear()) * 12 + 
                      (saleDate.getMonth() - acquisitionDate.getMonth());
    
    updateActions({ holdingPeriodMonths: Math.max(1, diffMonths) });
  };

  const handleDateChange = (field, value) => {
    if (field === 'acquisitionDate') {
      updateActions({ acquisitionDate: value });
      calculateHoldingPeriod(value, actionsData.expectedSaleDate);
    } else if (field === 'expectedSaleDate') {
      updateActions({ expectedSaleDate: value });
      calculateHoldingPeriod(actionsData.acquisitionDate, value);
    }
  };

  const handleActionChange = (e) => {
    updateActions({ [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);
    updateForm({ [name]: numValue });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Project Information
        </Typography>
        <Divider />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="FLIP Plan"
          name="flipPlan"
          value={actionsData.flipPlan}
          onChange={handleActionChange}
          variant="outlined"
          helperText="E.g. Full renovation, Cosmetic update, etc."
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Holding Period (months)"
          name="holdingPeriodMonths"
          type="number"
          value={actionsData.holdingPeriodMonths}
          onChange={(e) => updateActions({ holdingPeriodMonths: Number(e.target.value) })}
          variant="outlined"
          InputProps={{ inputProps: { min: 1 } }}
          helperText="Duration from purchase to sale"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Acquisition Date"
          name="acquisitionDate"
          type="date"
          value={actionsData.acquisitionDate}
          onChange={(e) => handleDateChange('acquisitionDate', e.target.value)}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Expected Sale Date"
          name="expectedSaleDate"
          type="date"
          value={actionsData.expectedSaleDate}
          onChange={(e) => handleDateChange('expectedSaleDate', e.target.value)}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Property Information
        </Typography>
        <Divider />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={data.address}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={data.city}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Province/State"
          name="province"
          value={data.province}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Postal Code"
          name="postalCode"
          value={data.postalCode}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="property-type-label">Property Type</InputLabel>
          <Select
            labelId="property-type-label"
            label="Property Type"
            name="propertyType"
            value={data.propertyType}
            onChange={handleChange}
          >
            {propertyTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Year Built"
          name="yearBuilt"
          type="number"
          value={data.yearBuilt}
          onChange={handleNumberChange}
          variant="outlined"
          InputProps={{ inputProps: { min: 1800, max: new Date().getFullYear() } }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Lot Size (sq ft)"
          name="lotSize"
          type="number"
          value={data.lotSize}
          onChange={handleNumberChange}
          variant="outlined"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Building Size (sq ft)"
          name="buildingSize"
          type="number"
          value={data.buildingSize}
          onChange={handleNumberChange}
          variant="outlined"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Number of Bedrooms"
          name="numberOfBedrooms"
          type="number"
          value={data.numberOfBedrooms}
          onChange={handleNumberChange}
          variant="outlined"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Number of Bathrooms"
          name="numberOfBathrooms"
          type="number"
          value={data.numberOfBathrooms}
          onChange={handleNumberChange}
          variant="outlined"
          InputProps={{ inputProps: { min: 0, step: 0.5 } }}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Parking Spaces"
          name="parkingSpaces"
          type="number"
          value={data.parkingSpaces}
          onChange={handleNumberChange}
          variant="outlined"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={data.description}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={4}
        />
      </Grid>
    </Grid>
  );
};

export default GeneralInfoForm;
