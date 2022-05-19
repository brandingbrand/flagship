import { gridInsert } from './grid-insert.util';

describe('chunkGrid', () => {
  describe('insertEvery', () => {
    describe('frequency 1', () => {
      it('should insert values every other item starting with the second item', () => {
        const iterator = gridInsert([1, 2, 3], { insertEvery: { frequency: 1, values: 99 } });
        const items = [...iterator];

        expect(items).toStrictEqual([1, 99, 2, 99, 3, 99]);
      });
    });

    describe('frequency 3', () => {
      it('should insert values after every third item starting with the forth item', () => {
        const iterator = gridInsert([1, 2, 3, 4, 5, 6, 7, 8, 9], {
          insertEvery: { frequency: 3, values: 99 },
        });
        const items = [...iterator];

        expect(items).toStrictEqual([1, 2, 3, 99, 4, 5, 6, 99, 7, 8, 9, 99]);
      });
    });
  });
});
