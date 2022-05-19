import { gridChunk } from './grid-chunks.util';

describe('gridChunk', () => {
  it('should produce a row for each item when there is a single column', () => {
    const rows = gridChunk([1, 2, 3], 1, {});

    expect([...rows]).toHaveLength(3);
  });

  it('should default to one cell per item', () => {
    const rows = gridChunk([1, 2, 3], 3, {});

    expect([...rows]).toHaveLength(1);
  });

  it('should ignore empty cells when auto fit is specified', () => {
    const rows = gridChunk([1, 2, 3], 4, { autoFit: true });

    expect([...rows][0]).toHaveLength(3);
  });
});
