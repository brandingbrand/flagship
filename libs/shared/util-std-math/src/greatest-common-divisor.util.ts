// CREDIT: https://github.com/compute-io/gcd
// MIT

import { isIntegerArray } from '@brandingbrand/standard-array';

/**
 * Computes the greatest common divisor of two integers `a` and `b`, using the binary GCD algorithm.
 *
 * @param a - integer
 * @param b - integer
 * @returns greatest common divisor
 */
const _greatestCommonDivisor = (a: number, b: number): number => {
  let k = 1;
  let t: number;

  // Simple cases:
  if (a === 0) {
    return b;
  }

  if (b === 0) {
    return a;
  }

  // Reduce `a` and/or `b` to odd numbers and keep track of the greatest power of 2 dividing both `a` and `b`...
  while (a % 2 === 0 && b % 2 === 0) {
    a = a / 2; // right shift
    b = b / 2; // right shift
    k = k * 2; // left shift
  }

  // Reduce `a` to an odd number...
  while (a % 2 === 0) {
    a = a / 2; // right shift
  }

  // Henceforth, `a` is always odd...
  while (b) {
    // Remove all factors of 2 in `b`, as they are not common...
    while (b % 2 === 0) {
      b = b / 2; // right shift
    }
    // `a` and `b` are both odd. Swap values such that `b` is the larger of the two values, and then set `b` to the difference (which is even)...
    if (a > b) {
      t = b;
      b = a;
      a = t;
    }
    b = b - a; // b=0 iff b=a
  }

  // Restore common factors of 2...
  return k * a;
};

/**
 * Computes the greatest common divisor of two integers `a` and `b`, using the binary GCD algorithm and bitwise operations.
 *
 * @param a - safe integer
 * @param b - safe integer
 * @returns greatest common divisor
 */
const bitwise = (a: number, b: number): number => {
  let k = 0;
  let t;
  // Simple cases:
  if (a === 0) {
    return b;
  }
  if (b === 0) {
    return a;
  }
  // Reduce `a` and/or `b` to odd numbers and keep track of the greatest power of 2 dividing both `a` and `b`...
  while ((a & 1) === 0 && (b & 1) === 0) {
    a >>>= 1; // right shift
    b >>>= 1; // right shift
    k++;
  }
  // Reduce `a` to an odd number...
  while ((a & 1) === 0) {
    a >>>= 1; // right shift
  }
  // Henceforth, `a` is always odd...
  while (b) {
    // Remove all factors of 2 in `b`, as they are not common...
    while ((b & 1) === 0) {
      b >>>= 1; // right shift
    }
    // `a` and `b` are both odd. Swap values such that `b` is the larger of the two values, and then set `b` to the difference (which is even)...
    if (a > b) {
      t = b;
      b = a;
      a = t;
    }
    b = b - a; // b=0 iff b=a
  }
  // Restore common factors of 2...
  return a << k;
};

/**
 * Computes the greatest common divisor.
 *
 * @param numbers - input array of integers
 * @returns greatest common divisor or null
 */
// eslint-disable-next-line complexity
export const greatestCommonDivisor = (...numbers: [number, number, ...number[]]): number => {
  let a: number;
  let b: number;
  let i: number;

  // Have we been provided with integer arguments?
  if (!isIntegerArray(numbers)) {
    throw new TypeError(
      `${greatestCommonDivisor.name}()::invalid input argument. Must provide an array of integers. Value: ${numbers}.`
    );
  }

  // Check if a sufficient number of values have been provided...
  if (numbers.length < 2) {
    throw new TypeError(
      `${greatestCommonDivisor.name}()::invalid input argument. Must provide at least two integers. Value: ${numbers}.`
    );
  }

  if (numbers.length === 2) {
    a = numbers[0];
    b = numbers[1];
    if (a < 0) {
      a = -a;
    }
    if (b < 0) {
      b = -b;
    }
    if (a <= Number.MAX_SAFE_INTEGER && b <= Number.MAX_SAFE_INTEGER) {
      return bitwise(a, b);
    } else {
      return _greatestCommonDivisor(a, b);
    }
  }

  // Convert any negative integers to positive integers...
  for (i = 0; i < numbers.length; i++) {
    a = numbers[i] as number;
    if (a < 0) {
      numbers[i] = -a;
    }
  }

  // Exploit the fact that the gcd is an associative function...
  a = numbers[0];
  for (i = 1; i < numbers.length; i++) {
    b = numbers[i] as number;
    if (b <= Number.MAX_SAFE_INTEGER && a <= Number.MAX_SAFE_INTEGER) {
      a = bitwise(a, b);
    } else {
      a = _greatestCommonDivisor(a, b);
    }
  }

  return a;
};
