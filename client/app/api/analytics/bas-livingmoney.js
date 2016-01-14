import { api } from './../api.js';

var instance = api.create('analytics/bas-livingmoney');

export var basLivingMoney = {};

basLivingMoney.getDashboard = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'dashboard',
});

basLivingMoney.getFundsOnCorrespondedAccounts = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'funds-on-correspondent-account-in-other-banks',
});

basLivingMoney.getInterbankLending = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'interbank-lending',
});

basLivingMoney.getSecurities = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'securities',
});

basLivingMoney.upload = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'upload',
});
