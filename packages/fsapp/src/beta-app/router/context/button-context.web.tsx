import { createContext, Fragment, useContext } from 'react';

export interface IButtonContext {
  onPress(buttonId: string, callback: () => void): () => void;
  onPress(buttonId: string, componentId: string, callback: () => void): () => void;
}

export const ButtonContext = createContext<IButtonContext>({
  onPress: () => () => undefined
});
export const useButtons = () => useContext(ButtonContext);

export const ButtonProvider = Fragment;

export const useButtonEffect = (
  _callback: () => void,
  _ids: [buttonId: string] | [buttonId: string, componentId: string]
) => {
  // NOOP
};
