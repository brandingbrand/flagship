import type { FC } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { findDOMNode } from 'react-dom';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { CreateWebStyles } from '../utils';

const styles = CreateWebStyles({
  container: {
    zIndex: 10000,
    height: '100%',
    position: 'fixed',
    top: 0,
    bottom: 0,
    overflowX: 'hidden',
    backgroundColor: 'white',
  },
  containerLeft: {
    left: 0,
    transitionProperty: 'margin-left',
    boxShadow: 'inset -7px 0 9px -7px rgba(0,0,0,0.7)',
  },
  containerRight: {
    right: 0,
    transitionProperty: 'margin-right',
    boxShadow: 'inset 7px 0 9px -7px rgba(0,0,0,0.7)',
  },
});

export interface DrawerProps {
  open: boolean;
  width: number | string;
  position: 'left' | 'right';
  animationDuration: string;
  style?: StyleProp<ViewStyle>;
  onChange?: (open: boolean) => void;
}

export const DrawerContainer: FC<DrawerProps> = ({
  animationDuration,
  children,
  onChange,
  open,
  position,
  style,
  width,
}) => {
  const view = useRef<View>(null);
  const [listener, setListener] = useState<EventListener>();
  const div = useMemo(() => findDOMNode(view.current), [view.current]);
  const positionProp = useMemo(() => (position === 'left' ? 'marginLeft' : 'marginRight'), []);
  const positionStyle = useMemo(
    () => (position === 'left' ? styles.containerLeft : styles.containerRight),
    [position]
  );

  useEffect(() => {
    if (listener) {
      div?.removeEventListener('transitionend', listener);
    }

    const newListener = (event: Event) => {
      if (event.target === div) {
        onChange?.(open);
        div?.removeEventListener('transitionend', newListener);
        setListener(undefined);
      }
    };

    div?.addEventListener('transitionend', newListener);
    setListener(() => newListener);

    return () => div?.removeEventListener('transitionend', newListener);
  }, [open]);

  return (
    <View
      ref={view}
      style={[
        styles.container,
        positionStyle,
        style,
        {
          width,
          [positionProp]: open ? 0 : `calc(-1 * ${width})`,
          // eslint-disable-next-line unicorn/no-useless-spread
          ...{ transitionDuration: animationDuration },
        },
      ]}
    >
      {children}
    </View>
  );
};
