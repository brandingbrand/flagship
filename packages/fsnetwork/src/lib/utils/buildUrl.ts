import {forEach, isArray, isDate, isObject} from 'lodash-es';

const isURLSearchParams = (val: any) => {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
};

const encode = (val: string) => {
  return encodeURIComponent(val).
  replace(/%40/gi, '@').
  replace(/%3A/gi, ':').
  replace(/%24/g, '$').
  replace(/%2C/gi, ',').
  replace(/%20/g, '+').
  replace(/%5B/gi, '[').
  replace(/%5D/gi, ']');
};

const parseValue = (parts: string[], key: any) => (value: any) => {
  if (isDate(value)) {
    value = value.toISOString();
  } else if (isObject(value)) {
    value = JSON.stringify(value);
  }
  parts.push(encode(key) + '=' + encode(value));
};

const serialize = (parts: string[]) => (value: any, key: any) => {
  if (!value) {
    return;
  }

  if (isArray(value)) {
    key = key + '[]';
  } else {
    value = [value];
  }

  forEach(value, parseValue(parts, key));
};

export const buildURL = (
  url: string,
  params: any,
  paramsSerializer?: (params: any) => string
) => {
  if (!params) {
    return url;
  }

  const parts: string[] = [];

  let serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    forEach(params, serialize(parts));
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

