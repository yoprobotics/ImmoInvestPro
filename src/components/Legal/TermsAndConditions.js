import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Conditions Générales d'Utilisation
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          1. Acceptation des Conditions
        </Typography>
        <Typography paragraph>
          En accédant et en utilisant ImmoInvestPro, vous acceptez d'être lié par ces Conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          2. Description du Service
        </Typography>
        <Typography paragraph>
          ImmoInvestPro est une application d'analyse d'investissement immobilier au Québec, offrant des calculateurs financiers et des outils d'analyse pour les investisseurs immobiliers. Nous fournissons des outils pour analyser les propriétés FLIP et MULTI logements.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          3. Exactitude des Calculs
        </Typography>
        <Typography paragraph>
          Bien que nous nous efforcions de fournir des outils de calcul précis et fiables, ImmoInvestPro ne garantit pas l'exactitude, l'exhaustivité ou la pertinence des résultats générés par nos calculateurs. Les informations et les calculs fournis par notre application sont destinés à usage éducatif et informatif uniquement et ne constituent pas un conseil financier, juridique ou immobilier.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          4. Responsabilité de l'Utilisateur
        </Typography>
        <Typography paragraph>
          L'utilisateur est seul responsable des décisions d'investissement prises en se basant sur les informations fournies par ImmoInvestPro. Nous vous recommandons de consulter des professionnels qualifiés avant de prendre des décisions d'investissement importantes.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          5. Propriété Intellectuelle
        </Typography>
        <Typography paragraph>
          Tout le contenu, y compris mais sans s'y limiter, les textes, graphiques, logos, icônes, images, clips audio, téléchargements numériques et compilations de données, est la propriété d'ImmoInvestPro ou de ses fournisseurs de contenu et est protégé par les lois canadiennes et internationales sur le droit d'auteur.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          6. Limitation de Responsabilité
        </Typography>
        <Typography paragraph>
          En aucun cas, ImmoInvestPro, ses dirigeants, administrateurs, employés ou agents ne seront responsables de tout dommage direct, indirect, accessoire, spécial, consécutif ou punitif, y compris sans limitation, la perte de profits, de données, d'utilisation, de bonne volonté ou d'autres pertes intangibles, résultant de l'utilisation ou de l'incapacité d'utiliser le service.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          7. Modifications des Conditions
        </Typography>
        <Typography paragraph>
          ImmoInvestPro se réserve le droit, à sa seule discrétion, de modifier ou de remplacer ces conditions à tout moment. Si une révision est importante, nous fournirons un préavis d'au moins 30 jours avant que les nouvelles conditions prennent effet.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          8. Loi Applicable
        </Typography>
        <Typography paragraph>
          Ces conditions sont régies et interprétées conformément aux lois de la province de Québec et aux lois fédérales canadiennes applicables, sans égard aux principes de conflit de lois.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" align="center">
            Dernière mise à jour: {new Date().toLocaleDateString('fr-CA')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsAndConditions;