export const chunk =
  (chunkSize: number) =>
  <Element>(input: Element[]): Element[][] => {
    const resultLength = chunkSize ? Math.ceil(input.length / chunkSize) : 1;
    return [...new Array(resultLength)].map((_element, index) =>
      input.slice(index, index + chunkSize)
    );
  };
