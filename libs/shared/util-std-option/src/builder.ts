import { pipe } from '@brandingbrand/standard-compose';
import { flatMap } from './flat-map';
import { map } from './map';
import { Option, Some, some } from './option';

export const build: Some<{}> = some({});

export const affixTo =
  <Key extends string>(key: Key) =>
  <T>(input: Option<T>): Option<{ [K in Key]: T }> =>
    pipe(
      input,
      // TS doesn't want to infer this properly.
      map((value) => ({ [key]: value } as any))
    );

export const adjoin =
  <InputType, NewType, Key extends string>(
    key: Exclude<Key, keyof InputType>,
    newValue: Option<NewType>
  ) =>
  (
    input: Option<InputType>
  ): Option<{
    [K in Key | keyof InputType]: K extends keyof InputType ? InputType[K] : NewType;
  }> =>
    pipe(
      input,
      flatMap((unwrappedInput) =>
        pipe(
          newValue,
          // TS doesn't want to infer this properly.
          map((unwrappedNewValue) => ({ ...unwrappedInput, [key]: unwrappedNewValue } as any))
        )
      )
    );

export const flatMapAndAdjoin =
  <InputType, NewType, Key extends string>(
    key: Exclude<Key, keyof InputType>,
    flatMapFn: (input: InputType) => Option<NewType>
  ) =>
  (
    input: Option<InputType>
  ): Option<{ [K in Key | keyof InputType]: K extends keyof InputType ? InputType[K] : NewType }> =>
    pipe(
      input,
      flatMap((unwrappedInput) =>
        pipe(
          flatMapFn(unwrappedInput),
          // TS doesn't want to infer this properly.
          map((flatMapResult) => ({ ...unwrappedInput, [key]: flatMapResult } as any))
        )
      )
    );
