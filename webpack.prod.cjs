const path = require('path')

module.exports = {
  mode: 'development',

  entry: './src/three-csg.ts',

  output: {
    filename: 'three-csg.min.js',
    path: path.resolve(__dirname),
    library: 'ThreeCSG',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  },
  externals: {
    three: 'THREE'
  }
}
