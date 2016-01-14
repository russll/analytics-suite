import { api } from './../api.js';

var instance = api.create('rbs/auth');

export var auth = {};

auth.authorize = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'authorization',
});

auth.verify = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'verification',
});
