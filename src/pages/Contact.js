import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setSubmitError('Veuillez fournir une adresse e-mail valide.');
      return;
    }

    // Ici, vous intégreriez un service d'envoi d'e-mail réel
    // Pour cette démo, nous simulons une réponse réussie
    setTimeout(() => {
      setFormSubmitted(true);
      setSubmitError(null);
    }, 1000);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Contactez-nous</h1>
            </div>
            <div className="card-body">
              {formSubmitted ? (
                <div className="alert alert-success p-4">
                  <h4 className="mb-3">Message envoyé!</h4>
                  <p>Merci de nous avoir contactés. Notre équipe vous répondra dans les meilleurs délais.</p>
                  <button 
                    className="btn btn-outline-primary mt-3"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                      });
                    }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="alert alert-danger mb-4">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">Nom complet <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Adresse e-mail <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="votre.email@exemple.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group mb-3">
                    <label htmlFor="subject" className="form-label">Sujet</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      placeholder="Sujet de votre message"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group mb-4">
                    <label htmlFor="message" className="form-label">Message <span className="text-danger">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows="6"
                      placeholder="Votre message..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary px-4">
                      Envoyer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Informations de contact</h2>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h3 className="h5 text-primary">Adresse</h3>
                <p className="mb-1">ImmoInvestPro Inc.</p>
                <p className="mb-1">800 Boulevard René-Lévesque Ouest</p>
                <p>Montréal, QC H3B 1X9</p>
              </div>
              
              <div className="mb-4">
                <h3 className="h5 text-primary">Téléphone</h3>
                <p className="mb-1">Support technique: <a href="tel:+15141234567">+1 (514) 123-4567</a></p>
                <p>Service client: <a href="tel:+18001234567">+1 (800) 123-4567</a></p>
              </div>
              
              <div className="mb-4">
                <h3 className="h5 text-primary">Email</h3>
                <p className="mb-1">Support: <a href="mailto:support@immoinvestpro.com">support@immoinvestpro.com</a></p>
                <p className="mb-1">Information: <a href="mailto:info@immoinvestpro.com">info@immoinvestpro.com</a></p>
                <p>Partenariats: <a href="mailto:partnerships@immoinvestpro.com">partnerships@immoinvestpro.com</a></p>
              </div>
              
              <div className="mb-4">
                <h3 className="h5 text-primary">Heures d'ouverture</h3>
                <p className="mb-1">Lundi - Vendredi: 9h00 - 17h00</p>
                <p>Samedi - Dimanche: Fermé</p>
              </div>
              
              <div className="mt-5">
                <h3 className="h5 text-primary">Suivez-nous</h3>
                <div className="d-flex gap-3 mt-2">
                  <a href="#" className="btn btn-outline-primary">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="btn btn-outline-primary">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="btn btn-outline-primary">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="btn btn-outline-primary">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
