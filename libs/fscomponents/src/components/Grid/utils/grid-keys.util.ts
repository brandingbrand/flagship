import { DEFAULT_KEY_EXTRACTOR } from '../defaults';

import type { GridItem } from './grid.util';

export interface KeysOptions {
  keyExtractor?: <ItemT extends GridItem<{ id?: string; key?: string } | null>>(
    items: ItemT[],
    index: number
  ) => string;
}

/**
 *
 * @param iterator
 * @param options
 */
export function* gridKeys<T>(iterator: Iterable<GridItem<T>>, options?: KeysOptions) {
  const { keyExtractor = DEFAULT_KEY_EXTRACTOR } = options ?? {};

  let iteratorIndex = 0;

  for (const value of iterator) {
    value.key = keyExtractor([value], iteratorIndex);
    yield value;
    iteratorIndex += 1;
  }
}
