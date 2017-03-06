var path = require('path');
var webpack = require('webpack');

var loaders = [
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader'
  },
  {
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
  }
];

module.exports = {
  entry: __dirname + '/src/index.js',
  devtool: 'inline-source-map',
  watch: true,
  output: {
      path:'/',
      filename: 'dist/client.js'
  },
  module: {
    loaders: loaders
  },
  stats: {
    colors: true
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: (process.env.DEBUG && process.env.DEBUG.match(/app/i)) ? true : false
    })
  ]
};
