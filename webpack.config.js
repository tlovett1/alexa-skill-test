var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: __dirname + '/src/index.js',
  devtool: 'inline-source-map',
  watch: true,
  output: {
    filename: 'dist/client.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: [path.join(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets')]
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader'
      }
    ]
  },
  stats: {
    colors: true
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: (process.env.DEBUG && process.env.DEBUG.match(/app/i)) ? true : false
    })
  ]
};
