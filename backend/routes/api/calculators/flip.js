const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const FlipCalculator = require('../../../models/FlipCalculator');
const flipDetailedCalculator = require('../../../calculators/FlipDetailedCalculator');

/**
 * Routes API pour le calculateur FLIP 3.0
 */

/**
 * @route   POST api/calculators/flip/calculate
 * @desc    Calculer FLIP sans sauvegarder
 * @access  Public
 */
router.post('/calculate', async (req, res) => {
  try {
    const results = flipDetailedCalculator.calculate(req.body);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur');
  }
});

/**
 * @route   POST api/calculators/flip/compare
 * @desc    Comparer plusieurs scénarios FLIP
 * @access  Public
 */
router.post('/compare', async (req, res) => {
  try {
    const { scenarios } = req.body;
    
    if (!scenarios || !Array.isArray(scenarios) || scenarios.length === 0) {
      return res.status(400).json({ message: 'Un tableau de scénarios est requis' });
    }
    
    const results = scenarios.map(scenario => flipDetailedCalculator.calculate(scenario));
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur');
  }
});

/**
 * @route   GET api/calculators/flip/user
 * @desc    Récupérer tous les calculs FLIP de l'utilisateur
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    const calculations = await FlipCalculator.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(calculations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur');
  }
});

/**
 * @route   GET api/calculators/flip/:id
 * @desc    Récupérer un calcul FLIP par ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const calculation = await FlipCalculator.findById(req.params.id);
    
    if (!calculation) {
      return res.status(404).json({ message: 'Calcul non trouvé' });
    }
    
    // Vérifier si l'utilisateur est propriétaire du calcul
    if (calculation.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    
    res.json(calculation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Calcul non trouvé' });
    }
    res.status(500).send('Erreur du serveur');
  }
});

/**
 * @route   POST api/calculators/flip
 * @desc    Créer un nouveau calcul FLIP
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('inputData.generalInfo.propertyAddress', 'L\'adresse de la propriété est requise').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { inputData, scenarios } = req.body;
      
      // Calculer les résultats si non fournis
      const results = req.body.results || flipDetailedCalculator.calculate(inputData);
      
      const newCalculation = new FlipCalculator({
        user: req.user.id,
        inputData,
        results,
        scenarios: scenarios || []
      });
      
      const calculation = await newCalculation.save();
      res.json(calculation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur');
    }
  }
);

/**
 * @route   PUT api/calculators/flip/:id
 * @desc    Mettre à jour un calcul FLIP
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    let calculation = await FlipCalculator.findById(req.params.id);
    
    if (!calculation) {
      return res.status(404).json({ message: 'Calcul non trouvé' });
    }
    
    // Vérifier si l'utilisateur est propriétaire du calcul
    if (calculation.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    
    const { inputData, results, scenarios } = req.body;
    
    // Calculer les nouveaux résultats si non fournis
    const updatedResults = results || flipDetailedCalculator.calculate(inputData);
    
    calculation = await FlipCalculator.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          inputData,
          results: updatedResults,
          scenarios: scenarios || [],
          updatedAt: Date.now()
        }
      },
      { new: true }
    );
    
    res.json(calculation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Calcul non trouvé' });
    }
    res.status(500).send('Erreur du serveur');
  }
});

/**
 * @route   DELETE api/calculators/flip/:id
 * @desc    Supprimer un calcul FLIP
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const calculation = await FlipCalculator.findById(req.params.id);
    
    if (!calculation) {
      return res.status(404).json({ message: 'Calcul non trouvé' });
    }
    
    // Vérifier si l'utilisateur est propriétaire du calcul
    if (calculation.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    
    await calculation.remove();
    
    res.json({ message: 'Calcul supprimé' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Calcul non trouvé' });
    }
    res.status(500).send('Erreur du serveur');
  }
});

module.exports = router;