import {useContext} from 'react';

import {ModalContext} from '../context';

import {useComponentId} from './useComponentId';

/**
 * Hook to interact with a modal's state within the context of a `ModalContext.Provider`.
 * Provides access to the modal's data and functions to resolve or reject the modal.
 *
 * @template T - The type of the data passed to the modal.
 * @template U - The type of the result returned when the modal is resolved.
 *
 * @throws {Error} If the hook is used outside of a `ModalContext.Provider`.
 *
 * @returns {{ resolve: (result: U) => void; reject: () => void }} An object containing the modal's data, a `resolve` function to return a result, and a `reject` function to close the modal without returning a result.
 *
 * @example
 * ```typescript
 * // Using useModal in a component
 * const { resolve, reject } = useModal<MyDataType, MyResultType>();
 *
 * // Resolve the modal with a result
 * const handleConfirm = () => {
 *   resolve({ success: true });
 * };
 *
 * // Reject the modal without returning a result
 * const handleCancel = () => {
 *   reject();
 * };
 * ```
 */
export function useModal<T, U>() {
  // Access the current modal state from the ModalContext
  const state = useContext(ModalContext);

  // Get the unique component ID of the modal
  const componentId = useComponentId();

  // Ensure the hook is used within a ModalContext.Provider
  if (!state) {
    throw new Error('useModal must be used inside a ModalContext.Provider');
  }

  return {
    // A function to resolve the modal with a result of type U
    resolve: state.resolve(componentId) as (result: U) => void,

    // A function to reject the modal, closing it without returning a result
    reject: state.reject(componentId) as () => void,
  };
}
