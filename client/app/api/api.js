/**
 * That is the generic API service providing low-level requests construction.
 */

import config from './config.json';
import authAlias from './auth.json';

// jQuery is used for $.ajax only.
// TODO : Try fetch.
import $ from 'jquery';

import user from 'app/services/user.js';

export var api = {};

var savedAPIs = {}, // Store for Singleton-way created APIs.

    defaults = {}, // Default settings, filled with api.setup.
    versions = {}, // Last versions of used APIs.
    contentTypes = {}; // Pairs of 'format: contentType'.

api.setup = function (options) {
  Object.assign(defaults, options.defaults);
  Object.assign(versions, options.versions);
  Object.assign(contentTypes, options.contentTypes);
};

api.precompileURL = function ({ protocol, host, port, target, version }) {

  version = version || versions[target] || versions['_baseVersion'];

  var basePart,
      url;

  // If we proxy API requests through Node, we use just an '/api/...' part of the URL.
  if (config.defaults.nodeProxy === false) {
    basePart = `${protocol}://${host}`;
    if (port) basePart += `:${port}`;
  } else {
    basePart = '';
  }

  url = basePart + `/api/${target}/${version}/{{action}}`;

  return function (action) {
    return url.replace('{{action}}', action);
  };

};

api.getContentType = function (format) {
  return (contentTypes[format] ? contentTypes[format] : contentTypes['_baseFormat']) + '; charset=UTF-8';
};

// Create a common instance of API. It will be stored as a Singleton.
api.create = function (target, settings) {

  settings = settings || {};

  var instance;

  if (typeof target === 'string') {
    settings.target = target;
  }

  if (savedAPIs[settings.target]) {
    instance = savedAPIs[settings.target];
  } else {
    instance = savedAPIs[settings.target] = new API(settings);
  }

  return instance;

};

// Creating a non-Singleton instance of API.
api.createIsolated = function (target, settings) {

  if (typeof target === 'string') {
    settings.target = target;
    target = null;
  }

  return new API(settings);

};

// Creates a syntax-sugared-method for a given action name.
api.createProxyMethod = function (instance, { firstArgName, method, action }) {
  if (!firstArgName) {
    return function ({ success, error, dataExtent, data={} }) {
      Object.assign(data, dataExtent);
      instance.send(method, { action, data, success, error });
    };
  } else {
    return function (arg, { success, error, dataExtent, data={} }) {
      Object.assign(data, dataExtent);
      data[firstArgName] = arg;
      instance.send(method, { action, data, success, error });
    };
  }
};

class API {

  constructor (settings) {
    this.settings = {};
    Object.assign(this.settings, defaults, settings);
    this.renderURL = api.precompileURL(this.settings);
  }

  send (method='GET', { action=null, data={}, format=this.settings.format, success=()=>null, error=()=>null }) {

    var { headers, query } = this.extendWithToken({ headers, query });

    var contentType,
        processData;

    // File uploading preparations.
    if (data instanceof FormData) {
      contentType = false;
      processData = false;
    } else {
      data = (method === 'GET') ? data : JSON.stringify(data);
      contentType = api.getContentType(format);
      processData = true;
    }

    $.ajax({
      url: this.renderURL(action) + API.param('?', query),
      method,
      headers,
      dataType: format,
      contentType,
      processData,
      data,
      success,
      error (err) {
        // TODO : Add logging.
        try {
          err = JSON.parse(err.responseText);
        } catch (e) {
          // TODO : Add logging here too.
        }
        error(err.error);
      }
    });
  }

  get (options) {
    this.send('GET', options);
  }

  post (options) {
    this.send('POST', options);
  }

  extendWithToken ({ headers={}, query={} }) {

    var process = this.settings.tokenProcess,
        token = user.get('token'),
        result = {
          headers,
          query
        };

    if (token) {

      if (process === 'header' || process === 'both') {
        result.headers[authAlias.tokenHeader] = token;
      }

      if (process === 'query' || process === 'both') {
        result.query[authAlias.token] = token;
      }

    }

    return result;

  }

  static param (string, queryObj) {

    if (typeof string !== 'string') {
      queryObj = string;
      string = '';
    }

    if (!Object.keys(queryObj).length) return '';

    for (let key in queryObj) {
      if (queryObj.hasOwnProperty(key)) {
        string += key + '=';
        string += queryObj[key] + '&';
      }
    }

    return string.slice(0, -1);

  }

}

api.setup(config);