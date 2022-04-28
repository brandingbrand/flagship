export const applyParamAsync =
  <Params extends unknown[]>(...params: Params) =>
  async <Output>(fnToApply: (...params: Params) => Promise<Output>): Promise<Output> =>
    fnToApply(...params);
