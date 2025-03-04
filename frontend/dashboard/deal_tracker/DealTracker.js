/**
 * Composant DealTracker
 * 
 * Ce composant permet aux utilisateurs de suivre leurs opportunités
 * d'investissement. Il affiche les propriétés enregistrées, leur
 * statut d'analyse et les prochaines actions recommandées.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Statuts possibles pour une opportunité
const DEAL_STATUS = {
  NEW: 'NEW',                   // Nouvelle opportunité
  ANALYZING: 'ANALYZING',       // En cours d'analyse
  PENDING_OFFER: 'PENDING_OFFER', // En attente d'offre
  OFFER_SUBMITTED: 'OFFER_SUBMITTED', // Offre soumise
  UNDER_NEGOTIATION: 'UNDER_NEGOTIATION', // En négociation
  ACCEPTED: 'ACCEPTED',         // Offre acceptée
  INSPECTION: 'INSPECTION',     // En inspection
  FINANCING: 'FINANCING',       // En financement
  CLOSING: 'CLOSING',           // En processus de clôture
  CLOSED: 'CLOSED',             // Transaction finalisée
  LOST: 'LOST',                 // Opportunité perdue
  ABANDONED: 'ABANDONED'        // Opportunité abandonnée
};

// Types d'investissement
const INVESTMENT_TYPES = {
  FLIP: 'FLIP',
  MULTI: 'MULTI'
};

/**
 * Composant principal de suivi des opportunités
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.deals - Liste des opportunités à afficher
 * @param {Function} props.onDealClick - Fonction appelée quand une opportunité est cliquée
 * @param {Function} props.onStatusChange - Fonction appelée quand le statut d'une opportunité change
 * @param {boolean} props.isPremium - Indique si l'utilisateur a un compte premium
 */
