import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Divider, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { formatCurrency, formatPercent } from '../../../../utils/formatters';

// Helper function to determine color based on value
const getRoiColor = (roi) => {
  if (roi >= 30) return '#4caf50'; // Green
  if (roi >= 20) return '#8bc34a'; // Light Green
  if (roi >= 15) return '#cddc39'; // Lime
  if (roi >= 10) return '#ffeb3b'; // Yellow
  if (roi >= 5) return '#ffc107';  // Amber
  return '#f44336';               // Red
};

const FlipResults = ({ results, scenarioNumber }) => {
  const { profitabilityAnalysis, generalInfo, actions, revenues, acquisitionCosts, renovationCosts, sellingCosts, holdingCosts } = results;
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Scenario {scenarioNumber} Results: {generalInfo.address || 'FLIP Project'}
      </Typography>
      <Divider style={{ marginBottom: 20 }} />
      
      <Grid container spacing={3}>
        {/* Key Performance Indicators */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Key Performance Indicators
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Net Profit
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(profitabilityAnalysis.netProfit)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, (profitabilityAnalysis.netProfit / 50000) * 100)} 
                    style={{ marginTop: 10, height: 8, borderRadius: 4 }}
                    color={profitabilityAnalysis.netProfit >= 25000 ? "success" : "warning"}
                  />
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 5 }}>
                    Target: $25,000+
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    ROI
                  </Typography>
                  <Typography variant="h4" component="div" style={{ color: getRoiColor(profitabilityAnalysis.roi) }}>
                    {formatPercent(profitabilityAnalysis.roi)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, (profitabilityAnalysis.roi / 30) * 100)} 
                    style={{ 
                      marginTop: 10, 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0'
                    }}
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getRoiColor(profitabilityAnalysis.roi)
                      }
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 5 }}>
                    Target: 20%+
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Annualized ROI
                  </Typography>
                  <Typography variant="h4" component="div" style={{ color: getRoiColor(profitabilityAnalysis.annualizedRoi) }}>
                    {formatPercent(profitabilityAnalysis.annualizedRoi)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, (profitabilityAnalysis.annualizedRoi / 50) * 100)} 
                    style={{ 
                      marginTop: 10, 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0'
                    }}
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getRoiColor(profitabilityAnalysis.annualizedRoi)
                      }
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 5 }}>
                    Target: 30%+
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Holding Period
                  </Typography>
                  <Typography variant="h4" component="div">
                    {actions.holdingPeriodMonths} months
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, (12 / actions.holdingPeriodMonths) * 100)} 
                    style={{ marginTop: 10, height: 8, borderRadius: 4 }}
                    color={actions.holdingPeriodMonths <= 6 ? "success" : "warning"}
                  />
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 5 }}>
                    Target: 3-6 months
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Financial Summary */}
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Financial Summary
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th">Purchase Price</TableCell>
                    <TableCell align="right">{formatCurrency(acquisitionCosts.purchasePrice)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Acquisition Costs</TableCell>
                    <TableCell align="right">{formatCurrency(acquisitionCosts.totalAcquisitionCosts - acquisitionCosts.purchasePrice)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Renovation Costs</TableCell>
                    <TableCell align="right">{formatCurrency(renovationCosts.totalRenovationCosts)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Holding Costs</TableCell>
                    <TableCell align="right">{formatCurrency(profitabilityAnalysis.holdingCosts)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Selling Costs</TableCell>
                    <TableCell align="right">{formatCurrency(sellingCosts.totalSellingCosts)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Financing Costs</TableCell>
                    <TableCell align="right">{formatCurrency(profitabilityAnalysis.financingCosts)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Total Investment</TableCell>
                    <TableCell align="right">{formatCurrency(profitabilityAnalysis.totalInvestment)}</TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell component="th"><strong>Cash Invested</strong></TableCell>
                    <TableCell align="right"><strong>{formatCurrency(profitabilityAnalysis.totalCashInvested)}</strong></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Sale Price</TableCell>
                    <TableCell align="right">{formatCurrency(revenues.expectedSalePrice)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">Other Revenues</TableCell>
                    <TableCell align="right">{formatCurrency(revenues.rentalIncome + revenues.otherRevenues)}</TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: '#e8f5e9' }}>
                    <TableCell component="th"><strong>Net Profit</strong></TableCell>
                    <TableCell align="right" style={{ color: '#2e7d32' }}><strong>{formatCurrency(profitabilityAnalysis.netProfit)}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Profitability Analysis */}
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Profitability Analysis
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box border={1} borderColor="divider" borderRadius={1} p={2} mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Return on Investment (ROI)
                  </Typography>
                  <Typography variant="h5" style={{ color: getRoiColor(profitabilityAnalysis.roi) }}>
                    {formatPercent(profitabilityAnalysis.roi)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Net Profit ÷ Cash Invested
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box border={1} borderColor="divider" borderRadius={1} p={2} mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Annualized ROI
                  </Typography>
                  <Typography variant="h5" style={{ color: getRoiColor(profitabilityAnalysis.annualizedRoi) }}>
                    {formatPercent(profitabilityAnalysis.annualizedRoi)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ROI adjusted for time
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box border={1} borderColor="divider" borderRadius={1} p={2} mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Cash-on-Cash Return
                  </Typography>
                  <Typography variant="h5" style={{ color: getRoiColor(profitabilityAnalysis.cashOnCash) }}>
                    {formatPercent(profitabilityAnalysis.cashOnCash)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Annual Cash Flow ÷ Cash Invested
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box border={1} borderColor="divider" borderRadius={1} p={2} mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Profit Margin
                  </Typography>
                  <Typography variant="h5" style={{ color: getRoiColor((profitabilityAnalysis.netProfit / revenues.expectedSalePrice) * 100) }}>
                    {formatPercent((profitabilityAnalysis.netProfit / revenues.expectedSalePrice) * 100)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Net Profit ÷ Sale Price
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Cost Breakdown (% of Total)
            </Typography>
            
            <Box mt={2}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Typography variant="body2">Purchase Price</Typography>
                </Grid>
                <Grid item xs={4}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(acquisitionCosts.purchasePrice / profitabilityAnalysis.totalInvestment) * 100} 
                    style={{ height: 16, borderRadius: 4 }}
                  />
                </Grid>
                
                <Grid item xs={8}>
                  <Typography variant="body2">Acquisition Costs</Typography>
                </Grid>
                <Grid item xs={4}>
                  <LinearProgress 
                    variant="determinate" 
                    value={((acquisitionCosts.totalAcquisitionCosts - acquisitionCosts.purchasePrice) / profitabilityAnalysis.totalInvestment) * 100} 
                    style={{ height: 16, borderRadius: 4 }}
                    color="secondary"
                  />
                </Grid>
                
                <Grid item xs={8}>
                  <Typography variant="body2">Renovation Costs</Typography>
                </Grid>
                <Grid item xs={4}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(renovationCosts.totalRenovationCosts / profitabilityAnalysis.totalInvestment) * 100} 
                    style={{ height: 16, borderRadius: 4 }}
                    color="success"
                  />
                </Grid>
                
                <Grid item xs={8}>
                  <Typography variant="body2">Holding & Selling Costs</Typography>
                </Grid>
                <Grid item xs={4}>
                  <LinearProgress 
                    variant="determinate" 
                    value={((profitabilityAnalysis.holdingCosts + sellingCosts.totalSellingCosts) / profitabilityAnalysis.totalInvestment) * 100} 
                    style={{ height: 16, borderRadius: 4 }}
                    color="warning"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        {/* Project Details */}
        <Grid item xs={12}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Property Information
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th">Address</TableCell>
                        <TableCell>{generalInfo.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Property Type</TableCell>
                        <TableCell>{generalInfo.propertyType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Year Built</TableCell>
                        <TableCell>{generalInfo.yearBuilt}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Building Size</TableCell>
                        <TableCell>{generalInfo.buildingSize} sq ft</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Bedrooms/Bathrooms</TableCell>
                        <TableCell>{generalInfo.numberOfBedrooms} / {generalInfo.numberOfBathrooms}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Project Timeline
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th">FLIP Plan</TableCell>
                        <TableCell>{actions.flipPlan}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Acquisition Date</TableCell>
                        <TableCell>{new Date(actions.acquisitionDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Expected Sale Date</TableCell>
                        <TableCell>{new Date(actions.expectedSaleDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Holding Period</TableCell>
                        <TableCell>{actions.holdingPeriodMonths} months</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default FlipResults;
