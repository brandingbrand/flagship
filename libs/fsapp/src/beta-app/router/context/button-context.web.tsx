import { createContext, Fragment } from 'react';
import { InjectionToken } from '@brandingbrand/fslinker';
import { useDependencyContext } from '../../lib/use-dependency';

export interface ButtonService {
  onPress(buttonId: string, callback: () => void): () => void;
  onPress(buttonId: string, componentId: string, callback: () => void): () => void;
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

export const ButtonProvider = Fragment;

export const useButtonEffect = (
  _callback: () => void,
  _ids: [buttonId: string] | [buttonId: string, componentId: string]
) => {
  // NOOP
};
