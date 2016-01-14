var setName = 'user_service';
var storage = JSON.parse(localStorage.getItem(setName)) || {};

const methods = {};

methods.get = function (key) {
  if (!key) {
    return methods.getAll();
  } else if (key.indexOf(' ') >= 0) {
    return methods.getSome(key.split(' '));
  } else if (typeof storage[key] !== 'object') {
    return storage[key];
  } else {
    return Object.assign({}, storage[key]);
  }
};

// Called via user.get('field1 field2 avatar'); - fields separated with space.
methods.getSome = function (keys) {
  let result = {};
  for (let i = 0; i < keys.length; i++) {
    if (storage[keys[i]]) {
      result[keys[i]] = methods.get(keys[i]);
    } else {
      // Don't return any data if some are missing.
      return null;
    }
  }
  return result;
};

methods.getAll = function () {
  return Object.assign({}, storage);
};

methods.set = function (key, value) {
  storage[key] = value;
  localStorage.setItem(setName, JSON.stringify(storage));
};

methods.setAll = function (source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      storage[key] = source[key];
    }
  }
  localStorage.setItem(setName, JSON.stringify(storage));
};

methods.forget = function () {
  storage = {};
  localStorage.setItem(setName, JSON.stringify(storage));
};

export default methods;
