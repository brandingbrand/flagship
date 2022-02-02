// Need a better long-term solution, but for now we can get rid of fp-ts as a dependency

export interface Left<T> {
  _tag: 'Left';
  left: T;
}

export interface Right<T> {
  _tag: 'Right';
  right: T;
}

export type Either<LeftType, RightType> = Left<LeftType> | Right<RightType>;

export const left = <T>(value: T): Left<T> => ({ _tag: 'Left', left: value });
export const right = <T>(value: T): Right<T> => ({ _tag: 'Right', right: value });

export const isLeft = <LeftType, RightType>(
  value: Either<LeftType, RightType>
): value is Left<LeftType> => value._tag === 'Left';
export const isRight = <LeftType, RightType>(
  value: Either<LeftType, RightType>
): value is Right<RightType> => value._tag === 'Right';
