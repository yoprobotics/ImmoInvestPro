import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Politique de Confidentialité
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Typography paragraph sx={{ fontStyle: 'italic' }}>
          Date d'entrée en vigueur : {new Date().toLocaleDateString('fr-CA')}
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          1. Introduction
        </Typography>
        <Typography paragraph>
          Chez ImmoInvestPro, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre application.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          2. Informations que nous collectons
        </Typography>
        <Typography paragraph>
          <strong>Informations que vous nous fournissez :</strong> Lorsque vous créez un compte ou utilisez nos services, nous collectons des informations telles que votre nom, adresse email, et informations de paiement pour les utilisateurs premium.
        </Typography>
        <Typography paragraph>
          <strong>Données d'utilisation :</strong> Nous recueillons des informations sur la façon dont vous interagissez avec notre application, y compris les pages que vous visitez, les fonctionnalités que vous utilisez et les calculs que vous effectuez.
        </Typography>
        <Typography paragraph>
          <strong>Données immobilières :</strong> Les données que vous saisissez concernant vos analyses immobilières, telles que les prix d'achat, les revenus locatifs, et autres paramètres financiers.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          3. Comment nous utilisons vos informations
        </Typography>
        <Typography paragraph>
          Nous utilisons vos informations pour :
        </Typography>
        <ul>
          <li>
            <Typography paragraph>
              Fournir, maintenir et améliorer notre application
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Traiter vos transactions et gérer votre compte
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Vous envoyer des informations techniques, des mises à jour, des alertes de sécurité et des messages de support
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Personnaliser votre expérience utilisateur
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Analyser l'utilisation de notre application pour améliorer nos services
            </Typography>
          </li>
        </ul>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          4. Partage de vos informations
        </Typography>
        <Typography paragraph>
          Nous ne vendons pas vos informations personnelles à des tiers. Nous pouvons partager vos informations dans les circonstances suivantes :
        </Typography>
        <ul>
          <li>
            <Typography paragraph>
              Avec des fournisseurs de services qui nous aident à exploiter notre application
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Pour se conformer à la loi, aux règlements, aux procédures légales ou aux demandes gouvernementales
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Dans le cadre d'une fusion, acquisition ou vente d'actifs
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Avec votre consentement ou selon vos instructions
            </Typography>
          </li>
        </ul>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          5. Sécurité des données
        </Typography>
        <Typography paragraph>
          Nous prenons des mesures raisonnables pour protéger vos informations contre l'accès non autorisé, l'altération, la divulgation ou la destruction. Cependant, aucune méthode de transmission sur Internet ou méthode de stockage électronique n'est 100% sécurisée.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          6. Vos droits
        </Typography>
        <Typography paragraph>
          Selon votre lieu de résidence, vous pouvez avoir certains droits concernant vos données personnelles, notamment :
        </Typography>
        <ul>
          <li>
            <Typography paragraph>
              Le droit d'accéder à vos données personnelles
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Le droit de rectifier ou de mettre à jour vos données
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Le droit de supprimer vos données
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Le droit de restreindre ou de vous opposer au traitement de vos données
            </Typography>
          </li>
          <li>
            <Typography paragraph>
              Le droit à la portabilité des données
            </Typography>
          </li>
        </ul>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          7. Modifications de cette politique
        </Typography>
        <Typography paragraph>
          Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version la plus récente sera toujours disponible sur notre application avec la date d'entrée en vigueur.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          8. Nous contacter
        </Typography>
        <Typography paragraph>
          Si vous avez des questions ou des préoccupations concernant cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter à :
        </Typography>
        <Typography paragraph sx={{ fontWeight: 'bold' }}>
          contact@immoinvestpro.com
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" align="center">
            © {new Date().getFullYear()} ImmoInvestPro - Tous droits réservés
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;