import React from 'react';
import { 
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
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { formatCurrency, formatPercent } from '../../../../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
);

// Get color for scenarios
const getScenarioColor = (scenarioNumber, opacity = 1) => {
  const colors = {
    1: `rgba(54, 162, 235, ${opacity})`,    // Blue
    2: `rgba(75, 192, 192, ${opacity})`,    // Teal
    3: `rgba(255, 99, 132, ${opacity})`,    // Pink
  };
  return colors[scenarioNumber] || `rgba(201, 203, 207, ${opacity})`;
};

const getScenarioName = (scenarioNumber) => {
  const names = {
    1: "Base Scenario",
    2: "Optimistic Scenario",
    3: "Pessimistic Scenario"
  };
  return names[scenarioNumber] || `Scenario ${scenarioNumber}`;
};

const ScenarioChip = ({ scenarioNumber, isActive }) => (
  <Chip 
    label={getScenarioName(scenarioNumber)} 
    color={isActive ? "primary" : "default"}
    style={{ 
      backgroundColor: isActive ? getScenarioColor(scenarioNumber) : undefined,
      margin: '0 4px'
    }}
  />
);

const FlipComparison = ({ comparison, bestScenario }) => {
  // Prepare data for the bar chart
  const profitBarChartData = {
    labels: ['Net Profit', 'Total Investment', 'Cash Invested'],
    datasets: [
      {
        label: getScenarioName(1),
        data: [
          comparison.profitability.netProfit.scenario1,
          comparison.profitability.totalInvestment.scenario1,
          comparison.financing.downPayment.scenario1
        ],
        backgroundColor: getScenarioColor(1, 0.6),
        borderColor: getScenarioColor(1),
        borderWidth: 1
      },
      {
        label: getScenarioName(2),
        data: [
          comparison.profitability.netProfit.scenario2,
          comparison.profitability.totalInvestment.scenario2,
          comparison.financing.downPayment.scenario2
        ],
        backgroundColor: getScenarioColor(2, 0.6),
        borderColor: getScenarioColor(2),
        borderWidth: 1
      },
      {
        label: getScenarioName(3),
        data: [
          comparison.profitability.netProfit.scenario3,
          comparison.profitability.totalInvestment.scenario3,
          comparison.financing.downPayment.scenario3
        ],
        backgroundColor: getScenarioColor(3, 0.6),
        borderColor: getScenarioColor(3),
        borderWidth: 1
      }
    ]
  };

  // Prepare data for the radar chart
  const radarChartData = {
    labels: ['ROI', 'Annualized ROI', 'Net Profit', 'Holding Period', 'Total Investment'],
    datasets: [
      {
        label: getScenarioName(1),
        data: [
          // Normalize values to 0-100 range for radar chart
          Math.min(100, comparison.profitability.roi.scenario1 * 2),
          Math.min(100, comparison.profitability.annualizedRoi.scenario1),
          Math.min(100, (comparison.profitability.netProfit.scenario1 / 50000) * 100),
          Math.min(100, (6 / comparison.profitability.holdingPeriodMonths.scenario1) * 100),
          Math.min(100, (300000 / comparison.profitability.totalInvestment.scenario1) * 100)
        ],
        backgroundColor: getScenarioColor(1, 0.2),
        borderColor: getScenarioColor(1),
        pointBackgroundColor: getScenarioColor(1),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: getScenarioColor(1)
      },
      {
        label: getScenarioName(2),
        data: [
          Math.min(100, comparison.profitability.roi.scenario2 * 2),
          Math.min(100, comparison.profitability.annualizedRoi.scenario2),
          Math.min(100, (comparison.profitability.netProfit.scenario2 / 50000) * 100),
          Math.min(100, (6 / comparison.profitability.holdingPeriodMonths.scenario2) * 100),
          Math.min(100, (300000 / comparison.profitability.totalInvestment.scenario2) * 100)
        ],
        backgroundColor: getScenarioColor(2, 0.2),
        borderColor: getScenarioColor(2),
        pointBackgroundColor: getScenarioColor(2),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: getScenarioColor(2)
      },
      {
        label: getScenarioName(3),
        data: [
          Math.min(100, comparison.profitability.roi.scenario3 * 2),
          Math.min(100, comparison.profitability.annualizedRoi.scenario3),
          Math.min(100, (comparison.profitability.netProfit.scenario3 / 50000) * 100),
          Math.min(100, (6 / comparison.profitability.holdingPeriodMonths.scenario3) * 100),
          Math.min(100, (300000 / comparison.profitability.totalInvestment.scenario3) * 100)
        ],
        backgroundColor: getScenarioColor(3, 0.2),
        borderColor: getScenarioColor(3),
        pointBackgroundColor: getScenarioColor(3),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: getScenarioColor(3)
      }
    ]
  };
  
  return (
    <Paper style={{ padding: 24 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Scenario Comparison
        </Typography>
        <Box>
          <ScenarioChip scenarioNumber={1} isActive={bestScenario === 1} />
          <ScenarioChip scenarioNumber={2} isActive={bestScenario === 2} />
          <ScenarioChip scenarioNumber={3} isActive={bestScenario === 3} />
        </Box>
      </Box>
      
      <Box mb={3} p={2} bgcolor={getScenarioColor(bestScenario, 0.1)} borderRadius={1}>
        <Typography variant="subtitle1">
          <strong>Recommended Scenario: {getScenarioName(bestScenario)}</strong>
        </Typography>
        <Typography variant="body2">
          Based on a comprehensive analysis considering profitability, ROI, timeline, and investment required,
          {getScenarioName(bestScenario)} offers the best overall value for this project.
        </Typography>
      </Box>

      <Divider style={{ marginBottom: 20 }} />
      
      <Grid container spacing={4}>
        {/* Profitability Comparison */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Profitability Metrics
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Scenario 1</TableCell>
                  <TableCell align="right">Scenario 2</TableCell>
                  <TableCell align="right">Scenario 3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th">Net Profit</TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 1 ? getScenarioColor(1, 0.1) : undefined }}>
                    {formatCurrency(comparison.profitability.netProfit.scenario1)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 2 ? getScenarioColor(2, 0.1) : undefined }}>
                    {formatCurrency(comparison.profitability.netProfit.scenario2)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 3 ? getScenarioColor(3, 0.1) : undefined }}>
                    {formatCurrency(comparison.profitability.netProfit.scenario3)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">ROI</TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 1 ? getScenarioColor(1, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.roi.scenario1)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 2 ? getScenarioColor(2, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.roi.scenario2)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 3 ? getScenarioColor(3, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.roi.scenario3)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Annualized ROI</TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 1 ? getScenarioColor(1, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.annualizedRoi.scenario1)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 2 ? getScenarioColor(2, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.annualizedRoi.scenario2)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 3 ? getScenarioColor(3, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.annualizedRoi.scenario3)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Cash-on-Cash Return</TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 1 ? getScenarioColor(1, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.cashOnCash.scenario1)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 2 ? getScenarioColor(2, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.cashOnCash.scenario2)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: bestScenario === 3 ? getScenarioColor(3, 0.1) : undefined }}>
                    {formatPercent(comparison.profitability.cashOnCash.scenario3)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        {/* Costs Comparison */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Cost Breakdown
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Scenario 1</TableCell>
                  <TableCell align="right">Scenario 2</TableCell>
                  <TableCell align="right">Scenario 3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th">Acquisition Costs</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.acquisitionCosts.scenario1)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.acquisitionCosts.scenario2)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.acquisitionCosts.scenario3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Renovation Costs</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.renovationCosts.scenario1)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.renovationCosts.scenario2)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.renovationCosts.scenario3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Selling Costs</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.sellingCosts.scenario1)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.sellingCosts.scenario2)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.sellingCosts.scenario3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Holding Costs</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.holdingCosts.scenario1)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.holdingCosts.scenario2)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.costs.holdingCosts.scenario3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Interest Paid</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.financing.totalInterestPaid.scenario1)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.financing.totalInterestPaid.scenario2)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.financing.totalInterestPaid.scenario3)}</TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell component="th"><strong>Total Investment</strong></TableCell>
                  <TableCell align="right"><strong>{formatCurrency(comparison.profitability.totalInvestment.scenario1)}</strong></TableCell>
                  <TableCell align="right"><strong>{formatCurrency(comparison.profitability.totalInvestment.scenario2)}</strong></TableCell>
                  <TableCell align="right"><strong>{formatCurrency(comparison.profitability.totalInvestment.scenario3)}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Down Payment</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.financing.downPayment.scenario1)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.financing.downPayment.scenario2)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.financing.downPayment.scenario3)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        {/* Visualization Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Comparison
              </Typography>
              <Box height={300}>
                <Bar 
                  data={profitBarChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Financial Metrics by Scenario'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scenario Performance
              </Typography>
              <Box height={300}>
                <Radar 
                  data={radarChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        angleLines: {
                          display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Scenario Performance Comparison'
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Timeline Comparison */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Timeline & Revenue Comparison
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Scenario 1</TableCell>
                  <TableCell align="right">Scenario 2</TableCell>
                  <TableCell align="right">Scenario 3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th">Holding Period (months)</TableCell>
                  <TableCell align="right">{comparison.profitability.holdingPeriodMonths.scenario1}</TableCell>
                  <TableCell align="right">{comparison.profitability.holdingPeriodMonths.scenario2}</TableCell>
                  <TableCell align="right">{comparison.profitability.holdingPeriodMonths.scenario3}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Expected Sale Price</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.revenues.expectedSalePrice.scenario1)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.revenues.expectedSalePrice.scenario2)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.revenues.expectedSalePrice.scenario3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Total Revenues</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.revenues.totalRevenues.scenario1)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.revenues.totalRevenues.scenario2)}</TableCell>
                  <TableCell align="right">{formatCurrency(comparison.revenues.totalRevenues.scenario3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Monthly Profit Rate</TableCell>
                  <TableCell align="right">
                    {formatCurrency(comparison.profitability.netProfit.scenario1 / comparison.profitability.holdingPeriodMonths.scenario1)}
                    <Typography variant="caption" display="block">per month</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(comparison.profitability.netProfit.scenario2 / comparison.profitability.holdingPeriodMonths.scenario2)}
                    <Typography variant="caption" display="block">per month</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(comparison.profitability.netProfit.scenario3 / comparison.profitability.holdingPeriodMonths.scenario3)}
                    <Typography variant="caption" display="block">per month</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FlipComparison;
