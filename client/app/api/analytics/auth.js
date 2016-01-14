import { api } from 'app/api/api.js';
import user from 'app/services/user.js';

import alias from '../auth.json';

const instance = api.create('analytics/auth');

export var auth = {};

/* Basic authorization with login and password */
const authorize = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'authorization',
});

auth.authorize = function({ data, success, error }) {
  authorize({
    data,
    success(res) {
      user.set('id', res.data[alias.id]);
      user.set('token', res.data.token); // Special 2-minute authentication token.
      success(res);
    },
    error,
  });
};

/* Verification with a code from SMS */
const verify = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'verification',
});

auth.verify = function({ data, success, error }) {
  data[alias.id] = user.get('id');
  verify({
    data,
    success(res) {
      user.set('token', res.data.token);
      success(res);
    },
    error,
  });
};

/* Session termination */
const logout = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'logout',
});

auth.logout = function() {

  let callback = function() {
    user.forget();
    location.href = '/'; // FIXME : Поменять структуру роутера. Он не должен быть в if'е и callback'е.
  };

  logout({
    success: callback,
    error: callback, // TODO : Consider that behaviour.
  });

};

/* Check if user is still logged in */
const actualize = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'actualization',
});

auth.actualize = function(callback) {
  if (!user.get('id') || !user.get('token')) {
    callback(false);
  } else {
    actualize({
      success() {
        callback(true);
      },
      error() {
        callback(false);
      },
    });
  }
};

const detail = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'user/detail',
});

auth.detail = function(id, callback) {
  detail({
    data: { userId: id },
    success(res) {
      user.setAll(res.data);
      callback(res);
    },
    error() {
      callback({});
    },
  });
};

auth.uploadAvatar = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'user/upload/mugshot',
});
