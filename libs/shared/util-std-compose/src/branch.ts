export function branch<Input, FnResult1>(
  fn1: (input: Input) => FnResult1
): (input: Input) => [FnResult1];
export function branch<Input, FnResult1, FnResult2>(
  fn1: (input: Input) => FnResult1,
  fn2: (input: Input) => FnResult2
): (input: Input) => [FnResult1, FnResult2];
export function branch<Input, FnResult1, FnResult2, FnResult3>(
  fn1: (input: Input) => FnResult1,
  fn2: (input: Input) => FnResult2,
  fn3: (input: Input) => FnResult3
): (input: Input) => [FnResult1, FnResult2, FnResult3];
export function branch<Input, FnResult1, FnResult2, FnResult3, FnResult4>(
  fn1: (input: Input) => FnResult1,
  fn2: (input: Input) => FnResult2,
  fn3: (input: Input) => FnResult3,
  fn4: (input: Input) => FnResult4
): (input: Input) => [FnResult1, FnResult2, FnResult3, FnResult4];
export function branch<Input, FnResult1, FnResult2, FnResult3, FnResult4, FnResult5>(
  fn1: (input: Input) => FnResult1,
  fn2: (input: Input) => FnResult2,
  fn3: (input: Input) => FnResult3,
  fn4: (input: Input) => FnResult4,
  fn5: (input: Input) => FnResult5
): (input: Input) => [FnResult1, FnResult2, FnResult3, FnResult4, FnResult5];
export function branch<Input, FnResult1, FnResult2, FnResult3, FnResult4, FnResult5, FnResult6>(
  fn1: (input: Input) => FnResult1,
  fn2: (input: Input) => FnResult2,
  fn3: (input: Input) => FnResult3,
  fn4: (input: Input) => FnResult4,
  fn5: (input: Input) => FnResult5,
  fn6: (input: Input) => FnResult6
): (input: Input) => [FnResult1, FnResult2, FnResult3, FnResult4, FnResult5, FnResult6];
/**
 *
 * @param fns
 */
export function branch<Input>(...fns: Array<(input: Input) => unknown>) {
  return (input: Input) => fns.map((fn) => fn(input));
}
