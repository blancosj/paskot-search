const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin  = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: [
    './src/index.jsx'
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: '[name].bundle-front.js',
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
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      favicon: './public/favicon.ico'
    }),
    new CopyWebpackPlugin([
        { from: 'public/manifest.json', to: path.resolve(__dirname, '../public') },
        { from: 'src/assets/img/icon-192.png', to: path.resolve(__dirname, '../public/img') },
        { from: 'src/assets/img/icon-512.png', to: path.resolve(__dirname, '../public/img') }
    ])
  ]
}
