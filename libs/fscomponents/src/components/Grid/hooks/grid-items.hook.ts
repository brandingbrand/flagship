import { useMemo } from 'react';
import { DEFAULT_KEY_EXTRACTOR } from '../defaults';
import {
  ChunkOptions,
  gridInsert,
  gridSize,
  InsertOptions,
  makeGridItem,
  SizeOptions,
  gridKeys,
  KeysOptions,
} from '../utils';

export const useGridItems = <T, E = undefined>(
  iterator: Iterable<T>,
  options?: ChunkOptions<T, E> & InsertOptions<T> & SizeOptions & KeysOptions
) => {
  return useMemo(() => {
    const iteratorWithInsertions = gridInsert(iterator, options);
    const iteratorWithSizes = gridSize(iteratorWithInsertions, options);
    const iteratorWithKeys = gridKeys(iteratorWithSizes, options);

    const rowIteratorWithKeys = Object.entries(options?.insertRows ?? {}).map(
      ([row, rowItem], index) => {
        const item = makeGridItem(rowItem);
        item.key = (options?.keyExtractor ?? DEFAULT_KEY_EXTRACTOR)([item], index);
        return [row, item] as const;
      }
    );

    return {
      iterator: iteratorWithKeys,
      rowIterator: rowIteratorWithKeys,
    };
  }, [iterator, options]);
};
