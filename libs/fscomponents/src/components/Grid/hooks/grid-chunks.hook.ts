import { useMemo } from 'react';

import type { ChunkOptions, InsertOptions, SizeOptions } from '../utils';
import { gridChunk, gridInsert, gridSize } from '../utils';

export const useGridChunks = <T, E = undefined>(
  iterator: Iterable<T>,
  columns: number,
  options?: ChunkOptions<T, E> & InsertOptions<T> & SizeOptions
) =>
  useMemo(() => {
    const iteratorWithInsertions = gridInsert(iterator, options);
    const iteratorWithSizes = gridSize(iteratorWithInsertions, options);
    return gridChunk(iteratorWithSizes, columns, options);
  }, [iterator, columns, options]);
