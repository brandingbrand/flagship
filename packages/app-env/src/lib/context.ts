import React, {createContext, createElement, useContext, useState} from 'react';

import {DevMenuType} from '../types';

/**
 * A utility function to create a state context with an associated provider.
 *
 * This function generates a context that can be used to share state across
 * multiple components in a React tree. It provides a state provider component
 * and a custom hook for consuming the state. The initial value of the state
 * can be specified at the provider level or can fall back to a default value.
 *
 * @template T - The type of the state value.
 * @param defaultInitialValue - The default initial value for the state when not provided by the provider.
 * @returns A tuple containing:
 * - `useStateContext`: A hook to access the state and its setter.
 * - `StateProvider`: A provider component that supplies the state to its descendants.
 * - `context`: The created React context.
 *
 * @example
 * ```tsx
 * // Create a context with a default value of 0
 * const [useCounterContext, CounterProvider] = createStateContext(0);
 *
 * const CounterDisplay = () => {
 *   const [count, setCount] = useCounterContext();
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   );
 * };
 *
 * const App = () => (
 *   <CounterProvider initialValue={10}>
 *     <CounterDisplay />
 *   </CounterProvider>
 * );
 * ```
 */
export const createStateContext = <T>(defaultInitialValue: T) => {
  // Create a context with a tuple type: [state, setState] or undefined
  const context = createContext<
    [T, React.Dispatch<React.SetStateAction<T>>] | undefined
  >(undefined);

  // A factory function to create the provider component with the given props and children
  const providerFactory = (props: any, children: any) =>
    createElement(context.Provider, props, children);

  /**
   * The provider component that supplies the state context to its children.
   *
   * @param children - The components that will have access to the state context.
   * @param initialValue - An optional initial value for the state.
   */
  const StateProvider = ({
    children,
    initialValue,
  }: {
    children?: React.ReactNode;
    initialValue?: T;
  }) => {
    // Initialize state with either the provided initialValue or the defaultInitialValue
    const state = useState<T>(
      initialValue !== undefined ? initialValue : defaultInitialValue,
    );

    // Render the context provider with the state as its value
    return providerFactory({value: state}, children);
  };

  /**
   * A custom hook to consume the state context.
   *
   * This hook provides access to the state and the function to update it.
   * It must be used within a component that is a descendant of the `StateProvider`.
   *
   * @returns A tuple containing the state and the state updater function.
   * @throws Will throw an error if used outside of a `StateProvider`.
   */
  const useStateContext = () => {
    const state = useContext(context);
    if (state == null) {
      throw new Error(`useStateContext must be used inside a StateProvider.`);
    }
    return state;
  };

  // Return the custom hook, provider component, and context as a tuple
  return [useStateContext, StateProvider, context] as const;
};

/**
 * Context for the Developer Menu in a React Native application.
 *
 * This context provides access to developer menu-specific data and functionality
 * throughout the component tree. It is particularly useful in development mode (`__DEV__`).
 *
 * @example
 * ```tsx
 * import { DevMenuContext } from './DevMenuContext';
 *
 * const MyComponent = () => {
 *   const devMenu = React.useContext(DevMenuContext);
 *
 *   return <SomeComponent />;
 * };
 * ```
 */
export const DevMenuContext = React.createContext<DevMenuType | null>(null);

// Set the display name for easier debugging in React DevTools
if (__DEV__) {
  DevMenuContext.displayName = 'DevMenuContext';
}

/**
 * A custom hook and provider for managing the visibility state of a modal.
 *
 * This exports two values:
 * - `useModal`: A hook to access the modal's visibility state and its setter function.
 * - `ModalContextProvider`: A provider component that supplies the modal's visibility state to its descendants.
 *
 * The visibility state is a boolean, with `false` as the default initial value, indicating that the modal is hidden by default.
 *
 * @example
 * ```tsx
 * import { useModal, ModalContextProvider } from './modalContext';
 *
 * const ModalToggle = () => {
 *   const [isModalVisible, setModalVisible] = useModal();
 *
 *   return (
 *     <button onClick={() => setModalVisible(!isModalVisible)}>
 *       {isModalVisible ? 'Hide Modal' : 'Show Modal'}
 *     </button>
 *   );
 * };
 *
 * const App = () => (
 *   <ModalContextProvider>
 *     <ModalToggle />
 *     {isModalVisible && <ModalComponent />}
 *   </ModalContextProvider>
 * );
 * ```
 */
export const [useModal, ModalContextProvider] = createStateContext(false);

/**
 * A custom hook and provider for managing the active screen component.
 *
 * This exports two values:
 * - `useScreen`: A hook to access the current screen component and its setter function.
 * - `ScreenContextProvider`: A provider component that supplies the current screen component to its descendants.
 *
 * The initial state is `null`, indicating that no screen is active by default.
 * This setup allows dynamic rendering and updating of the active screen component across the application.
 *
 * @example
 * ```tsx
 * import { useScreen, ScreenContextProvider } from './screenContext';
 *
 * const ScreenSwitcher = () => {
 *   const [currentScreen, setScreen] = useScreen();
 *
 *   return (
 *     <div>
 *       <button onClick={() => setScreen(<HomeScreen />)}>Home</button>
 *       <button onClick={() => setScreen(<ProfileScreen />)}>Profile</button>
 *       {currentScreen}
 *     </div>
 *   );
 * };
 *
 * const App = () => (
 *   <ScreenContextProvider>
 *     <ScreenSwitcher />
 *   </ScreenContextProvider>
 * );
 * ```
 */
export const [useScreen, ScreenContextProvider] =
  createStateContext<JSX.Element | null>(null);
