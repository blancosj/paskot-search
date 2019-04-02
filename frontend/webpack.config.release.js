const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base.js')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      NODE_LOG_MODE: JSON.stringify('NONE')
    })
  ],
  performance: {
    maxEntrypointSize: 400000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      })
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 0,
      maxSize: 390000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
})
