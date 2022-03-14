import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';

import { unique, without } from '@brandingbrand/standard-array';
import { isPlainObject } from '@brandingbrand/standard-object';

export const indexes = (array: unknown[]) => {
  return Object.keys(array).map(Number);
};

export const keys = <T>(obj: T): (keyof T)[] => {
  if (isPlainObject(obj)) {
    return Object.keys(obj) as (keyof T)[];
  } else {
    return [];
  }
};

export const allUniqueKeys = <T>(arr: T[]): T extends any[] ? number[] : (keyof T)[] =>
  unique(
    arr.flatMap<keyof T | number>((object) =>
      Array.isArray(object) ? indexes(object) : keys(object)
    )
  ) as T extends any[] ? number[] : (keyof T)[];

export const withoutArray = <T>(arr: T[], ...rest: T[][]) => without(arr, ...rest.flat());

export const getValues = <T>(schemas: T[], key: keyof T) => {
  return schemas.map((schema) => (typeof schema === 'object' ? schema[key] : undefined));
};

export const notUndefined = <T>(val: T | undefined): val is T => val !== undefined;
export const isSchema = (val: unknown): val is JSONSchema7 => typeof val === 'object';

export const isSchemaDefinition = (val: unknown): val is JSONSchema7Definition =>
  isPlainObject(val) || val === true || val === false;

export const isEmptySchema = (obj: unknown) =>
  !keys(obj).length &&
  !(Array.isArray(obj) ? indexes(obj).length : false) &&
  obj !== false &&
  obj !== true;

export const isFalse = (val: unknown): val is false => val === false;
export const isTrue = (val: unknown): val is true => val === true;

export const stringArray = (values: string[][]) => unique(values.flat()).sort();

export const deleteUndefinedProperties = (returnObject: JSONSchema7) => {
  // cleanup empty
  for (const property of Object.keys(returnObject) as (keyof JSONSchema7)[]) {
    if (returnObject.hasOwnProperty(property) && isEmptySchema(returnObject[property])) {
      delete returnObject[property];
    }
  }

  return returnObject;
};
