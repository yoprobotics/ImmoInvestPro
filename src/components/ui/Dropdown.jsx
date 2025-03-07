import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

/**
 * Composant Dropdown réutilisable
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.options - Options du dropdown [{label: string, value: string}]
 * @param {any} props.value - Valeur sélectionnée
 * @param {function} props.onChange - Fonction à exécuter lors du changement
 * @param {string} props.placeholder - Texte affiché quand aucune valeur n'est sélectionnée
 * @param {string} props.className - Classes CSS additionnelles
 * @returns {JSX.Element} - Le composant Dropdown
 */
const Dropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Sélectionner une option', 
  className = '',
  disabled = false,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);
  
  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const dropdownClasses = [
    'dropdown',
    isOpen ? 'dropdown-open' : '',
    disabled ? 'dropdown-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={dropdownClasses} ref={dropdownRef} {...rest}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span className="dropdown-selected">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option) => (
            <li 
              key={option.value} 
              className={`dropdown-option ${option.value === value ? 'dropdown-option-selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;