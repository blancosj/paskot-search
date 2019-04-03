const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base.js')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(baseConfig, {
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      NODE_LOG_MODE: JSON.stringify('DEBUG')
    }),
    new webpack.SourceMapDevToolPlugin({})
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  }
})
