/**
 * Index des calculateurs financiers
 */

const liquidityCalculator = require('./liquidity_calculator');
const napkinFlipCalculator = require('./napkin_flip_calculator');
const napkinMultiCalculator = require('./napkin_multi_calculator');

module.exports = {
  liquidityCalculator,
  napkinFlipCalculator,
  napkinMultiCalculator
};
