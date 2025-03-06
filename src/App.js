import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/main.css';

// Pages
import Home from './pages/Home';
import CalculateurFlip from './pages/CalculateurFlip';
import CalculateurMulti from './pages/CalculateurMulti';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <div className="container d-flex justify-content-between align-items-center">
            <Link to="/" className="navbar-brand">ImmoInvestPro</Link>
            <ul className="navbar-nav d-flex flex-row">
              <li className="nav-item">
                <Link to="/" className="nav-link">Accueil</Link>
              </li>
              <li className="nav-item">
                <Link to="/calculateur-flip" className="nav-link">Calculateur FLIP</Link>
              </li>
              <li className="nav-item">
                <Link to="/calculateur-multi" className="nav-link">Calculateur MULTI</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculateur-flip" element={<CalculateurFlip />} />
            <Route path="/calculateur-multi" element={<CalculateurMulti />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h3 className="mb-3">ImmoInvestPro</h3>
                <p>Votre partenaire en investissement immobilier. Nous vous aidons à prendre des décisions éclairées pour maximiser vos rendements.</p>
              </div>
              <div className="col-md-4">
                <h4 className="mb-3">Liens rapides</h4>
                <ul className="footer-links">
                  <li><Link to="/">Accueil</Link></li>
                  <li><Link to="/calculateur-flip">Calculateur FLIP</Link></li>
                  <li><Link to="/calculateur-multi">Calculateur MULTI</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h4 className="mb-3">Légal</h4>
                <ul className="footer-links">
                  <li><Link to="/terms">Conditions d'utilisation</Link></li>
                  <li><Link to="/privacy">Politique de confidentialité</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} ImmoInvestPro. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
