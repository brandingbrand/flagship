import type { OperatorFunction } from 'rxjs';
import { scan, shareReplay } from 'rxjs/operators';

export const accumulateToArray =
  <Type>(): OperatorFunction<Type, Type[]> =>
  (input) =>
    input.pipe(
      scan((acc, curr) => [...acc, curr], [] as Type[]),
      shareReplay(1)
    );
