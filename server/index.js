import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../tools/webpack.developing.config.js';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 7000 : process.env.PORT;
const address = process.env.DOCKER_HOST || process.env.APP_IP || 'localhost';
const app = express();

import graphQLHTTP from 'express-graphql';
import { Schema } from '../data/schema.js';

import apiConfig from '../client/app/api/config.json';
import serverProxyAPI from './server.proxy.api.js';

app.use('/graphql', graphQLHTTP((request) => ({
  graphiql: isDeveloping,
  pretty: true,
  schema: Schema,
})));

// Here we proxy API requests.
if (apiConfig.defaults.nodeProxy === true) {
  serverProxyAPI(app, apiConfig);
}

app.use('/img', express.static(__dirname + '/public/img'));

if (isDeveloping) {
  config.entry.push('./client/app/' + process.env.APP_TYPE + '.js');

  config.node = {
    __filename: false,
    __dirname: false,
  };
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: '.',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist', 'client', 'index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist/client'));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'client', 'index.html'));
  });
}

app.listen(port, address, function(err) {
  if (err) {
    // TODO : Add logging.
    return console.error(err);
  } else {
    console.info('Listening on http://%s:%s in %s', address, port, isDeveloping ? 'developer mode' : 'production mode');
  }
});
