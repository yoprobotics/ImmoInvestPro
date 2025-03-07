import React from 'react';
import './Button.css';

/**
 * Composant Button réutilisable
 * @param {Object} props - Propriétés du composant
 * @param {string} props.variant - Variante du bouton (primary, secondary, outlined, danger)
 * @param {string} props.size - Taille du bouton (sm, md, lg)
 * @param {boolean} props.fullWidth - Si le bouton prend toute la largeur disponible
 * @param {function} props.onClick - Fonction à exécuter lors du clic
 * @param {string} props.className - Classes CSS additionnelles
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @returns {JSX.Element} - Le composant Button
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  onClick, 
  className = '', 
  children,
  ...rest
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;