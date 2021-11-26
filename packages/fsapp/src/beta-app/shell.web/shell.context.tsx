import type { DrawerComponentType, ShellConfig, WebShell } from './types';

import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

import { InjectionToken } from '@brandingbrand/fslinker';

import { useNavigator } from '../router';
import { CreateWebStyles, lockScroll, unlockScroll } from '../utils';

import { dummyShell } from './shell.dummy';
import { InjectedContextProvider, useDependencyContext } from '../lib/use-dependency';
import { DrawerContainer } from './drawer-container.component';
import {
  DEFAULT_DRAWER_ANIMATION,
  DEFAULT_DRAWER_WIDTH,
  DEFAULT_OVERLAY_OPACITY
} from './constants';

export const WebShellContext = createContext<WebShell>(dummyShell);
export const WEB_SHELL_CONTEXT_TOKEN = new InjectionToken<typeof WebShellContext>(
  'WEB_SHELL_CONTEXT_TOKEN'
);

export const useWebShell = () => useDependencyContext(WEB_SHELL_CONTEXT_TOKEN) ?? dummyShell;

const useDrawerOptions = (LeftDrawer?: DrawerComponentType) => {
  const width = useMemo(() => LeftDrawer?.options?.width ?? DEFAULT_DRAWER_WIDTH, [LeftDrawer]);
  const duration = useMemo(
    () => LeftDrawer?.options?.animationDuration ?? DEFAULT_DRAWER_ANIMATION,
    [LeftDrawer]
  );
  const opacity = useMemo(
    () => LeftDrawer?.options?.overlayOpacity ?? DEFAULT_OVERLAY_OPACITY,
    [LeftDrawer]
  );
  return [width, duration, opacity] as const;
};

// TODO Move to Drawer definition
const styles = CreateWebStyles({
  appDrawerOpen: {
    overflowX: 'hidden'
  },
  appDrawerDefault: {
    flexGrow: 1,
    flexBasis: 'auto'
  },
  container: {
    width: '100%',
    flexGrow: 1,
    flexBasis: 'auto',
    transitionProperty: 'margin-left'
  },
  containerOverlay: {
    backgroundColor: 'black',
    opacity: 0,
    position: 'absolute',
    transitionProperty: 'opacity'
  },
  containerOverlayActive: {
    inset: 0
  }
});

// tslint:disable-next-line: cyclomatic-complexity
export const WebShellProvider: FC<ShellConfig> = ({
  header,
  footer,
  leftDrawer,
  rightDrawer,
  children
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
    (open?: boolean) => setLeftDrawer(open ?? !leftDrawerOpen),
    [setLeftDrawer, leftDrawerOpen]
  );

  const toggleRightDrawer = useCallback(
    (open?: boolean) => setRightDrawer(open ?? !rightDrawerOpen),
    [setRightDrawer, rightDrawerOpen]
  );

  const closeLeftDrawer = useCallback(() => toggleLeftDrawer(false), [toggleLeftDrawer]);
  const closeRightDrawer = useCallback(() => toggleRightDrawer(false), [toggleLeftDrawer]);
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

  useEffect(() => {
    return navigator.listen(closeAllDrawers);
  }, []);

  const [leftWidth, leftDuration, leftOpacity] = useDrawerOptions(LeftDrawer);
  const [rightWidth, rightDuration, rightOpacity] = useDrawerOptions(RightDrawer);

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
            activateRight && ({ transitionDuration: rightDuration } as unknown as ViewStyle)
          ]}
        >
          <Header />
          {children}
          <Footer />

          <TouchableWithoutFeedback onPress={closeAllDrawers}>
            <View
              style={[
                styles.containerOverlay,
                leftDrawerOpen && { opacity: leftOpacity },
                rightDrawerOpen && { opacity: rightOpacity },
                (activateLeft || activateRight) && styles.containerOverlayActive,
                activateLeft &&
                  ({
                    transitionDuration: leftDuration
                  } as unknown as ViewStyle),
                activateRight &&
                  ({
                    transitionDuration: rightDuration
                  } as unknown as ViewStyle)
              ]}
            />
          </TouchableWithoutFeedback>
        </View>

        {LeftDrawer && (
          <DrawerContainer
            position='left'
            width={leftWidth}
            open={leftDrawerOpen}
            style={LeftDrawer.options?.style}
            animationDuration={leftDuration}
            onChange={setLeftActive}
          >
            <LeftDrawer close={closeLeftDrawer} />
          </DrawerContainer>
        )}

        {RightDrawer && (
          <DrawerContainer
            position='right'
            width={rightWidth}
            open={rightDrawerOpen}
            style={RightDrawer.options?.style}
            animationDuration={rightDuration}
            onChange={setRightActive}
          >
            <RightDrawer close={closeRightDrawer} />
          </DrawerContainer>
        )}
      </View>
    </InjectedContextProvider>
  );
};
