import { createContext, useContext } from 'react';
import { NOTHING_BURGER } from '../../utils.base';

export interface ButtonContextOptions {
  onPress(buttonID: string, callback: () => void): void;
  onPress(buttonID: string, componentID: string, callback: () => void): void;
}

export const ButtonContext = createContext<ButtonContextOptions>({
  onPress: () => undefined
});
export const useButtons = () => useContext(ButtonContext);

export const ButtonProvider = NOTHING_BURGER;
