export const applyParam =
  <Params extends unknown[]>(...params: Params) =>
  <Output>(fnToApply: (...params: Params) => Output): Output =>
    fnToApply(...params);
