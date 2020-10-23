import React, { PureComponent } from 'react';
import { Navigator } from '@brandingbrand/fsapp';
import {
  Animated,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  SafeAreaView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import PSGlobalBanner from './PSGlobalBanner';
import Header from './Header';
import { palette } from '../styles/variables';
import { CMSBannerSlot } from '../lib/cms';

const keyboardAvoidingDefaults: KeyboardAvoidingViewProps = {
  behavior: Platform.OS === 'ios' ? 'padding' : undefined,
  keyboardVerticalOffset: 0,
  style: { flex: 1 }
};
const styles = StyleSheet.create({
  background: {
    backgroundColor: palette.background
  },
  container: {
    flex: 1
  }
});

export interface PSScreenWrapperProps {
  style?: StyleProp<ViewStyle>;

  hideGlobalBanner?: boolean;
  overrideGlobalBanner?: CMSBannerSlot;

  navigator: Navigator;

  needInSafeArea?: boolean;

  // Whether or not the wrapper should scroll it's children. Defaults to true
  scroll?: boolean;
  scrollViewProps?: ScrollViewProps;

  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  // tslint:disable-next-line:whitespace
  hideWebHeader?: boolean;
}

interface Position {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface PSScreenWrapperStateType {
  safeAreaInsets: Position;
}

export default class PSScreenWrapper extends PureComponent<
  PSScreenWrapperProps, PSScreenWrapperStateType
  > {
  state: PSScreenWrapperStateType = {
    safeAreaInsets: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  };

  constructor(props: PSScreenWrapperProps) {
    super(props);

    if (props.needInSafeArea) {
      // TODO: Update these with proper types from react-native-safe-area
      /*SafeArea.getSafeAreaInsetsForRootView()
        .then((result: any) => {
          const { safeAreaInsets } = result;
          this.setState({ safeAreaInsets });
        })
        .catch((e: any) => console.warn('Unable to get Safe Area Insets', e));*/
    }
  }

  componentDidMount(): void {
    if (this.props.needInSafeArea) {
      /*SafeArea.addEventListener(
        'safeAreaInsetsForRootViewDidChange',
        this.onSafeAreaInsetsForRootViewChange
      );*/
    }
  }

  componentWillUnmount(): void {
    if (this.props.needInSafeArea) {
      /*SafeArea.removeEventListener(
        'safeAreaInsetsForRootViewDidChange',
        this.onSafeAreaInsetsForRootViewChange
      );*/
    }
  }

  onSafeAreaInsetsForRootViewChange = (result: {
    safeAreaInsets: Position;
  }) => {
    const { safeAreaInsets } = result;
    this.setState({ safeAreaInsets });
  }

  getKeyboardAvoidingOptions = (): KeyboardAvoidingViewProps => {
    const { keyboardAvoidingViewProps, needInSafeArea } = this.props;
    const { safeAreaInsets } = this.state;

    const options = {
      ...keyboardAvoidingDefaults,
      ...keyboardAvoidingViewProps
    };

    /**
     * Fix keyboardVerticalOffset when in a SafeAreaView.
     *
     * When wrapped in a SafeAreaView, the KeyboardAvoidingView does not
     * account for the SafeAreaView inset padding when calculating the
     * keyboardVerticalOffset.
     */
    if (needInSafeArea && options.keyboardVerticalOffset && options.keyboardVerticalOffset > 0) {
      options.keyboardVerticalOffset += safeAreaInsets.bottom;
    }

    return options;
  }

  render(): JSX.Element {
    const {
      children,
      hideGlobalBanner,
      hideWebHeader = false,
      needInSafeArea,
      overrideGlobalBanner,
      scroll,
      scrollViewProps,
      style
    } = this.props;
    const keyboardAvoidingOptions = this.getKeyboardAvoidingOptions();
    const Container = needInSafeArea ? SafeAreaView : View;
    let contents;

    if (scroll === undefined || scroll) {
      // Scroll by default unless we're explicitly passed false

      contents = (
        <Animated.ScrollView {...scrollViewProps}>
          {children}
        </Animated.ScrollView>
      );
    } else {
      contents = children;
    }

    return (
      <Container style={[styles.container, styles.background, style]}>
        <KeyboardAvoidingView {...keyboardAvoidingOptions}>
          {!hideGlobalBanner && (
            <PSGlobalBanner
              cmsGroup='Shop'
              cmsSlot='Top-Ticker'
              override={overrideGlobalBanner}
            />
          )}
          {!hideWebHeader && (
            <Header
              navigator={this.props.navigator}
            />
          )}
          {contents}
        </KeyboardAvoidingView>
      </Container>
    );
  }
}
