import React from 'react';
import { 
  Paper, Typography, Box, Divider,
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { formatNumberWithSpaces } from '../../../utils/formatters';

/**
 * Composant affichant le graphique d'amortissement du prêt
 * @param {Object} results - Résultats du calcul
 */
const AmortizationChart = ({ results }) => {
  if (!results || !results.details || !results.details.amortizationFirstYear) return null;
  
  const { details } = results;
  const { amortizationFirstYear, financing } = details;
  
  // Préparation des données pour le graphique d'amortissement
  const chartData = amortizationFirstYear.firstYear.months.map((month) => {
    return {
      name: `Mois ${month.month}`,
      intérêts: parseFloat(month.firstMortgage.interestPayment.toFixed(2)),
      capital: parseFloat(month.firstMortgage.principalPayment.toFixed(2)),
      balance: parseFloat(month.firstMortgage.balance.toFixed(2))
    };
  });
  
  // Calcul des totaux pour la première année
  const totalFirstYearInterest = amortizationFirstYear.firstYear.totalInterest;
  const totalFirstYearPrincipal = amortizationFirstYear.firstYear.totalPrincipal;
  const totalFirstYearPayment = totalFirstYearInterest + totalFirstYearPrincipal;
  
  // Préparation des données pour le ratio capital/intérêts
  const ratioData = [
    {
      name: 'Intérêts',
      value: totalFirstYearInterest,
      color: '#FF9800'
    },
    {
      name: 'Capital',
      value: totalFirstYearPrincipal,
      color: '#2196F3'
    }
  ];
  
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Amortissement du prêt
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Décomposition des paiements pour la première année
      </Typography>
      
      {/* Graphique de décomposition des paiements mensuels */}
      <Box sx={{ height: 300, mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${formatNumberWithSpaces(value)} $`} />
            <Legend />
            <Bar dataKey="intérêts" stackId="a" fill="#FF9800" name="Intérêts" />
            <Bar dataKey="capital" stackId="a" fill="#2196F3" name="Capital" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Résumé de l'amortissement */}
      <Typography variant="subtitle2" gutterBottom>
        Résumé des paiements (1ère année)
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="right">Montant</TableCell>
              <TableCell align="right">Pourcentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Intérêts</TableCell>
              <TableCell align="right">
                {formatNumberWithSpaces(totalFirstYearInterest)} $
              </TableCell>
              <TableCell align="right">
                {((totalFirstYearInterest / totalFirstYearPayment) * 100).toFixed(1)} %
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Capital</TableCell>
              <TableCell align="right">
                {formatNumberWithSpaces(totalFirstYearPrincipal)} $
              </TableCell>
              <TableCell align="right">
                {((totalFirstYearPrincipal / totalFirstYearPayment) * 100).toFixed(1)} %
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatNumberWithSpaces(totalFirstYearPayment)} $
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                100 %
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Informations sur le prêt */}
      <Typography variant="subtitle2" gutterBottom>
        Détails du prêt hypothécaire principal
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Montant initial</TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces(financing.firstMortgageAmount)} $
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Taux d'intérêt</TableCell>
                <TableCell align="right">
                  {/* Déduction du taux à partir du paiement et du montant */}
                  {(((financing.firstMortgageMonthlyInterest * 12) / financing.firstMortgageAmount) * 100).toFixed(2)} %
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Paiement mensuel</TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces(financing.firstMortgageMonthlyPayment)} $
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Balance après 1 an</TableCell>
                <TableCell align="right">
                  {amortizationFirstYear.firstYear.endingBalance && 
                   formatNumberWithSpaces(amortizationFirstYear.firstYear.endingBalance.firstMortgage)} $
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Capital remboursé (1ère année)</TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces(totalFirstYearPrincipal)} $
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Calcul du rendement par capitalisation */}
      <Typography variant="subtitle2" gutterBottom>
        Rendement par capitalisation (1ère année)
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Capital remboursé</TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces(totalFirstYearPrincipal)} $
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mise de fonds initiale</TableCell>
                <TableCell align="right">
                  {formatNumberWithSpaces(financing.totalDownPayment)} $
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Rendement par capitalisation</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {financing.totalDownPayment > 0 ? 
                   ((totalFirstYearPrincipal / financing.totalDownPayment) * 100).toFixed(2) : 
                   "N/A"} %
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default AmortizationChart;