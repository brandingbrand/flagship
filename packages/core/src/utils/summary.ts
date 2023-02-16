import { Items } from "../types/Summary";

export const items: Items[] = [];

export const withSummary =
  <TFunc, TArgs extends unknown[]>(
    fn: (...args: TArgs) => Promise<TFunc>,
    name: string,
    hook: string
  ) =>
  async (...args: TArgs) => {
    const start = performance.now();
    try {
      await fn(...args);

      items.push({
        name,
        hook,
        time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
        success: true,
        error: false,
        errorMessage: "",
      });
    } catch (error: any) {
      items.push({
        name,
        hook,
        time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
        success: false,
        error: true,
        errorMessage: error.stack ?? error.message ?? error,
      });
    }
  };
