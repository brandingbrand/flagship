/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
import merge from 'deep-assign';

const mergeLocalStorageItem = function mergeLocalStorageItem(key, value) {
  const oldValue = window.localStorage.getItem(key);
  const oldObject = JSON.parse(oldValue);
  const newObject = JSON.parse(value);
  const nextValue = JSON.stringify(merge({}, oldObject, newObject));
  window.localStorage.setItem(key, nextValue);
};

const createPromise = function createPromise(getValue, callback) {
  return new Promise((resolve, reject) => {
    try {
      const value = getValue();

      if (callback) {
        callback(null, value);
      }

      resolve(value);
    } catch (error) {
      if (callback) {
        callback(error);
      }

      reject(error);
    }
  });
};

const createPromiseAll = function createPromiseAll(promises, callback, processResult) {
  return Promise.all(promises).then(
    (result) => {
      const value = processResult ? processResult(result) : null;
      callback && callback(null, value);
      return value;
    },
    (error) => {
      callback && callback(error);
      throw error;
    }
  );
};

const AsyncStorage =
  /* #__PURE__*/
  (function () {
    /**
     *
     */
    function AsyncStorage() {}

    /**
     * Erases *all* AsyncStorage for the domain.
     *
     * @param callback
     */
    AsyncStorage.clear = function clear(callback) {
      return createPromise(() => {
        window.localStorage.clear();
      }, callback);
    };
    /**
     * (stub) Flushes any pending requests using a single batch call to get the data.
     */

    AsyncStorage.flushGetRequests = function flushGetRequests() {};
    /**
     * Gets *all* keys known to the app, for all callers, libraries, etc.
     */

    AsyncStorage.getAllKeys = function getAllKeys(callback) {
      return createPromise(() => {
        const numberOfKeys = window.localStorage.length;
        const keys = [];

        for (let i = 0; i < numberOfKeys; i += 1) {
          const key = window.localStorage.key(i);
          keys.push(key);
        }

        return keys;
      }, callback);
    };
    /**
     * Fetches `key` value.
     */

    AsyncStorage.getItem = function getItem(key, callback) {
      return createPromise(() => window.localStorage.getItem(key), callback);
    };
    /**
     * multiGet resolves to an array of key-value pair arrays that matches the
     * input format of multiSet.
     *
     *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
     */

    AsyncStorage.multiGet = function multiGet(keys, callback) {
      const promises = keys.map((key) => AsyncStorage.getItem(key));

      const processResult = function processResult(result) {
        return result.map((value, i) => [keys[i], value]);
      };

      return createPromiseAll(promises, callback, processResult);
    };
    /**
     * Sets `value` for `key`.
     */

    AsyncStorage.setItem = function setItem(key, value, callback) {
      return createPromise(() => {
        window.localStorage.setItem(key, value);
      }, callback);
    };
    /**
     * Takes an array of key-value array pairs.
     *   multiSet([['k1', 'val1'], ['k2', 'val2']])
     */

    AsyncStorage.multiSet = function multiSet(keyValuePairs, callback) {
      const promises = keyValuePairs.map((item) => AsyncStorage.setItem(item[0], item[1]));
      return createPromiseAll(promises, callback);
    };
    /**
     * Merges existing value with input value, assuming they are stringified JSON.
     */

    AsyncStorage.mergeItem = function mergeItem(key, value, callback) {
      return createPromise(() => {
        mergeLocalStorageItem(key, value);
      }, callback);
    };
    /**
     * Takes an array of key-value array pairs and merges them with existing
     * values, assuming they are stringified JSON.
     *
     *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
     */

    AsyncStorage.multiMerge = function multiMerge(keyValuePairs, callback) {
      const promises = keyValuePairs.map((item) => AsyncStorage.mergeItem(item[0], item[1]));
      return createPromiseAll(promises, callback);
    };
    /**
     * Removes a `key`
     */

    AsyncStorage.removeItem = function removeItem(key, callback) {
      return createPromise(() => window.localStorage.removeItem(key), callback);
    };
    /**
     * Delete all the keys in the `keys` array.
     */

    AsyncStorage.multiRemove = function multiRemove(keys, callback) {
      const promises = keys.map((key) => AsyncStorage.removeItem(key));
      return createPromiseAll(promises, callback);
    };

    return AsyncStorage;
  })();

export { AsyncStorage as default };
