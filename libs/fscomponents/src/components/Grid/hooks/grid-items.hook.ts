import { useMemo } from 'react';

import { DEFAULT_KEY_EXTRACTOR } from '../defaults';
import type { ChunkOptions, InsertOptions, KeysOptions, SizeOptions } from '../utils';
import { gridInsert, gridKeys, gridSize, makeGridItem } from '../utils';

export const useGridItems = <T, E = undefined>(
  iterator: Iterable<T>,
  options?: ChunkOptions<T, E> & InsertOptions<T> & KeysOptions & SizeOptions
) =>
  useMemo(() => {
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
