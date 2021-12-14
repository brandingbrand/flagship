import { StyleSheet } from 'react-native';

export * from './utils.base';

export const unlockScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.right = '';
  document.body.style.left = '';
  window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
};

export const lockScroll = () => {
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.right = '0px';
  document.body.style.left = '0px';
  document.body.style.position = 'fixed';
};

// TODO: Correct Type Safety
// hack to avoid ts complaint about certain web-only properties not being valid
export const CreateWebStyles: (obj: any) => StyleSheet.NamedStyles<any> = StyleSheet.create;
