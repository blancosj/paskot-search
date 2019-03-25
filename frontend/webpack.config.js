const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin  = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index.jsx'
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'bundle-front.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        include: /node_modules|src/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    })
  ]
}
