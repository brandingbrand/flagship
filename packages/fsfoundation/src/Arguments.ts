/**
 * Extracts the types of a given function's arguments
 *
 * Example:
 * type MyFunction = (arg1: string, arg2: number) => void;
 * type Args = Arguments<MyFunction>; // Args is [string, number]
 *
 */
export type Arguments<F extends Function> = F extends (...args: infer A) => any ? A : never;
