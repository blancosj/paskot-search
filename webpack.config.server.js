module.exports = {
  entry: [
    './backend/index.js'
  ],
  output: {
    path: path.resolve(__dirname, "../dist"),
    // publicPath: 'dist',
    filename: 'bundle.js'
  }
}
