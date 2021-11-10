import React, { createContext, FC, useCallback, useEffect, useMemo } from 'react';
import { Navigation } from 'react-native-navigation';
import { uniqueId } from 'lodash-es';

import { InjectionToken } from '@brandingbrand/fslinker';

import { InjectedContextProvider, useDependencyContext } from '../../lib/use-dependency';

export interface ButtonService {
  onPress(buttonId: string, callback: () => void): () => void;
  onPress(buttonId: string, componentId: string, callback: () => void): () => void;
}

const DEFAULT_BUTTON_SERVICE: ButtonService = {
  onPress: () => () => undefined
};

export const ButtonContext = createContext<ButtonService>(DEFAULT_BUTTON_SERVICE);
export const BUTTON_CONTEXT_TOKEN = new InjectionToken<typeof ButtonContext>(
  'BUTTON_CONTEXT_TOKEN'
);
export const useButtons = () =>
  useDependencyContext(BUTTON_CONTEXT_TOKEN) ?? DEFAULT_BUTTON_SERVICE;

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
    }) as ButtonService['onPress'],
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

  return (
    <InjectedContextProvider token={BUTTON_CONTEXT_TOKEN} value={{ onPress }}>
      {children}
    </InjectedContextProvider>
  );
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
