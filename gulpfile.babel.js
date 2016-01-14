'use strict'

import { Schema } from './data/schema.js';
import { introspectionQuery } from 'graphql/utilities';
import { graphql } from 'graphql';

var gulp = require('gulp');
var gutil = require('gulp-util');
var install = require("gulp-install");
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var del = require('del');
var env = require('gulp-env');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var path = require('path');
var fs = require('fs');

var webpackProductionConfig = require('./tools/webpack.production.config.js');
var webpackDevelopingConfig = require('./tools/webpack.developing.config.js');
var webpackDevelopingHotConfig = require('./tools/webpack.developing.hot.config.js');
var webpackServerConfig = require('./tools/webpack.server.config.js');

let compiler;

// Scenarios
gulp.task('aws-1', ['generate-schema', 'build-server-aws-1', 'build-aws-1']);
gulp.task('dev-aws-1', ['generate-schema', 'build-dev-server-aws-1']);

gulp.task('renessans', ['generate-schema', 'build-server-renessans', 'build-renessans']);
gulp.task('dev-renessans', ['generate-schema', 'build-dev-server-renessans']);

// Client
// Default aws 1
gulp.task('default', ['init-aws-1', 'webpack-dev-server']);
gulp.task('build-dev', ['init-aws-1', 'webpack:build-dev'], function () {
  gulp.watch(['client/app/**/*'], ['webpack:build-dev']);
});
gulp.task('build', ['init-aws-1', 'webpack:build']);

// Default aws #1
gulp.task('default-aws-1', ['init-aws-1', 'webpack-dev-server']);
gulp.task('build-dev-aws-1', ['init-aws-1', 'webpack:build-dev'], function () {
  gulp.watch(['client/app/**/*'], ['webpack:build-dev']);
});
gulp.task('build-aws-1', ['init-aws-1', 'webpack:build']);

// Default renessans
gulp.task('default-renessans', ['init-renessans', 'webpack-dev-server']);
gulp.task('build-dev-renessans', ['init-renessans', 'webpack:build-dev'], function () {
  gulp.watch(['client/app/**/*'], ['webpack:build-dev']);
});
gulp.task('build-renessans', ['init-renessans', 'webpack:build']);

// Simple tasks
gulp.task('init-renessans', ['clean-client', 'set-env-app-type-analytics', 'set-env-api-ip-port-analytics-renessans']);
gulp.task('init-aws-1', ['clean-client', 'set-env-app-type-analytics', 'set-env-api-ip-port-analytics-aws-1']);

// Server
// Default aws 1
gulp.task('build-dev-server-aws-1', ['clean-server', 'init-server-aws-1', 'set-env-development', 'webpack:build-server-aws-1']);
gulp.task('build-server-aws-1', ['clean-server', 'init-server-aws-1', 'set-env-production', 'webpack:build-server-aws-1']);

// Default renessans
gulp.task('build-dev-server-renessans', ['clean-server', 'init-server-renessans', 'set-env-development', 'webpack:build-server-renessans']);
gulp.task('build-server-renessans', ['clean-server', 'init-server-renessans', 'set-env-production', 'webpack:build-server-renessans']);

gulp.task('init-server-renessans', ['clean-server', 'set-env-api-ip-port-analytics-renessans']);
gulp.task('init-server-aws-1', ['clean-server', 'set-env-api-ip-port-analytics-aws-1']);

gulp.task('webpack:build', function (callback) {
  // run webpack
  webpack(webpackProductionConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack:build-dev', function (callback) {
  // run webpack
  webpack(webpackDevelopingConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-dev', err);
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack-dev-server', function (callback) {
  // Start a webpack-dev-server
  new WebpackDevServer(webpack(webpackDevelopingHotConfig), {
    stats: {
      colors: true
    }
  }).listen(7000, 'localhost', function (err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:7000/webpack-dev-server/index.html');
  });
});

gulp.task('clean', function () {
  return del([
    'dist/'
  ]);
});

gulp.task('clean-client', function () {
  return del([
    'dist/client'
  ]);
});

gulp.task('clean-server', function () {
  return del([
    'dist/server'
  ]);
});

gulp.task('set-env-production', function () {
  env({
    NODE_ENV: 'production',
  })
});

gulp.task('set-env-development', function () {
  env({
    NODE_ENV: 'development',
  })
});

gulp.task('set-env-app-type-analytics', function () {
  webpackDevelopingConfig.entry.push('./client/app/analytics.js');
  webpackProductionConfig.entry = './client/app/analytics.js';
});

gulp.task('set-env-api-ip-port-analytics-renessans', function () {
  env({
    API_IP: '192.168.11.168',
    API_PORT: 8000
  })
});

gulp.task('set-env-api-ip-port-analytics-aws-1', function () {
  env({
    API_IP: '52.33.191.248',
    API_PORT: 8000
  })
});

gulp.task('webpack:build-server-aws-1', function (callback) {
  webpack(webpackServerConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-server-aws-1', err);
    gutil.log('[webpack:build-server-aws-1]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack:build-server-renessans', function () {
  webpack(webpackServerConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-server-renessans', err);
    gutil.log('[webpack:build-server-renessans]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('generate-schema', () => {
  return graphql(Schema, introspectionQuery)
    .then(result => {
      if (result.errors)
        return console.error('[schema]: ERROR --', JSON.stringify(result.errors, null, 2));
      fs.writeFileSync(
        path.join(__dirname, './data/schema.json'),
        JSON.stringify(result, null, 2)
      );
      return compiler ? recompile() : null;
    });
});

gulp.task('install', function () {
  return gulp
    .src(['./package.json'])
    .pipe(install());
})

// trigger a manual recompilation of webpack(frontendConfig);
function recompile() {
  if (!compiler)
    return null;
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err)
        reject(err);
      console.log('[webpackDevServer]: recompiled');
      resolve();
    });
  });
}

