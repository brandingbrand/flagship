import React, {createContext, useContext, useCallback, useEffect} from 'react';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

type ModalContextType = {
  /**
   * Shows a modal by navigating to the specified modal route.
   * Returns a promise that resolves with a value when the modal is dismissed.
   *
   * @param modalName - The name of the modal route to navigate to.
   * @param params - Optional parameters to pass to the modal.
   * @returns A promise that resolves with the value provided when the modal is dismissed.
   */
  showModal: (modalName: string, params?: object) => Promise<any>;

  /**
   * Hides the modal with the given modal ID and resolves its associated promise.
   *
   * @param modalId - The unique ID of the modal to hide.
   * @param value - The value to resolve the modal's promise with.
   */
  hideModal: (modalId: string, value: any) => void;
};

let modalIdCounter = 0; // Counter for generating unique modal IDs
const modalMap = new Map<string, (value: any) => void>(); // Map to store modal resolve functions

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * ModalProvider Component
 * Provides `showModal` and `hideModal` functions to manage modals.
 */
export const ModalProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const showModal = useCallback(
    (modalName: string, params?: object) => {
      return new Promise<any>(resolve => {
        const modalId = `modal_${modalIdCounter++}`; // Generate a unique ID for the modal
        modalMap.set(modalId, resolve); // Store the resolve function in the map

        navigation.navigate(modalName, {...params, __modalId: modalId}); // Navigate to the modal
      });
    },
    [navigation],
  );

  const hideModal = useCallback(
    (modalId: string, value: any) => {
      const resolve = modalMap.get(modalId);

      if (resolve) {
        resolve(value); // Resolve the promise with the provided value
        navigation.goBack(); // Navigate back to dismiss the modal
        modalMap.delete(modalId); // Remove the modal from the map
      }
    },
    [navigation],
  );

  return (
    <ModalContext.Provider value={{showModal, hideModal}}>
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Hook to access the modal context.
 * Throws an error if used outside a `ModalProvider`.
 *
 * @returns The modal context with `showModal` and `hideModal` functions.
 */
export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

/**
 * A custom hook for managing the current modal's lifecycle.
 * Automatically retrieves the `__modalId` from the navigation route params.
 *
 * @returns An enhanced `hideModal` function and other modal utilities.
 */
export const useModal = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {hideModal, showModal} = useModalContext();

  const currentModalId = (route.params as {__modalId?: string})?.__modalId;

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (currentModalId) {
        modalMap.delete(currentModalId);
      }
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, [navigation, currentModalId]);

  const enhancedHideModal = (value: any) => {
    if (!currentModalId) {
      throw new Error(
        'useModal must be used within a modal with a valid `__modalId` in route.params.',
      );
    }

    hideModal(currentModalId, value);
  };

  return {
    hideModal: enhancedHideModal,
    showModal,
  };
};
