import type { FC } from 'react';
import React, { createContext, useCallback, useEffect, useMemo } from 'react';

import { Navigation } from 'react-native-navigation';

import { InjectionToken } from '@brandingbrand/fslinker';

import { uniqueId } from 'lodash-es';

import { InjectedContextProvider, useDependencyContext } from '../../lib/use-dependency';

import { useScreenId } from './activated-route.context';

export interface ButtonService {
  onPress: ((buttonId: string, callback: () => void) => () => void) &
    ((buttonId: string, componentId: string | undefined, callback: () => void) => () => void);
}

const DEFAULT_BUTTON_SERVICE: ButtonService = {
  onPress: () => () => undefined,
};

export const ButtonContext = createContext<ButtonService>(DEFAULT_BUTTON_SERVICE);
export const BUTTON_CONTEXT_TOKEN = new InjectionToken<typeof ButtonContext>(
  'BUTTON_CONTEXT_TOKEN'
);
export const useButtons = () =>
  useDependencyContext(BUTTON_CONTEXT_TOKEN) ?? DEFAULT_BUTTON_SERVICE;

export const ButtonProvider: FC = ({ children }) => {
  const screenId = useScreenId();
  const listenerRepo = useMemo(() => new Map<string, Map<string, () => void>>(), []);

  const onPress = useCallback(
    ((
      buttonId: string,
      componentIdOrCallback: string | (() => void) | undefined,
      callback: () => void
    ) => {
      const componentId =
        typeof componentIdOrCallback === 'function' ? screenId : componentIdOrCallback;
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
        listenerRepo.get(buttonId)?.forEach((callback) => {
          callback();
        });
        listenerRepo.get(`${buttonId}-${componentId}`)?.forEach((callback) => {
          callback();
        });
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const buttonService = useMemo(() => ({ onPress }), [onPress]);

  return (
    <InjectedContextProvider token={BUTTON_CONTEXT_TOKEN} value={buttonService}>
      {children}
    </InjectedContextProvider>
  );
};

export const useButtonEffect = (
  callback: () => void,
  ids: [buttonId: string, componentId: string] | [buttonId: string]
) => {
  const buttons = useButtons();

  useEffect(() => {
    if (ids.length === 1) {
      return buttons.onPress(...ids, callback);
    }
    return buttons.onPress(...ids, callback);
  }, ids);
};
