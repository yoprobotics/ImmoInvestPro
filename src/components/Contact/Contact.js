import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';

const Contact = () => {
  // État pour le formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // État pour les messages de réussite/erreur
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Liste des sujets possibles
  const subjects = [
    'Question générale',
    'Support technique',
    'Suggestion d\'amélioration',
    'Signaler un problème',
    'Demande de fonctionnalité',
    'Autre'
  ];

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous implémenteriez la logique pour envoyer les données du formulaire
    // à votre backend ou service d'envoi d'emails
    
    // Pour l'instant, on simule juste une soumission réussie
    setSnackbar({
      open: true,
      message: 'Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.',
      severity: 'success'
    });
    
    // Réinitialiser le formulaire
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  // Fermeture du snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Contactez-nous
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {/* Informations de contact */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Nos coordonnées
              </Typography>
              <Typography paragraph>
                N'hésitez pas à nous contacter pour toute question, suggestion ou demande d'information.
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Typography>
                  <strong>Email:</strong> contact@immoinvestpro.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Typography>
                  <strong>Téléphone:</strong> (514) 555-1234
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon color="primary" sx={{ mr: 2 }} />
                <Typography>
                  <strong>Adresse:</strong> 1234 Rue Principale, Montréal, QC H3X 2Y7
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Heures d'ouverture
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Lundi - Vendredi:</Typography>
                <Typography>9h - 17h</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Samedi:</Typography>
                <Typography>10h - 14h</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Dimanche:</Typography>
                <Typography>Fermé</Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Formulaire de contact */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Envoyez-nous un message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    select
                    label="Sujet"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                  >
                    {subjects.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={6}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SendIcon />}
                >
                  Envoyer
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Message de confirmation */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;