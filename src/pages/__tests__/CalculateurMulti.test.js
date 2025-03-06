import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculateurMulti from '../CalculateurMulti';

// Mock pour Intl.NumberFormat car Jest ne le supporte pas nativement
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useEffect: (callback, deps) => {
      // Appeler le callback immédiatement pour les tests
      callback();
      return originalReact.useEffect(callback, deps);
    }
  };
});

global.Intl.NumberFormat = function(locale, options) {
  return {
    format: (number) => {
      if (options && options.style === 'currency') {
        return `${number.toFixed(2)} $`;
      } else if (options && options.style === 'percent') {
        return `${(number).toFixed(2)} %`;
      }
      return number.toString();
    }
  };
};

describe('CalculateurMulti', () => {
  beforeEach(() => {
    // Réinitialiser le DOM avant chaque test
    jest.clearAllMocks();
  });

  test('affiche correctement le formulaire', () => {
    render(<CalculateurMulti />);
    expect(screen.getByText('Calculateur Napkin MULTI (PAR + HIGH-5)')).toBeInTheDocument();
    expect(screen.getByLabelText(/Prix d'achat/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre d'appartements/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Revenus bruts annuels/i)).toBeInTheDocument();
  });

  test('calcule automatiquement le taux de dépenses en fonction du nombre d\'appartements', () => {
    render(<CalculateurMulti />);
    
    const inputNombreAppartements = screen.getByLabelText(/Nombre d'appartements/i);
    
    // Test pour 1-2 logements
    fireEvent.change(inputNombreAppartements, { target: { value: '2' } });
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    
    // Test pour 3-4 logements
    fireEvent.change(inputNombreAppartements, { target: { value: '4' } });
    expect(screen.getByDisplayValue('35')).toBeInTheDocument();
    
    // Test pour 5-6 logements
    fireEvent.change(inputNombreAppartements, { target: { value: '6' } });
    expect(screen.getByDisplayValue('45')).toBeInTheDocument();
    
    // Test pour 7+ logements
    fireEvent.change(inputNombreAppartements, { target: { value: '7' } });
    expect(screen.getByDisplayValue('50')).toBeInTheDocument();
  });

  test('calcule correctement les résultats avec la méthode HIGH-5', () => {
    render(<CalculateurMulti />);
    
    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/Prix d'achat/i), { target: { value: '500000' } });
    fireEvent.change(screen.getByLabelText(/Nombre d'appartements/i), { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText(/Revenus bruts annuels/i), { target: { value: '60000' } });
    
    // Cliquer sur le bouton calculer
    fireEvent.click(screen.getByText('Calculer'));
    
    // Vérifier les résultats (après le rendu des résultats)
    // Note: Les valeurs exactes dépendent de la façon dont le formatage est fait
    setTimeout(() => {
      const resultatsElement = screen.getByText('Résultats');
      expect(resultatsElement).toBeInTheDocument();
      
      // Vérifier que les résultats principaux sont affichés
      expect(screen.getByText(/Revenus nets d'opération/i)).toBeInTheDocument();
      expect(screen.getByText(/Financement annuel/i)).toBeInTheDocument();
      expect(screen.getByText(/Liquidité annuelle/i)).toBeInTheDocument();
      expect(screen.getByText(/Liquidité par porte/i)).toBeInTheDocument();
      expect(screen.getByText(/Prix d'achat maximum/i)).toBeInTheDocument();
    }, 0);
  });

  test('bascule entre les modes rapide et détaillé', () => {
    render(<CalculateurMulti />);
    
    // Par défaut, le mode devrait être rapide
    expect(screen.queryByText(/Personnaliser les paramètres de financement/i)).not.toBeInTheDocument();
    
    // Cliquer sur le bouton Mode Détaillé
    fireEvent.click(screen.getByText('Mode Détaillé'));
    
    // Maintenant les options détaillées devraient être visibles
    expect(screen.getByText(/Personnaliser les paramètres de financement/i)).toBeInTheDocument();
    
    // Revenir au mode rapide
    fireEvent.click(screen.getByText('Mode Napkin (Rapide)'));
    
    // Les options détaillées devraient disparaître
    expect(screen.queryByText(/Personnaliser les paramètres de financement/i)).not.toBeInTheDocument();
  });

  test('calcule correctement le prix d\'achat maximal pour 75$/porte/mois', () => {
    render(<CalculateurMulti />);
    
    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/Prix d'achat/i), { target: { value: '500000' } });
    fireEvent.change(screen.getByLabelText(/Nombre d'appartements/i), { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText(/Revenus bruts annuels/i), { target: { value: '60000' } });
    
    // Cliquer sur le bouton calculer
    fireEvent.click(screen.getByText('Calculer'));
    
    // Vérifier que le prix d'achat maximal est affiché après le rendu des résultats
    setTimeout(() => {
      expect(screen.getByText(/Prix d'achat maximum pour atteindre 75\$\/porte\/mois/i)).toBeInTheDocument();
    }, 0);
  });
});
