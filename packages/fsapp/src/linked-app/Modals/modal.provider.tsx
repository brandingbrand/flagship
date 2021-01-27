import React, { createContext, FC, useCallback, useContext, useState } from 'react';
import { Modal } from 'react-native';

import { ModalComponentType } from './types';

type ModalDef<T> = [ModalComponentType<T>, (data: T) => void, () => void];

interface ModalService {
  createModal: <T>(id: string, modal: ModalDef<T>) => void;
  dismissModal: (id: string) => void;
  dismissAllModals: () => void;
}

const ModalContext = createContext<ModalService>({
  createModal: () => undefined,
  dismissModal: () => undefined,
  dismissAllModals: () => undefined
});
export const useModalService = () => useContext(ModalContext);


export const ModalProvider: FC = ({ children }) => {
  const [modals, setModals] = useState<Record<string, ModalDef<any>>>({});

  const createModal = useCallback(
    <T, >(id: string, modal: ModalDef<T>) => {
      setModals({ ...modals, [id]: modal });
    },
    [modals, setModals]
  );

  const dismissModal = useCallback(
    (id: string) => {
      const { [id]: modal, ...otherModals } = modals;
      setModals(otherModals);
    },
    [modals, setModals]
  );

  const dismissAllModals = useCallback(() => {
    setModals({});
  }, [setModals]);

  return (
    <ModalContext.Provider value={{ createModal, dismissModal, dismissAllModals }}>
      {children}
      {Object.entries(modals).map(([id, [Content, resolve, reject]]) => {
        const [visible, setVisible] = useState(true);
        const [data, setData] = useState<unknown>();
        const handleResolve = (data: unknown) => {
          setVisible(false);
          setData(data);
        };

        const handleReject = () => {
          setVisible(false);
        };

        const handleDismiss = () => {
          if (data) {
            resolve(data);
          } else {
            reject();
          }
        };

        return (
          <Modal key={id} visible={visible} onRequestClose={handleReject} onDismiss={handleDismiss}>
            <Content resolve={handleResolve} reject={handleReject} />
          </Modal>
        );
      })}
    </ModalContext.Provider>
  );
};
