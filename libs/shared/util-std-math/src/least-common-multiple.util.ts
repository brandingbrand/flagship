// CREDIT: https://github.com/compute-io/lcm
// MIT

import { isIntegerArray } from '@brandingbrand/standard-array';
import { greatestCommonDivisor } from './greatest-common-divisor.util';

/**
 * Computes the least common multiple (lcm).
 *
 * @param numbers - input array of integers
 * @returns least common multiple or null
 */
// eslint-disable-next-line complexity
export const leastCommonMultiple = (...numbers: [number, number, ...number[]]): number => {
  let a: number;
  let b: number;
  let i: number;

  if (!isIntegerArray(numbers)) {
    throw new TypeError(
      `${leastCommonMultiple.name}()::invalid input argument. Must provide an array of integers. Value: ${numbers}.`
    );
  }

  // Check if a sufficient number of values have been provided...
  if (numbers.length < 2) {
    throw new TypeError(
      `${leastCommonMultiple.name}()::invalid input argument. Must provide at least two integers. Value: ${numbers}.`
    );
  }

  // Have we been provided with integer arguments?
  if (numbers.length === 2) {
    a = numbers[0];
    b = numbers[1];
    if (a < 0) {
      a = -a;
    }
    if (b < 0) {
      b = -b;
    }
    if (a === 0 || b === 0) {
      return 0;
    }

    return (a / greatestCommonDivisor(a, b)) * b;
  }

  // Convert any negative integers to positive integers...
  for (i = 0; i < numbers.length; i++) {
    a = numbers[i];
    if (a < 0) {
      numbers[i] = -a;
    }
  }

  // Exploit the fact that the lcm is an associative function...
  a = numbers[0];
  for (i = 1; i < numbers.length; i++) {
    b = numbers[i];
    if (a === 0 || b === 0) {
      return 0;
    }
    a = (a / greatestCommonDivisor(a, b)) * b;
  }

  return a;
};
