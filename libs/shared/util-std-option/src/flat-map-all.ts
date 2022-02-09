import { isSome, none, Option } from './option';

export function flatMapAll<A, Value>(
  inputA: Option<A>,
  handler: (inputA: A) => Option<Value>
): Option<Value>;
export function flatMapAll<A, B, Value>(
  inputA: Option<A>,
  inputB: Option<B>,
  handler: (inputA: A, inputB: B) => Option<Value>
): Option<Value>;
export function flatMapAll<A, B, C, Value>(
  inputA: Option<A>,
  inputB: Option<B>,
  inputC: Option<C>,
  handler: (inputA: A, inputB: B, inputC: C) => Option<Value>
): Option<Value>;
export function flatMapAll<A, B, C, D, Value>(
  inputA: Option<A>,
  inputB: Option<B>,
  inputC: Option<C>,
  inputD: Option<D>,
  handler: (inputA: A, inputB: B, inputC: C, inputD: D) => Option<Value>
): Option<Value>;
export function flatMapAll<A, B, C, D, E, Value>(
  inputA: Option<A>,
  inputB: Option<B>,
  inputC: Option<C>,
  inputD: Option<D>,
  inputE: Option<E>,
  handler: (inputA: A, inputB: B, inputC: C, inputD: D, inputE: E) => Option<Value>
): Option<Value>;
export function flatMapAll<Value>(...params: any[]): Option<Value> {
  const handler = params.pop();
  if (params.every(isSome)) {
    return handler(...params.map((param) => param.value));
  }
  return none;
}
