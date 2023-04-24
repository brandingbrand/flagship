import fse from "fs-extra";

import { enqueue } from "./queue";

/**
 * Returns a proxied version of the given target object or function.
 *
 * @param {*} target - The target object or function to proxy.
 * @returns {*} The proxied version of the target.
 */
const proxy = (target: any) => {
  if (typeof target === "object") {
    return new Proxy(target, handler);
  }
  return typeof target === "function" ? new Proxy(target, handler) : target;
};

/**
 * The handler object that defines the behavior of the proxy.
 */
const handler = {
  /**
   * The get() method of the handler object.
   *
   * @param {*} target - The target object being accessed.
   * @param {string} property - The name of the property being accessed.
   * @returns {*} The proxied version of the property.
   */
  get: (target: any, property: any): any => {
    return proxy(target[property]);
  },
  /**
   * The apply() method of the handler object.
   *
   * @param {*} target - The target function being called.
   * @param {*} thisArgument - The value of `this` inside the target function.
   * @param {Array} argumentsList - The arguments passed to the target function.
   * @returns {*} The result of calling the target function with the given arguments, enqueued for asynchronous execution.
   */
  apply: (target: any, thisArgument: any, argumentsList: any): any => {
    return enqueue(Reflect.apply, target, thisArgument, argumentsList);
  },
};

/**
 * A proxied version of the fs-extra module.
 *
 * @type {*} The proxied version of the fs-extra module.
 */
export default proxy(fse) as typeof fse;
