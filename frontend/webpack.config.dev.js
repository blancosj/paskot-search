const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base.js')

module.exports = merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      NODE_LOG_MODE: JSON.stringify('DEBUG')
    })
  ]
})
