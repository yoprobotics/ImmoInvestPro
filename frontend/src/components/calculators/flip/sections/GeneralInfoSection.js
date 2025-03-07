import React from 'react';
import PropTypes from 'prop-types';

/**
 * Section des informations générales pour le calculateur FLIP
 */
const GeneralInfoSection = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="section mb-4">
      <h4 className="mb-3">Informations générales</h4>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="scenarioName" className="form-label">Nom du scénario</label>
              <input
                type="text"
                className="form-control"
                id="scenarioName"
                name="scenarioName"
                value={data.scenarioName || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-12">
              <label htmlFor="propertyAddress" className="form-label">Adresse de la propriété *</label>
              <input
                type="text"
                className="form-control"
                id="propertyAddress"
                name="propertyAddress"
                value={data.propertyAddress || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="propertyCity" className="form-label">Ville</label>
              <input
                type="text"
                className="form-control"
                id="propertyCity"
                name="propertyCity"
                value={data.propertyCity || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="propertyState" className="form-label">Province</label>
              <input
                type="text"
                className="form-control"
                id="propertyState"
                name="propertyState"
                value={data.propertyState || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="propertyZip" className="form-label">Code postal</label>
              <input
                type="text"
                className="form-control"
                id="propertyZip"
                name="propertyZip"
                value={data.propertyZip || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="purchaseDate" className="form-label">Date d'achat prévue</label>
              <input
                type="date"
                className="form-control"
                id="purchaseDate"
                name="purchaseDate"
                value={data.purchaseDate || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="expectedSaleDate" className="form-label">Date de vente prévue</label>
              <input
                type="date"
                className="form-control"
                id="expectedSaleDate"
                name="expectedSaleDate"
                value={data.expectedSaleDate || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

GeneralInfoSection.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default GeneralInfoSection;