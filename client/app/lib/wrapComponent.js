/**
 * Wraps a Component instance so the default methods can be changed in it.
 * React Components don't allow to change methods in them.
 */

export default function (instance, changes) {

  let result = {};

  for (let key in instance) {
    result[key] = instance[key];
  }

  for (let key in changes) {
    result[key] = changes[key];
  }

  return result;

}
