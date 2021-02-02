import React, { createContext, FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { Navigation } from 'react-native-navigation';

export interface IButtonContext {
  onPress(buttonId: string, callback: () => void): void;
  onPress(buttonId: string, componentID: string, callback: () => void): void;
}

export const ButtonContext = createContext<IButtonContext>({
  onPress: () => undefined
});
export const useButtons = () => useContext(ButtonContext);

export const ButtonProvider: FC = ({ children }) => {
  const listeners = useMemo(() => new Map<string, (() => void)[]>(), []);
  const onPress = useCallback(
    ((buttonId: string, componentIDOrCallback: string | (() => void), callback: () => void) => {
      const componentID =
        typeof componentIDOrCallback === 'string' ? componentIDOrCallback : undefined;
      const actualCallback =
        typeof componentIDOrCallback === 'function' ? componentIDOrCallback : callback;

      const id = [buttonId, ...(componentID ? [componentID] : [])].join('-');
      const existingListeners = listeners.get(id);
      listeners.set(id, [...(existingListeners ?? []), actualCallback]);
    }) as IButtonContext['onPress'],
    []
  );

  useEffect(() => {
    Navigation.events().registerNavigationButtonPressedListener(({ buttonId, componentId }) => {
      listeners.get(buttonId)?.forEach(callback => callback());
      listeners.get(`${buttonId}-${componentId}`)?.forEach(callback => callback());
    });
  }, []);

  return (
    <ButtonContext.Provider value={{ onPress }}>
      {children}
    </ButtonContext.Provider>
  );
};
