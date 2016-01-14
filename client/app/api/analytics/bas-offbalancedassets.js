import { api } from './../api.js';

var instance = api.create('analytics/bas-offbalancedassets');

export var basOffbalancedAssets = {};

basOffbalancedAssets.getDashboard = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'dashboard',
});

basOffbalancedAssets.upload = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'upload',
});
