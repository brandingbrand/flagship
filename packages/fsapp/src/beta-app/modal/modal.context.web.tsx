import type { Dictionary } from '@brandingbrand/fsfoundation';
import type { ModalComponentType, ModalService } from './types';

import React, { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { uniqueId } from 'lodash-es';

// @ts-ignore TODO: Update `react-native-web` and replace this
import Modal from 'react-native-web-modal';

import { useNavigator } from '../router';
import { lockScroll, unlockScroll } from '../utils.web';

import { NO_MODAL_CONTEXT_ERROR } from './constants';
import { ActivatedRouteProvider, NavigatorProvider, useActivatedRoute } from '../router/context';
import { APIContext, AppContext, useAPI, useApp } from '../app/context';
import { Provider, useStore } from 'react-redux';

const ModalContext = createContext<ModalService>({
  showModal: async () => {
    throw new Error(NO_MODAL_CONTEXT_ERROR);
  },
  dismissModal: async () => {
    throw new Error(NO_MODAL_CONTEXT_ERROR);
  },
  dismissAllModals: async () => {
    throw new Error(NO_MODAL_CONTEXT_ERROR);
  }
});

export const useModals = () => useContext(ModalContext);

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
    opacity: 0.7
  }
});

export const ModalProvider: FC = ({ children }) => {
  const app = useApp();
  const api = useAPI();
  const store = useStore();
  const navigator = useNavigator();
  const route = useActivatedRoute();
  const getApp = useCallback(() => app, [app]);
  const [modals, setModals] = useState<Dictionary<FC>>({});
  const [closers, setClosers] = useState<Dictionary<() => void>>({});

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
    Object.values(closers).forEach(close => close());
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
                animationType='fade'
                onRequestClose={handleReject}
                {...modal.options}
              >
                <AppContext.Provider value={getApp}>
                  <APIContext.Provider value={api}>
                    <NavigatorProvider value={navigator}>
                      <Provider store={store}>
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
                      </Provider>
                    </NavigatorProvider>
                  </APIContext.Provider>
                </AppContext.Provider>
              </Modal>
            );
          }
        });
      });
    },
    [modals, setModals]
  );

  return (
    <ModalContext.Provider value={{ showModal, dismissModal, dismissAllModals }}>
      {children}
      {Object.entries(modals).map(([id, Modal]) => (
        <Modal key={id} />
      ))}
    </ModalContext.Provider>
  );
};
