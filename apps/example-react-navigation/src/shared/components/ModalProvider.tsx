import React, {createContext, useContext, useState, useCallback} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';

type ModalContextType = {
  showModal: (modalName: string, params?: object) => Promise<any>;
  hideModal: (value: any) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const navigation = useNavigation<NavigationProp<any>>(); // Generic navigation prop
  const [resolveFunction, setResolveFunction] = useState<
    ((value: any) => void) | null
  >(null);

  const showModal = useCallback(
    (modalName: string, params?: object) => {
      return new Promise<any>(resolve => {
        setResolveFunction(() => resolve); // Store the resolve function
        navigation.navigate(modalName, params); // Use navigation to navigate to the modal
      });
    },
    [navigation],
  );

  const hideModal = useCallback(
    (value: any) => {
      if (resolveFunction) {
        resolveFunction(value); // Resolve the promise with the provided value
        setResolveFunction(null); // Clear the resolve function
      }
      navigation.goBack(); // Dismiss the modal
    },
    [resolveFunction, navigation],
  );

  return (
    <ModalContext.Provider value={{showModal, hideModal}}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
