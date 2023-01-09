import type { FC } from 'react';
import React, {
  Fragment,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
// @ts-expect-error TODO: Update `react-native-web` and replace this
import Modal from 'react-native-web-modal';

import { InjectionToken } from '@brandingbrand/fslinker';

import { uniqueId } from 'lodash-es';

import { useApp } from '../app/context';
import { InjectedContextProvider, useDependencyContext } from '../lib/use-dependency';
import { useNavigator } from '../router';
import { ActivatedRouteProvider, NavigatorProvider, useActivatedRoute } from '../router/context';
import { lockScroll, unlockScroll } from '../utils.web';

import { NO_MODAL_CONTEXT_ERROR } from './constants';
import type { ModalComponentType, ModalProviderProps, ModalService } from './types';

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
export const useModals = (): ModalService =>
  useDependencyContext(MODAL_CONTEXT_TOKEN) ?? DEFAULT_MODAL_SERVICE;

const navStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'black',
    bottom: 0,
    height: '100%',
    left: 0,
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
});

export const ModalProvider: FC<ModalProviderProps> = ({ children, screenWrap }) => {
  const app = useApp();
  const navigator = useNavigator();
  const route = useActivatedRoute();
  const getApp = useCallback(() => app, [app]);
  const [modals, setModals] = useState<Record<string, FC>>({});
  const Wrapper = useMemo(() => screenWrap ?? Fragment, []);

  const closers = useRef<Map<string, () => void>>();
  if (closers.current === undefined) {
    closers.current = new Map();
  }

  const removeModal = useCallback(
    (id: string) => {
      setModals((modals) => {
        const { [id]: modal, ...otherModals } = modals;
        return otherModals;
      });

      closers.current?.delete(id);
    },
    [setModals]
  );

  // TODO: Animations, Styles
  const dismissModal = useCallback(async (id: string) => {
    const closer = closers.current?.get(id);
    closer?.();
  }, []);

  // TODO: Animations, Styles
  const dismissAllModals = useCallback(async () => {
    for (const close of Object.values(closers)) {
      close();
    }
  }, [setModals]);

  // TODO: Animations, Styles
  const showModal = useCallback(
    async <T, P>(modal: ModalComponentType<T, P>, props?: P) => {
      const id = uniqueId(`${modal.definitionId}-`);
      const Content = modal;
      return new Promise<T>((resolve, reject) => {
        setModals((modals) => ({
          ...modals,
          // eslint-disable-next-line react/no-unstable-nested-components
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
              closers.current?.set(id, () => {
                setVisible(false);
              });
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

            useEffect(() => navigator.listen(handleReject), [navigator]);

            const Provider = getApp()?.config.provider ?? React.Fragment;
            return (
              <Modal
                animationType="fade"
                key={id}
                onRequestClose={handleReject}
                transparent
                visible={visible}
                {...modal.options}
              >
                <Wrapper>
                  <NavigatorProvider value={navigator}>
                    <ActivatedRouteProvider {...route}>
                      <Provider>
                        <TouchableWithoutFeedback onPress={handleReject}>
                          <View style={[navStyle.backdrop, modal.options?.backdropStyle]} />
                        </TouchableWithoutFeedback>
                        <View style={modal.options?.style}>
                          {modal.options?.title ? <Text>{modal.options.title}</Text> : null}
                          <Content
                            reject={handleReject}
                            resolve={handleResolve}
                            {...(props as P)}
                          />
                        </View>
                      </Provider>
                    </ActivatedRouteProvider>
                  </NavigatorProvider>
                </Wrapper>
              </Modal>
            );
          },
        }));
      });
    },
    [setModals]
  );

  const modalContext = useMemo(
    () => ({ showModal, dismissModal, dismissAllModals }),
    [showModal, dismissModal, dismissAllModals]
  );

  return (
    <InjectedContextProvider token={MODAL_CONTEXT_TOKEN} value={modalContext}>
      {children}
      {Object.entries(modals).map(([id, Modal]) => (
        <Modal key={id} />
      ))}
    </InjectedContextProvider>
  );
};
