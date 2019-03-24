module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, "../dist"),
    // publicPath: 'dist',
    filename: 'bundle.js'
  }
}
