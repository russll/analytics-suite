import { api } from './../api.js';

var instance = api.create('analytics/bas-incomeexpenses');

export var basIncomeExpenses = {};

basIncomeExpenses.getDashboard = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'dashboard',
});
