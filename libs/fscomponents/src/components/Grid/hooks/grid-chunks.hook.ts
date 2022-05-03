import { useMemo } from 'react';

import {
  ChunkOptions,
  gridChunk,
  gridInsert,
  gridSize,
  InsertOptions,
  SizeOptions,
} from '../utils';

export const useGridChunks = <T, E = undefined>(
  iterator: Iterable<T>,
  columns: number,
  options?: ChunkOptions<T, E> & InsertOptions<T> & SizeOptions
) => {
  return useMemo(() => {
    const iteratorWithInsertions = gridInsert(iterator, options);
    const iteratorWithSizes = gridSize(iteratorWithInsertions, options);
    return gridChunk(iteratorWithSizes, columns, options);
  }, [iterator, columns, options]);
};
