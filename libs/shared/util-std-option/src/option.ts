import { Branded, makeBranding } from '@brandingbrand/standard-branded';

export type Some<T> = Branded<
  {
    value: T;
  },
  'some'
>;

export type None = Branded<{}, 'none'>;

export type Option<T> = Some<T> | None;

const brandSome = makeBranding('some');
const brandNone = makeBranding('none');

export const some = <T>(input: T): Some<T> => brandSome.brand({ value: input });

export const none: None = brandNone.brand({});

export const isSome = <T>(input: Option<T>): input is Some<T> => brandSome.isBrand(input);

export const isNone = <T>(input: Option<T>): input is None => brandNone.isBrand(input);
