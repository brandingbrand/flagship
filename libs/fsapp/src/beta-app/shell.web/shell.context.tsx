import type { FC } from 'react';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import type { ViewStyle } from 'react-native';
import { TouchableWithoutFeedback, View } from 'react-native';

import { InjectionToken } from '@brandingbrand/fslinker';

import { InjectedContextProvider, useDependencyContext } from '../lib/use-dependency';
import { useNavigator } from '../router';
import { CreateWebStyles, lockScroll, unlockScroll } from '../utils';

import {
  DEFAULT_DRAWER_ANIMATION,
  DEFAULT_DRAWER_WIDTH,
  DEFAULT_OVERLAY_OPACITY,
} from './constants';
import { DrawerContainer } from './drawer-container.component';
import { dummyShell } from './shell.dummy';
import type { DrawerComponentType, ShellConfig, WebShell } from './types';

export const WebShellContext = createContext<WebShell>(dummyShell);
export const WEB_SHELL_CONTEXT_TOKEN = new InjectionToken<typeof WebShellContext>(
  'WEB_SHELL_CONTEXT_TOKEN'
);

export const useWebShell = () => useDependencyContext(WEB_SHELL_CONTEXT_TOKEN) ?? dummyShell;

const useDrawerOptions = (drawer?: DrawerComponentType) => {
  const width = useMemo(() => drawer?.options?.width ?? DEFAULT_DRAWER_WIDTH, [drawer]);
  const duration = useMemo(
    () => drawer?.options?.animationDuration ?? DEFAULT_DRAWER_ANIMATION,
    [drawer]
  );
  const opacity = useMemo(
    () => drawer?.options?.overlayOpacity ?? DEFAULT_OVERLAY_OPACITY,
    [drawer]
  );
  const backgroundColor = useMemo(() => drawer?.options?.backgroundColor, [drawer]);
  return [width, duration, opacity, backgroundColor] as const;
};

// TODO Move to Drawer definition
const styles = CreateWebStyles({
  appDrawerOpen: {
    overflowX: 'hidden',
  },
  appDrawerDefault: {
    flexGrow: 1,
    flexBasis: 'auto',
  },
  container: {
    width: '100%',
    flexGrow: 1,
    flexBasis: 'auto',
    transitionProperty: 'margin-left',
  },
  containerOverlay: {
    backgroundColor: 'black',
    opacity: 0,
    position: 'absolute',
    transitionProperty: 'opacity',
  },
  containerOverlayActive: {
    inset: 0,
  },
});

export const WebShellProvider: FC<ShellConfig> = ({
  children,
  footer,
  header,
  leftDrawer,
  rightDrawer,
}) => {
  const navigator = useNavigator();
  const [leftDrawerOpen, setLeftDrawer] = useState(false);
  const [leftActive, setLeftActive] = useState(false);
  const [rightDrawerOpen, setRightDrawer] = useState(false);
  const [rightActive, setRightActive] = useState(false);

  // TODO: Hide based on Activated Route Option
  const Header = header ?? (() => null);
  const Footer = footer ?? (() => null);

  const LeftDrawer = leftDrawer;
  const RightDrawer = rightDrawer;

  const toggleLeftDrawer = useCallback(
    (open?: boolean) => {
      setLeftDrawer(open ?? !leftDrawerOpen);
    },
    [setLeftDrawer, leftDrawerOpen]
  );

  const toggleRightDrawer = useCallback(
    (open?: boolean) => {
      setRightDrawer(open ?? !rightDrawerOpen);
    },
    [setRightDrawer, rightDrawerOpen]
  );

  const closeLeftDrawer = useCallback(() => {
    toggleLeftDrawer(false);
  }, [toggleLeftDrawer]);
  const closeRightDrawer = useCallback(() => {
    toggleRightDrawer(false);
  }, [toggleLeftDrawer]);
  const closeAllDrawers = useCallback(() => {
    setLeftDrawer(false);
    setRightDrawer(false);
  }, [setLeftDrawer, setRightDrawer]);

  useEffect(() => {
    if (leftDrawerOpen || rightDrawerOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [leftDrawerOpen, rightDrawerOpen]);

  useEffect(() => navigator.listen(closeAllDrawers), []);

  const [leftWidth, leftDuration, leftOpacity, leftBackgroundColor] = useDrawerOptions(LeftDrawer);
  const [rightWidth, rightDuration, rightOpacity, rightBackgroundColor] =
    useDrawerOptions(RightDrawer);

  const activateLeft = leftDrawerOpen || leftActive;
  const activateRight = rightDrawerOpen || rightActive;
  return (
    <InjectedContextProvider
      token={WEB_SHELL_CONTEXT_TOKEN}
      value={{ toggleLeftDrawer, toggleRightDrawer }}
    >
      <View
        style={[styles.appDrawerDefault, (activateLeft || activateRight) && styles.appDrawerOpen]}
      >
        <View
          style={[
            styles.container,
            leftDrawerOpen && LeftDrawer?.options?.slideShell && { marginLeft: leftWidth },
            rightDrawerOpen &&
              RightDrawer?.options?.slideShell && { marginLeft: `calc(-1 * ${rightWidth})` },
            activateLeft && ({ transitionDuration: leftDuration } as unknown as ViewStyle),
            activateRight && ({ transitionDuration: rightDuration } as unknown as ViewStyle),
          ]}
        >
          <Header />
          {children}
          <Footer />

          <TouchableWithoutFeedback onPress={closeAllDrawers}>
            <View
              style={[
                styles.containerOverlay,
                leftDrawerOpen && { opacity: leftOpacity, backgroundColor: leftBackgroundColor },
                rightDrawerOpen && { opacity: rightOpacity, backgroundColor: rightBackgroundColor },
                (activateLeft || activateRight) && styles.containerOverlayActive,
                activateLeft &&
                  ({
                    transitionDuration: leftDuration,
                  } as unknown as ViewStyle),
                activateRight &&
                  ({
                    transitionDuration: rightDuration,
                  } as unknown as ViewStyle),
              ]}
            />
          </TouchableWithoutFeedback>
        </View>

        {LeftDrawer && (
          <DrawerContainer
            animationDuration={leftDuration}
            onChange={setLeftActive}
            open={leftDrawerOpen}
            position="left"
            style={LeftDrawer.options?.style}
            width={leftWidth}
          >
            <LeftDrawer close={closeLeftDrawer} />
          </DrawerContainer>
        )}

        {RightDrawer && (
          <DrawerContainer
            animationDuration={rightDuration}
            onChange={setRightActive}
            open={rightDrawerOpen}
            position="right"
            style={RightDrawer.options?.style}
            width={rightWidth}
          >
            <RightDrawer close={closeRightDrawer} />
          </DrawerContainer>
        )}
      </View>
    </InjectedContextProvider>
  );
};
