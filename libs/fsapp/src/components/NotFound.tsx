import React from 'react';

import { View } from 'react-native';

import type NavWrapper from '../lib/nav-wrapper';
import type { NavLayout } from '../types';

export interface NotFoundProps {
  navigator: NavWrapper;
}

export const NotFound = (redirect: NavLayout | true) =>
  React.memo((props: NotFoundProps) => {
    React.useEffect(() => {
      if (redirect === true) {
        props.navigator.popToRoot().catch((error) => {
          console.error(error);
        });
      } else {
        props.navigator.setStackRoot(redirect).catch((error) => {
          console.error(error);
        });
      }
    }, []);
    return <View />;
  });
