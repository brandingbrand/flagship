import type { ModalComponentType, ModalService } from './types';

import React, { createContext, FC, useCallback, useContext } from 'react';
import { Navigation } from 'react-native-navigation';
import { uniqueId } from 'lodash-es';

import { MODALS_STACK, NO_MODAL_CONTEXT_ERROR } from './constants';

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

export const ModalProvider: FC = ({ children }) => {
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
      return new Promise<T>(async (resolvePromise, rejectPromise) => {
        const id = uniqueId(`${modal.definitionId}-`);

        const resolve = async (data: T) => {
          resolvePromise(data);
          await dismissModal(id);
        };

        const reject = async () => {
          rejectPromise();
          await dismissModal(id);
        };

        await Navigation.showModal({
          stack: {
            id: MODALS_STACK,
            children: [
              {
                component: {
                  id,
                  name: modal.definitionId,
                  options: {
                    modal: modal.options
                  },
                  passProps: {
                    resolve,
                    reject,
                    ...props
                  }
                }
              }
            ]
          }
        });
      });
    },
    []
  );

  return (
    <ModalContext.Provider value={{ showModal, dismissModal, dismissAllModals }}>
      {children}
    </ModalContext.Provider>
  );
};
