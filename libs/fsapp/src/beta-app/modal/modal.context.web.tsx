import type { ModalComponentType, ModalProviderProps, ModalService } from './types';

import React, { createContext, FC, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { uniqueId } from 'lodash-es';

// @ts-ignore TODO: Update `react-native-web` and replace this
import Modal from 'react-native-web-modal';

import { InjectionToken } from '@brandingbrand/fslinker';

import { useNavigator } from '../router';
import { lockScroll, unlockScroll } from '../utils.web';

import { NO_MODAL_CONTEXT_ERROR } from './constants';
import { InjectedContextProvider, useDependencyContext } from '../lib/use-dependency';
import { ActivatedRouteProvider, NavigatorProvider, useActivatedRoute } from '../router/context';
import {
  API_CONTEXT_TOKEN,
  APP_CONTEXT_TOKEN,
  InjectedReduxProvider,
  useAPI,
  useApp,
  useStore,
} from '../app/context';

const DEFAULT_MODAL_SERVICE = {
  showModal: async () => {
    throw new Error(NO_MODAL_CONTEXT_ERROR);
  },
  dismissModal: async () => {
    throw new Error(NO_MODAL_CONTEXT_ERROR);
  },
  dismissAllModals: async () => {
    throw new Error(NO_MODAL_CONTEXT_ERROR);
  },
};

export const ModalContext = createContext<ModalService>(DEFAULT_MODAL_SERVICE);
export const MODAL_CONTEXT_TOKEN = new InjectionToken<typeof ModalContext>('MODAL_CONTEXT_TOKEN');
export const useModals = () => useDependencyContext(MODAL_CONTEXT_TOKEN) ?? DEFAULT_MODAL_SERVICE;

const navStyle = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.7,
  },
});

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const app = useApp();
  const api = useAPI();
  const store = useStore();
  const navigator = useNavigator();
  const route = useActivatedRoute();
  const getApp = useCallback(() => app, [app]);
  const [modals, setModals] = useState<Record<string, FC>>({});
  const [closers, setClosers] = useState<Record<string, () => void>>({});

  const removeModal = useCallback(
    (id: string) => {
      const { [id]: modal, ...otherModals } = modals;
      const { [id]: close, ...otherClosers } = closers;
      setModals(otherModals);
      setClosers(otherClosers);
    },
    [modals, setModals]
  );

  // TODO: Animations, Styles
  const dismissModal = useCallback(
    async (id: string) => {
      closers[id]();
    },
    [closers]
  );

  // TODO: Animations, Styles
  const dismissAllModals = useCallback(async () => {
    Object.values(closers).forEach((close) => close());
  }, [setModals]);

  // TODO: Animations, Styles
  const showModal = useCallback(
    async <T, P>(modal: ModalComponentType<T, P>, props?: P) => {
      const id = uniqueId(`${modal.definitionId}-`);
      const Content = modal;
      return new Promise<T>((resolve, reject) => {
        setModals({
          ...modals,
          [id]: () => {
            const [visible, setVisible] = useState(true);

            useEffect(() => {
              if (visible) {
                lockScroll();
              } else {
                unlockScroll();
              }
            }, [visible]);

            useEffect(() => {
              setClosers({ ...closers, [id]: () => setVisible(false) });
            }, []);

            const handleResolve = useCallback(
              (data: T) => {
                setVisible(false);
                requestAnimationFrame(() => {
                  removeModal(id);
                  resolve(data);
                });
              },
              [resolve, removeModal]
            );

            const handleReject = useCallback(() => {
              setVisible(false);
              requestAnimationFrame(() => {
                removeModal(id);
                reject();
              });
            }, [reject, removeModal]);

            useEffect(() => {
              return navigator.listen(handleReject);
            }, [navigator]);

            return (
              <Modal
                key={id}
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={handleReject}
                {...modal.options}
              >
                <InjectedContextProvider token={APP_CONTEXT_TOKEN} value={getApp}>
                  <InjectedContextProvider token={API_CONTEXT_TOKEN} value={api}>
                    <NavigatorProvider value={navigator}>
                      <InjectedReduxProvider store={store}>
                        <ActivatedRouteProvider {...route}>
                          <TouchableWithoutFeedback onPress={handleReject}>
                            <View style={[navStyle.backdrop, modal.options?.backdropStyle]} />
                          </TouchableWithoutFeedback>
                          <View style={modal.options?.style}>
                            {modal.options?.title ? <Text>{modal.options.title}</Text> : null}
                            <Content
                              resolve={handleResolve}
                              reject={handleReject}
                              {...(props as P)}
                            />
                          </View>
                        </ActivatedRouteProvider>
                      </InjectedReduxProvider>
                    </NavigatorProvider>
                  </InjectedContextProvider>
                </InjectedContextProvider>
              </Modal>
            );
          },
        });
      });
    },
    [modals, setModals]
  );

  return (
    <InjectedContextProvider
      token={MODAL_CONTEXT_TOKEN}
      value={{ showModal, dismissModal, dismissAllModals }}
    >
      {children}
      {Object.entries(modals).map(([id, Modal]) => (
        <Modal key={id} />
      ))}
    </InjectedContextProvider>
  );
};
