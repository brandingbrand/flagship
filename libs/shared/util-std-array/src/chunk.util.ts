export const chunk =
  (chunkSize: number) =>
  <Element>(input: Element[]): Element[][] => {
    const resultLength = chunkSize ? Math.ceil(input.length / chunkSize) : 1;
    return [...new Array(resultLength)].map((_element, index) => {
      const mappedIndex = index * chunkSize;
      return input.slice(mappedIndex, mappedIndex + chunkSize);
    });
  };