function DealTracker({ deals, onDealClick, onStatusChange, isPremium }) {
  const [filteredDeals, setFilteredDeals] = useState(deals);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Mettre à jour les opportunités filtrées quand les filtres changent
  useEffect(() => {
    let result = [...deals];
    
    // Appliquer le filtre de statut
    if (statusFilter !== 'ALL') {
      result = result.filter(deal => deal.status === statusFilter);
    }
    
    // Appliquer le filtre de type
    if (typeFilter !== 'ALL') {
      result = result.filter(deal => deal.investmentType === typeFilter);
    }
    
    // Appliquer le tri
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(b.dateAdded) - new Date(a.dateAdded);
      } else if (sortBy === 'price') {
        comparison = b.price - a.price;
      } else if (sortBy === 'profit') {
        comparison = (b.estimatedProfit || 0) - (a.estimatedProfit || 0);
      } else if (sortBy === 'roi') {
        comparison = (b.estimatedROI || 0) - (a.estimatedROI || 0);
      }
      
      return sortDirection === 'asc' ? -comparison : comparison;
    });
    
    setFilteredDeals(result);
  }, [deals, statusFilter, typeFilter, sortBy, sortDirection]);
  
  // Gérer le changement de statut d'une opportunité
  const handleStatusChange = (dealId, newStatus) => {
    if (onStatusChange) {
      onStatusChange(dealId, newStatus);
    }
  };
  
  // Gérer le clic sur une opportunité
  const handleDealClick = (deal) => {
    if (onDealClick) {
      onDealClick(deal);
    }
  };
  
  // Gérer le changement de filtre de statut
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Gérer le changement de filtre de type
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };
  
  // Gérer le changement de tri
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Gérer le changement de direction de tri
  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Limiter le nombre d'opportunités affichées pour les utilisateurs gratuits
  const displayedDeals = isPremium ? filteredDeals : filteredDeals.slice(0, 2);
  
  // Afficher un message si aucune opportunité ne correspond aux filtres
  if (filteredDeals.length === 0) {
    return (
      <div className="deal-tracker-empty">
        <h3>Aucune opportunité trouvée</h3>
        <p>Aucune opportunité ne correspond à vos critères de filtrage actuels.</p>
        <button onClick={() => { setStatusFilter('ALL'); setTypeFilter('ALL'); }}>
          Réinitialiser les filtres
        </button>
      </div>
    );
  }
  
  return (
    <div className="deal-tracker-container">
      <div className="deal-tracker-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Statut:</label>
          <select id="status-filter" value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="ALL">Tous les statuts</option>
            {Object.entries(DEAL_STATUS).map(([key, value]) => (
              <option key={key} value={value}>{formatStatus(value)}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select id="type-filter" value={typeFilter} onChange={handleTypeFilterChange}>
            <option value="ALL">Tous les types</option>
            {Object.entries(INVESTMENT_TYPES).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-by">Trier par:</label>
          <select id="sort-by" value={sortBy} onChange={handleSortChange}>
            <option value="date">Date d'ajout</option>
            <option value="price">Prix</option>
            <option value="profit">Profit estimé</option>
            <option value="roi">ROI estimé</option>
          </select>
          <button 
            className={`sort-direction ${sortDirection}`} 
            onClick={handleSortDirectionChange}
            aria-label={sortDirection === 'asc' ? 'Trier en ordre décroissant' : 'Trier en ordre croissant'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      <div className="deals-list">
        {displayedDeals.map(deal => (
          <DealCard 
            key={deal.id} 
            deal={deal} 
            onClick={() => handleDealClick(deal)}
            onStatusChange={(newStatus) => handleStatusChange(deal.id, newStatus)}
          />
        ))}
      </div>
      
      {!isPremium && deals.length > 2 && (
        <div className="premium-upgrade-banner">
          <p>Vous avez {deals.length - 2} opportunités supplémentaires. Passez à la version premium pour toutes les voir!</p>
          <button className="upgrade-button">Passer à la version premium</button>
        </div>
      )}
    </div>
  );
}

/**
 * Composant représentant une opportunité d'investissement
 * 
 * @param {Object} props - Propriétés du composant 
 * @param {Object} props.deal - Données de l'opportunité
 * @param {Function} props.onClick - Fonction appelée quand la carte est cliquée
 * @param {Function} props.onStatusChange - Fonction appelée quand le statut change
 */
function DealCard({ deal, onClick, onStatusChange }) {
  // Gérer le changement de statut
  const handleStatusChange = (e) => {
    e.stopPropagation(); // Empêcher le clic de propager à la carte
    if (onStatusChange) {
      onStatusChange(e.target.value);
    }
  };
  
  return (
    <div className={`deal-card ${deal.investmentType.toLowerCase()}`} onClick={onClick}>
      <div className="deal-card-header">
        <span className={`deal-status ${deal.status.toLowerCase()}`}>
          {formatStatus(deal.status)}
        </span>
        <span className="deal-type">{deal.investmentType}</span>
      </div>
      
      <div className="deal-card-image">
        <img 
          src={deal.imageUrl || '/placeholder-property.jpg'} 
          alt={deal.address} 
          onError={(e) => { e.target.src = '/placeholder-property.jpg'; }}
        />
      </div>
      
      <div className="deal-card-content">
        <h3 className="deal-address">{deal.address}</h3>
        
        <div className="deal-details">
          <div className="deal-price">
            <span className="label">Prix:</span>
            <span className="value">{formatCurrency(deal.price)}</span>
          </div>
          
          {deal.investmentType === INVESTMENT_TYPES.FLIP && (
            <>
              <div className="deal-renovation">
                <span className="label">Rénovations:</span>
                <span className="value">{formatCurrency(deal.renovationCost || 0)}</span>
              </div>
              <div className="deal-final-price">
                <span className="label">Prix final estimé:</span>
                <span className="value">{formatCurrency(deal.estimatedFinalPrice || 0)}</span>
              </div>
            </>
          )}
          
          {deal.investmentType === INVESTMENT_TYPES.MULTI && (
            <>
              <div className="deal-units">
                <span className="label">Portes:</span>
                <span className="value">{deal.units || 0}</span>
              </div>
              <div className="deal-cashflow">
                <span className="label">Cashflow/porte/mois:</span>
                <span className="value">{formatCurrency(deal.cashflowPerUnit || 0)}</span>
              </div>
            </>
          )}
          
          <div className="deal-profit">
            <span className="label">Profit estimé:</span>
            <span className={`value ${(deal.estimatedProfit || 0) > 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(deal.estimatedProfit || 0)}
            </span>
          </div>
          
          <div className="deal-roi">
            <span className="label">ROI estimé:</span>
            <span className={`value ${(deal.estimatedROI || 0) > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(deal.estimatedROI || 0)}
            </span>
          </div>
        </div>
        
        <div className="deal-card-footer">
          <span className="deal-date">{formatDate(deal.dateAdded)}</span>
          
          <div className="deal-status-selector">
            <select value={deal.status} onChange={handleStatusChange} onClick={(e) => e.stopPropagation()}>
              {Object.entries(DEAL_STATUS).map(([key, value]) => (
                <option key={key} value={value}>{formatStatus(value)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Formater un status en texte lisible
 * @param {string} status - Code du statut 
 * @returns {string} - Texte formaté
 */
function formatStatus(status) {
  const statusMap = {
    [DEAL_STATUS.NEW]: 'Nouveau',
    [DEAL_STATUS.ANALYZING]: 'En analyse',
    [DEAL_STATUS.PENDING_OFFER]: 'Offre à soumettre',
    [DEAL_STATUS.OFFER_SUBMITTED]: 'Offre soumise',
    [DEAL_STATUS.UNDER_NEGOTIATION]: 'En négociation',
    [DEAL_STATUS.ACCEPTED]: 'Accepté',
    [DEAL_STATUS.INSPECTION]: 'En inspection',
    [DEAL_STATUS.FINANCING]: 'Financement en cours',
    [DEAL_STATUS.CLOSING]: 'Clôture en cours',
    [DEAL_STATUS.CLOSED]: 'Finalisé',
    [DEAL_STATUS.LOST]: 'Perdu',
    [DEAL_STATUS.ABANDONED]: 'Abandonné'
  };
  
  return statusMap[status] || status;
}

/**
 * Formater un montant en devise
 * @param {number} amount - Montant à formater 
 * @returns {string} - Montant formaté
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formater un pourcentage
 * @param {number} percentage - Pourcentage à formater 
 * @returns {string} - Pourcentage formaté
 */
function formatPercentage(percentage) {
  return `${percentage.toFixed(1)}%`;
}

/**
 * Formater une date
 * @param {string} dateString - Date à formater 
 * @returns {string} - Date formatée
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

DealTracker.propTypes = {
  deals: PropTypes.array.isRequired,
  onDealClick: PropTypes.func,
  onStatusChange: PropTypes.func,
  isPremium: PropTypes.bool
};

DealTracker.defaultProps = {
  deals: [],
  isPremium: false
};

DealCard.propTypes = {
  deal: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onStatusChange: PropTypes.func
};

export default DealTracker;
export { DEAL_STATUS, INVESTMENT_TYPES };
