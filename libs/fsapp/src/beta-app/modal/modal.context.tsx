import type { FC } from 'react';
import React, { Fragment, createContext, useCallback, useMemo, useState } from 'react';

import { Navigation } from 'react-native-navigation';

import { InjectionToken } from '@brandingbrand/fslinker';

import { uniqueId } from 'lodash-es';

import { InjectedContextProvider, useDependencyContext } from '../lib/use-dependency';

import { MODALS_STACK, NO_MODAL_CONTEXT_ERROR } from './constants';
import type {
  ModalComponentProps,
  ModalComponentType,
  ModalProviderProps,
  ModalService,
} from './types';

const DEFAULT_MODAL_SERVICE: ModalService = {
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

export const ModalProvider: FC<ModalProviderProps> = ({ children, screenWrap }) => {
  const [registeredModals, setRegisteredModals] = useState(new Set<string>());
  const Wrapper = useMemo(() => screenWrap ?? Fragment, []);

  // TODO: Animations, Styles
  const dismissModal = useCallback(async (modalId: string) => {
    const id = modalId;

    if (id) {
      await Navigation.dismissModal(id);
    }
  }, []);

  // TODO: Animations, Styles
  const dismissAllModals = useCallback(async () => {
    await Navigation.dismissAllModals();
  }, []);

  // TODO: Animations, Styles
  const showModal = useCallback(
    async <T, P>(modal: ModalComponentType<T, P>, props?: P): Promise<T> => {
      if (!registeredModals.has(modal.definitionId)) {
        const Modal = modal;
        Navigation.registerComponent(
          modal.definitionId,
          () => (props: ModalComponentProps<T> & P) =>
            (
              <Wrapper>
                <Modal {...props} />
              </Wrapper>
            )
        );
        setRegisteredModals(new Set([...registeredModals, modal.definitionId]));
      }

      return new Promise<T>((resolvePromise, rejectPromise) => {
        const id = uniqueId(`${modal.definitionId}-`);

        const resolve = async (data: T): Promise<void> => {
          resolvePromise(data);
          await dismissModal(id);
        };

        const reject = async (): Promise<void> => {
          rejectPromise();
          await dismissModal(id);
        };

        void Navigation.showModal({
          stack: {
            id: MODALS_STACK,
            children: [
              {
                component: {
                  id,
                  name: modal.definitionId,
                  options: {
                    ...modal.options?.navigationOptions,
                    modal: {
                      ...modal.options?.navigationOptions?.modal,
                      ...modal.options,
                    },
                    topBar: {
                      ...modal.options?.navigationOptions?.topBar,
                      ...modal.topBarOptions,
                    },
                  },
                  passProps: {
                    resolve,
                    reject,
                    ...props,
                  },
                },
              },
            ],
          },
        });
      });
    },
    [registeredModals, setRegisteredModals, Wrapper]
  );

  const modalService = useMemo(
    () => ({ showModal, dismissModal, dismissAllModals }),
    [showModal, dismissModal, dismissAllModals]
  );

  return (
    <InjectedContextProvider token={MODAL_CONTEXT_TOKEN} value={modalService}>
      {children}
    </InjectedContextProvider>
  );
};
