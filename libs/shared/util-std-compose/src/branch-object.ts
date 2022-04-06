export const branchObject =
  <Input, Result>(fnObject: {
    [K in keyof Result]: (input: Input) => Result[K];
  }) =>
  (input: Input): Result =>
    Object.fromEntries(
      Object.entries(fnObject).map(([key, val]) => [key, (val as (input: Input) => unknown)(input)])
    ) as unknown as Result; // These object methods aren't great in TS so I'm just coercing it.
