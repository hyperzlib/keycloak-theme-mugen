const scss = require('rollup-plugin-scss');
const postcss = require('rollup-plugin-postcss');

module.exports = {
  rollup: {
    plugins: [
      scss({
        output: 'app.css'
      })
    ]
  }
};