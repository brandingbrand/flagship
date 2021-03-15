import React, { createContext, FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { Navigation } from 'react-native-navigation';
import { uniqueId } from 'lodash-es';

export interface IButtonContext {
  onPress(buttonId: string, callback: () => void): () => void;
  onPress(buttonId: string, componentId: string, callback: () => void): () => void;
}

export const ButtonContext = createContext<IButtonContext>({
  onPress: () => () => undefined
});
export const useButtons = () => useContext(ButtonContext);

export const ButtonProvider: FC = ({ children }) => {
  const listenerRepo = useMemo(() => new Map<string, Map<string, () => void>>(), []);

  const onPress = useCallback(
    ((buttonId: string, componentIdOrCallback: string | (() => void), callback: () => void) => {
      const componentId =
        typeof componentIdOrCallback === 'string' ? componentIdOrCallback : undefined;
      const actualCallback =
        typeof componentIdOrCallback === 'function' ? componentIdOrCallback : callback;

      const listenersId = [buttonId, ...(componentId ? [componentId] : [])].join('-');
      const listenerId = uniqueId(listenersId);
      const listeners =
        listenerRepo.get(listenersId) ?? listenerRepo.set(listenersId, new Map()).get(listenersId);
      listeners?.set(listenerId, actualCallback);

      return () => {
        listeners?.delete(listenerId);
      };
    }) as IButtonContext['onPress'],
    []
  );

  useEffect(() => {
    const subscription = Navigation.events().registerNavigationButtonPressedListener(
      ({ buttonId, componentId }) => {
        listenerRepo.get(buttonId)?.forEach(callback => callback());
        listenerRepo.get(`${buttonId}-${componentId}`)?.forEach(callback => callback());
      }
    );

    return () => subscription.remove();
  }, []);

  return <ButtonContext.Provider value={{ onPress }}>{children}</ButtonContext.Provider>;
};

export const useButtonEffect = (
  callback: () => void,
  ids: [buttonId: string] | [buttonId: string, componentId: string]
) => {
  const buttons = useButtons();

  useEffect(() => {
    if (ids.length === 1) {
      return buttons.onPress(...ids, callback);
    } else {
      return buttons.onPress(...ids, callback);
    }
  }, ids);
};
