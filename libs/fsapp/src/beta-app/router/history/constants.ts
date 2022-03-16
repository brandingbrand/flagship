export const NO_NAVIGATOR_CONTEXT_ERROR =
  'No NavigatorContext found, are you in a NavigatorProvider context?';

export let ROOT_STACK = 'ROOT';

/**
 * Changed by legacy shim
 *
 * @internal
 * @deprecated
 */
export const setRootStackId = (id?: string) => {
  ROOT_STACK = id ?? 'ROOT';
};

/**
 * legacy shim
 *
 * @internal
 * @deprecated
 */
export let ROOT_STACK_OPTIONS: object = {};

export const setRootStackOptions = (options?: object) => {
  ROOT_STACK_OPTIONS = options ?? {};
};
