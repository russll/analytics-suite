import { api } from './../api.js';

var instance = api.create('analytics/bas-cashflow');

export var basCashflow = {};

basCashflow.getDashboard = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'dashboard',
});

basCashflow.getClients = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'clients',
});

basCashflow.getClient = api.createProxyMethod(instance, {
  firstArg: 'clientId',
  method: 'GET',
  action: 'clients',
});

basCashflow.getClientTaxes = api.createProxyMethod(instance, {
  firstArg: 'clientId',
  method: 'GET',
  action: 'clients/taxes',
});
