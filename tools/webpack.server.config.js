'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['./server/index.js'],
  output: {
    path: path.join(__dirname, '../dist/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  externals: /^[a-z\-0-9]+$/,
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(js)$/,
        loaders: ['babel-loader'],
        exclude: path.join(__dirname, '../node_modules'),
      }
    ]
  }
}