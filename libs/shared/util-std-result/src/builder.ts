import { pipe } from '@brandingbrand/standard-compose';
import { mapOk } from './map';
import { flatMap } from './flat-map';
import { Ok, ok, Result } from './result';

export const build: Ok<{}> = ok({});

export const affixTo =
  <Key extends string>(key: Key) =>
  <OkType, FailureType>(
    input: Result<OkType, FailureType>
  ): Result<{ [K in Key]: OkType }, FailureType> =>
    pipe(
      input,
      // TS doesn't want to infer this properly.
      mapOk((value) => ({ [key]: value } as any))
    );

export const adjoin =
  <InputOkType, NewOkType, Key extends string, FailureType>(
    key: Exclude<Key, keyof InputOkType>,
    newValue: Result<NewOkType, FailureType>
  ) =>
  (
    input: Result<InputOkType, FailureType>
  ): Result<
    { [K in Key | keyof InputOkType]: K extends keyof InputOkType ? InputOkType[K] : NewOkType },
    FailureType
  > =>
    pipe(
      input,
      flatMap((unwrappedInput) =>
        pipe(
          newValue,
          // TS doesn't want to infer this properly.
          mapOk((unwrappedNewValue) => ({ ...unwrappedInput, [key]: unwrappedNewValue } as any))
        )
      )
    );

export const flatMapAndAdjoin =
  <InputOkType, NewOkType, Key extends string, FailureType>(
    key: Exclude<Key, keyof InputOkType>,
    flatMapFn: (input: InputOkType) => Result<NewOkType, FailureType>
  ) =>
  (
    input: Result<InputOkType, FailureType>
  ): Result<
    { [K in Key | keyof InputOkType]: K extends keyof InputOkType ? InputOkType[K] : NewOkType },
    FailureType
  > =>
    pipe(
      input,
      flatMap((unwrappedInput) =>
        pipe(
          flatMapFn(unwrappedInput),
          // TS doesn't want to infer this properly.
          mapOk((flatMapResult) => ({ ...unwrappedInput, [key]: flatMapResult } as any))
        )
      )
    );
