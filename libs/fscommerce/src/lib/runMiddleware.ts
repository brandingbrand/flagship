import { isArray, isFunction } from 'lodash-es';

/**
 * Type representing a middleware function that accepts original and normalized data
 * and returns manipulated normalized data.
 *
 * @typedef {function} MiddlewareFunction
 * @param {Object} data - The raw response from the request
 * @param {Object} normalized - The normalized data from the response
 * @returns {Object} Normalized data containing additional manipulations
 */
export type MiddlewareFunction = (data: object, normalized: object) => any;

async function runMiddleware(
  data: object,
  normalized: object,
  middleware: MiddlewareFunction | MiddlewareFunction[]
): Promise<any> {
  if (middleware) {
    if (isMiddlewareArray(middleware)) {
      for (const fn of middleware) {
        if (isFunction(fn)) {
          normalized = await fn(data, normalized);
        } else {
          throw new Error('Middleware value must be a function');
        }
      }
    } else if (isFunction(middleware)) {
      normalized = await middleware(data, normalized);
    } else {
      throw new Error('Middleware must be a function or array of functions');
    }
  }
  return normalized;
}

function isMiddlewareArray(
  middleware: MiddlewareFunction | MiddlewareFunction[]
): middleware is MiddlewareFunction[] {
  return isArray(<MiddlewareFunction[]>middleware);
}

export default runMiddleware;
