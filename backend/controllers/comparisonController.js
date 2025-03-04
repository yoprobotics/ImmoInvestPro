/**
 * Controller pour l'API de comparaison de scénarios
 */

const ScenarioComparisonUtility = require('../calculators/utilities/ScenarioComparisonUtility');

/**
 * Compare plusieurs scénarios d'investissement
 * @param {Object} req La requête HTTP
 * @param {Object} res La réponse HTTP
 */
exports.compareScenarios = async (req, res) => {
  try {
    const { scenarios, options } = req.body;
    
    if (!scenarios || !Array.isArray(scenarios) || scenarios.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez fournir au moins un scénario à comparer'
      });
    }
    
    const results = ScenarioComparisonUtility.compareScenarios(scenarios, options);
    
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Erreur lors de la comparaison des scénarios:', error.message);
    
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la comparaison des scénarios',
      error: error.message
    });
  }
};

/**
 * Analyse un scénario unique (FLIP ou MULTI)
 * @param {Object} req La requête HTTP
 * @param {Object} res La réponse HTTP
 */
exports.analyzeScenario = async (req, res) => {
  try {
    const scenario = req.body;
    
    if (!scenario || Object.keys(scenario).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez fournir un scénario à analyser'
      });
    }
    
    // Détermine si c'est un FLIP ou un MULTI et analyse en conséquence
    const isFlip = scenario.hasOwnProperty('salePrice');
    let analysis;
    
    if (isFlip) {
      analysis = ScenarioComparisonUtility._analyzeFlipScenario(scenario);
    } else {
      analysis = ScenarioComparisonUtility._analyzeMultiScenario(scenario);
    }
    
    return res.status(200).json({
      success: true,
      data: {
        scenario: scenario,
        analysis: analysis
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'analyse du scénario:', error.message);
    
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'analyse du scénario',
      error: error.message
    });
  }
};
