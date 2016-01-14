import { api } from 'app/api/api.js';

const instance = api.create('analytics/admin');

export var admin = {};

admin.getUsers = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'users'
});

admin.getUser = api.createProxyMethod(instance, {
  method: 'GET',
  action: 'user'
});

admin.addUser = api.createProxyMethod(instance, {
  method: 'POST',
  action: 'users'
});

admin.patchUser = api.createProxyMethod(instance, {
 method: 'PATCH',
 action: 'user'
});

admin.deleteUser = api.createProxyMethod(instance, {
 method: 'DELETE',
 action: 'user'
});

admin.getLogs = api.createProxyMethod(instance, {
 method: 'GET',
 action: 'logs'
});