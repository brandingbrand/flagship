/* eslint-disable @typescript-eslint/no-explicit-any */

import fse from "fs-extra";

import { enqueue } from "./queue";

const proxy = (target: any) => {
  if (typeof target === "object") {
    return new Proxy(target, handler);
  }
  return typeof target === "function" ? new Proxy(target, handler) : target;
};

const handler = {
  get: (target: any, property: any): any => {
    return proxy(target[property]);
  },
  apply: (target: any, thisArgument: any, argumentsList: any): any => {
    return enqueue(Reflect.apply, target, thisArgument, argumentsList);
  },
};

export default proxy(fse) as typeof fse;
