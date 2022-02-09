import { Branded, makeBranding } from '@brandingbrand/standard-branded';

export type Ok<T> = Branded<{ ok: T }, 'ok'>;
export type Failure<T> = Branded<{ failure: T }, 'failure'>;

export type Result<OkType, FailureType> = Ok<OkType> | Failure<FailureType>;

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
