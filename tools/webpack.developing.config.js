'use strict';

var path = require('path');

__dirname = path.join(__dirname, '..');

var config = require('./webpack.developing.hot.config.js');

module.exports = config;
