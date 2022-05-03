import { gridSize } from './grid-size.util';

describe('gridSize', () => {
  it('turns every item into a grid item', () => {
    const iterator = gridSize([1, 2, 3, 4]);
    const items = Array.from(iterator);
    expect(items).toStrictEqual([
      expect.objectContaining({ value: 1, width: 1 }),
      expect.objectContaining({ value: 2, width: 1 }),
      expect.objectContaining({ value: 3, width: 1 }),
      expect.objectContaining({ value: 4, width: 1 }),
    ]);
  });

  it('sets items to a specific width by index', () => {
    const iterator = gridSize([1, 2, 3, 4], { widthTable: { '0': 2, '2': 3 } });
    const items = Array.from(iterator);
    expect(items).toStrictEqual([
      expect.objectContaining({ value: 1, width: 2 }),
      expect.objectContaining({ value: 2, width: 1 }),
      expect.objectContaining({ value: 3, width: 3 }),
      expect.objectContaining({ value: 4, width: 1 }),
    ]);
  });
});
