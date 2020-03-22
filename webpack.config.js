var path = require('path');

module.exports = {
  mode: 'development',
  entry: './static/index.js',
  output: {
    path: path.resolve(__dirname, 'static', 'dist'),
    filename: 'main.bundle.js',
  },
};
