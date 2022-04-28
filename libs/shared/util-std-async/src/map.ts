export const mapAsync =
  <Input, Output>(mapFn: (input: Input) => Output) =>
  async (input: Promise<Input>): Promise<Output> =>
    input.then(mapFn);
