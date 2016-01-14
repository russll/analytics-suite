import { api } from './../api.js';

var instance = api.create('analytics/bas-loaners');

export var basLoaners = {};

basLoaners.getDashboard = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'dashboard',
});

basLoaners.getDetails = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'details',
});

basLoaners.upload = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'upload',
});
