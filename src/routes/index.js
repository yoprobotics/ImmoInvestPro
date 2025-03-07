import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

// Calculateurs
import FlipCalculator from '../components/calculators/FlipCalculator';

/**
 * Définition des routes de l'application
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'calculators',
        children: [
          {
            path: 'flip',
            element: <FlipCalculator />,
          }
        ]
      },
      {
        path: '*',
        element: <NotFoundPage />,
      }
    ],
  },
]);

export default router;
