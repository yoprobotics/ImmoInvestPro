import React from 'react';
import { 
  Paper, Typography, Box, Divider, Grid,
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Line,
  ComposedChart
} from 'recharts';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant le graphique d'amortissement du prêt
 * @param {Object} results - Résultats du calcul
 */
const AmortizationChart = ({ results }) => {
  if (!results) return null;
  
  const { details } = results;
  
  // S'il n'y a pas de données d'amortissement, on affiche un message
  if (!details.amortizationFirstYear || !details.amortizationFirstYear.months) {
    return (
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Amortissement du prêt
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aucune donnée d'amortissement disponible pour ce financement.
        </Typography>
      </Paper>
    );
  }
  
  // Extraire les données d'amortissement
  const amortizationData = details.amortizationFirstYear.months;
  
  // Préparer les données pour le graphique
  const chartData = amortizationData.map(monthData => {
    return {
      month: monthData.month,
      intérêt: monthData.firstMortgage.interestPayment,
      capital: monthData.firstMortgage.principalPayment,
      balance: monthData.firstMortgage.balance
    };
  });
  
  // Calcul des totaux pour la première année
  const totalInterest = details.amortizationFirstYear.totalInterest || 0;
  const totalPrincipal = details.amortizationFirstYear.totalPrincipal || 0;
  const endingBalance = details.amortizationFirstYear.endingBalance?.firstMortgage || 0;
  
  // Calcul du ratio intérêt vs capital
  const interestRatio = totalInterest / (totalInterest + totalPrincipal) * 100;
  const principalRatio = totalPrincipal / (totalInterest + totalPrincipal) * 100;
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Amortissement du prêt
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Décomposition des paiements hypothécaires pour la première année
      </Typography>
      
      {/* Graphique des paiements mensuels */}
      <Box sx={{ height: 300, mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Mois', position: 'insideBottom', offset: -5 }} />
            <YAxis 
              yAxisId="left" 
              label={{ value: 'Montant ($)', angle: -90, position: 'insideLeft' }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              label={{ value: 'Balance ($)', angle: 90, position: 'insideRight' }} 
              domain={['auto', 'auto']}
            />
            <Tooltip 
              formatter={(value, name) => [formatNumberWithSpaces(value.toFixed(2)) + ' $', name]}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="intérêt" 
              stackId="a" 
              fill="#FF8042" 
              name="Intérêt"
            />
            <Bar 
              yAxisId="left" 
              dataKey="capital" 
              stackId="a" 
              fill="#82CA9D" 
              name="Capital"
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="balance" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }}
              name="Balance"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Résumé de l'amortissement */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Résumé de la première année
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Intérêts payés</TableCell>
                  <TableCell align="right">{formatNumberWithSpaces(totalInterest.toFixed(2))} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Capital remboursé</TableCell>
                  <TableCell align="right">{formatNumberWithSpaces(totalPrincipal.toFixed(2))} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total payé</TableCell>
                  <TableCell align="right">{formatNumberWithSpaces((totalInterest + totalPrincipal).toFixed(2))} $</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Balance restante</TableCell>
                  <TableCell align="right">{formatNumberWithSpaces(endingBalance.toFixed(2))} $</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Répartition intérêt vs capital (1ère année)
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { name: 'Intérêt', value: interestRatio, amount: totalInterest },
                  { name: 'Capital', value: principalRatio, amount: totalPrincipal }
                ]}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis dataKey="name" type="category" />
                <Tooltip 
                  formatter={(value, name, props) => {
                    if (name === 'value') {
                      return [`${value.toFixed(1)}%`, 'Pourcentage'];
                    }
                    return [props.payload.amount.toFixed(2) + ' $', 'Montant'];
                  }}
                />
                <Bar dataKey="value" fill="#8884d8" name="Pourcentage" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
      
      {/* Tableau détaillé des paiements mensuels (optionnel) */}
      <Typography variant="subtitle2" gutterBottom>
        Détail des paiements mensuels
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Mois</TableCell>
              <TableCell align="right">Paiement</TableCell>
              <TableCell align="right">Intérêt</TableCell>
              <TableCell align="right">Capital</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {amortizationData.map((month) => (
              <TableRow key={month.month}>
                <TableCell>{month.month}</TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces((month.firstMortgage.interestPayment + month.firstMortgage.principalPayment).toFixed(2))} $
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces(month.firstMortgage.interestPayment.toFixed(2))} $
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces(month.firstMortgage.principalPayment.toFixed(2))} $
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces(month.firstMortgage.balance.toFixed(2))} $
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AmortizationChart;