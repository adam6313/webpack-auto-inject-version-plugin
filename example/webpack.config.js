const path = require('path');

const webpackAutoInjectVersionPlugin = require('../src/index')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpackAutoInjectVersionPlugin(),
  ],
};