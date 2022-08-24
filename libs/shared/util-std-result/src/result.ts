import type { Branded } from '@brandingbrand/standard-branded';
import { makeBranding } from '@brandingbrand/standard-branded';

export type Ok<T> = Branded<{ ok: T }, 'ok'>;
export type Failure<T> = Branded<{ failure: T }, 'failure'>;

export type Result<OkType, FailureType> = Failure<FailureType> | Ok<OkType>;

export type ExtractFailure<T extends Result<unknown, unknown>> = T extends Failure<
  infer FailureType
>
  ? FailureType
  : never;

export type ExtractOk<T extends Result<unknown, unknown>> = T extends Ok<infer OkType>
  ? OkType
  : never;

const okBrand = makeBranding('ok');
const failureBrand = makeBranding('failure');

export const ok = <T>(input: T): Ok<T> => okBrand.brand({ ok: input });
export const fail = <T>(input: T): Failure<T> => failureBrand.brand({ failure: input });

export const isOk = <OkType, FailureType>(
  input: Result<OkType, FailureType>
): input is Ok<OkType> => okBrand.isBrand(input);

export const isFailure = <OkType, FailureType>(
  input: Result<OkType, FailureType>
): input is Failure<FailureType> => failureBrand.isBrand(input);

export const isResult = <OkType, FailureType>(
  input: unknown
): input is Result<OkType, FailureType> =>
  typeof input === 'object' &&
  !Array.isArray(input) &&
  (isFailure(input as Failure<FailureType>) || isOk(input as Ok<OkType>));
