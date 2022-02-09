import { isFailure, Result } from './result';

export function flatMapAll<A, OkType, FailureType>(
  inputA: Result<A, FailureType>,
  handler: (input: A) => Result<OkType, FailureType>
): Result<OkType, FailureType>;
export function flatMapAll<A, B, OkType, FailureType>(
  inputA: Result<A, FailureType>,
  inputB: Result<B, FailureType>,
  handler: (inputA: A, inputB: B) => Result<OkType, FailureType>
): Result<OkType, FailureType>;
export function flatMapAll<A, B, C, OkType, FailureType>(
  inputA: Result<A, FailureType>,
  inputB: Result<B, FailureType>,
  inputC: Result<C, FailureType>,
  handler: (inputA: A, inputB: B, inputC: C) => Result<OkType, FailureType>
): Result<OkType, FailureType>;
export function flatMapAll<A, B, C, D, OkType, FailureType>(
  inputA: Result<A, FailureType>,
  inputB: Result<B, FailureType>,
  inputC: Result<C, FailureType>,
  inputD: Result<D, FailureType>,
  handler: (inputA: A, inputB: B, inputC: C, inputD: D) => Result<OkType, FailureType>
): Result<OkType, FailureType>;
export function flatMapAll<A, B, C, D, E, OkType, FailureType>(
  inputA: Result<A, FailureType>,
  inputB: Result<B, FailureType>,
  inputC: Result<C, FailureType>,
  inputD: Result<D, FailureType>,
  inputE: Result<E, FailureType>,
  handler: (inputA: A, inputB: B, inputC: C, inputD: D, inputE: E) => Result<OkType, FailureType>
): Result<OkType, FailureType>;
export function flatMapAll<OkType, FailureType>(...params: any[]): Result<OkType, FailureType> {
  const handler = params.pop();
  return params.find(isFailure) ?? handler(...params.map((param) => param.ok));
}
