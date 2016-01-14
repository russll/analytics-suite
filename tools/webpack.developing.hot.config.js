'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

__dirname = path.join(__dirname, '..');

module.exports = {
  devtool: 'eval-source-map',
  debug: true,
  entry: [
    'webpack-hot-middleware/client?reload=true',
  ],
  output: {
    path: path.join(__dirname, 'dist/client'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve : {
    alias: {
      styles: path.join(__dirname, 'client', 'app', 'styles'),
      app: path.join(__dirname, 'client', 'app'),
      components: path.join(__dirname, 'client', 'app', 'components')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: path.join(__dirname, 'node_modules'),
        include: path.join(__dirname, 'client'),
        query: {
          presets: ['stage-0', 'react', 'es2015'],
          plugins: ['babel-relay-plugin-loader', 'transform-class-properties'],
        },
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss']
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader'
      }
    ]
  }
};
