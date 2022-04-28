export const flatMapAsync =
  <Input, Output>(flatMapFn: (input: Input) => Promise<Output>) =>
  async (input: Promise<Input>): Promise<Output> =>
    input.then(flatMapFn);
