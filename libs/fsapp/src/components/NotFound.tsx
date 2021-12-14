import React from 'react';
import { View } from 'react-native';
import NavWrapper from '../lib/nav-wrapper';
import { NavLayout } from '../types';

export interface NotFoundProps {
  navigator: NavWrapper;
}

export const NotFound = (redirect: NavLayout | true) => {
  return React.memo((props: NotFoundProps) => {
    React.useEffect(() => {
      if (redirect === true) {
        props.navigator.popToRoot().catch(e => console.error(e));
      } else {
        props.navigator.setStackRoot(redirect).catch(e => console.error(e));
      }
    }, []);
    return <View />;
  });
};
