import React, { Component, RefObject } from 'react';
import { Linking, Platform, StyleSheet, View, WebView } from 'react-native';
import url from 'url';

import { Loading } from '@brandingbrand/fscomponents';

import PSScreenWrapper from '../components/PSScreenWrapper';
import { handleDeeplink } from '../lib/deeplinkHandler';

import { backButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';

const appEnv = require('../../env/env');
const { apiHost } = appEnv;

// patch existing post message function on desktop to prevent error
// detail https://github.com/facebook/react-native/issues/10865#issuecomment-269847703
// tslint:disable
export const patchPostMessageFunction = function() {
  const originalPostMessage = window.postMessage;
  const patchedPostMessage = function(message: any, targetOrigin: string, transfer: any[]) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace(
      'hasOwnProperty',
      'postMessage'
    );
  };

  window.postMessage = patchedPostMessage;
};

const injectedJSToGrabTitle = `
  (${String(patchPostMessageFunction)})();
  setTimeout(function() {
    document.title && window.postMessage('title:'+ document.title);
  }, 500);
`;
// tslint:enable

export interface DesktopPassthroughProps extends ScreenProps {
  url?: string;
  html?: string;
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  verticalAlignCenter: {
    justifyContent: 'center'
  }
});

export default class DesktopPassthrough extends Component<DesktopPassthroughProps> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  isFirstPageview: boolean = true;
  previousUrl?: string;
  path?: string;
  host?: string;
  hash: string = '';
  desktopWebView: RefObject<WebView>;

  constructor(props: DesktopPassthroughProps) {
    super(props);

    this.desktopWebView = React.createRef<WebView>();
  }

  componentWillMount(): void {
    this.isFirstPageview = true;

    if (this.props.url) {
      const urlParts = url.parse(this.props.url);
      this.path = urlParts.path;
      this.host = urlParts.host;
      this.hash = urlParts.hash || '';
    }
  }

  webviewOnError = (error: any): void => {
    console.log(error);

    this.props.navigator.popToRoot();
  }

  // tslint:disable-next-line:cyclomatic-complexity
  onNavigationStateChange = (state: any): boolean => {
    // this event fires multiple times per url
    // we only want to catch loading urls, not urls that have completed loading
    if (Platform.OS === 'android' && !state.loading) {
      return true;
    }

    // onNavigationStateChange gets called for every request -- including those to
    // analytics and similar services -- so make sure a request is to the same domain
    // before handling it.

    // allow rendering html directly in the webview
    if (state.url.indexOf('data:text/html') > -1) {
      return true;
    }

    if (state.url.indexOf(apiHost) > -1 && state.url.indexOf('/help#') === -1) {
      // Check for url !== prevUrl because of known RN bug that calls navigation
      // events multiple times; see https://github.com/facebook/react-native/issues/4945
      if (
        !this.isFirstPageview &&
        this.previousUrl &&
        state.url !== this.previousUrl
      ) {
        const urlParts = url.parse(state.url);

        // Navigate back to an app screen if we know how to handle the URL or push a new
        // passthrough screen if not.
        handleDeeplink(
          urlParts.protocol + '//' + this.host + urlParts.path,
          this.props.navigator
        );

        // Since we're pushing a new screen we return false so the webview doesn't navigate
        // to the new url.
        if (this.desktopWebView.current) {
          this.desktopWebView.current.stopLoading(); // for android
        }

        return false;
      }

      this.previousUrl = state.url;
      this.isFirstPageview = false;
    } else if (state.navigationType === 'click' || Platform.OS === 'android') {
      // Android does not provide navigationType, but this
      // does not seem to be called on every request like
      // it does on iOS, triggering from onShouldStartLoadWithRequest.
      Linking.canOpenURL(state.url).then(supported => {
        if (!supported) {
          console.warn(`Unable to open url ${state.url}`);
          return;
        } else {
          return Linking.openURL(state.url).catch(
            err => console.warn(`Unable to open url ${state.url}`, err)
          );
        }
      }).catch(
        err => console.warn(`Unable to open url ${state.url}`, err)
      );

      // Don't follow with webview.
      if (this.desktopWebView.current) {
        this.desktopWebView.current.stopLoading(); // for android
      }

      return false;
    }

    return true;
  }

  renderLoading = (): JSX.Element => {
    return (
      <View style={[styles.flex1, styles.verticalAlignCenter]}>
        <Loading />
      </View>
    );
  }

  handleMessage = (e: any) => {
    if (e.nativeEvent.data && e.nativeEvent.data.indexOf('title:') === 0) {
      this.props.navigator.setTitle({
        title: e.nativeEvent.data.replace('title:', '')
      });
    }
  }

  render(): JSX.Element {
    const { navigator } = this.props;
    if (this.path && this.path.split('.').pop() === 'pdf') {
      const pdfUrl =
        Platform.OS === 'android'
          ? 'http://docs.google.com/gview?embedded=true&url=' + this.props.url
          : apiHost + this.path;
      return (
        <PSScreenWrapper
          scroll={false}
          navigator={navigator}
        >
          <View style={styles.flex1}>
            <WebView source={{ uri: pdfUrl }} />
          </View>
        </PSScreenWrapper>
      );
    } else {
      const source = this.path ?
        { uri: apiHost + this.path + this.hash } :
        { html: this.props.html };
      return (
        <PSScreenWrapper
          scroll={false}
          hideGlobalBanner={!!this.props.html}
          hideWebHeader={!!this.props.html}
          navigator={navigator}
        >
          <View style={styles.flex1}>
            <WebView
              ref={this.desktopWebView}
              source={source}
              onError={this.webviewOnError}
              javaScriptEnabled={true}
              onNavigationStateChange={this.onNavigationStateChange}
              onShouldStartLoadWithRequest={this.onNavigationStateChange}
              startInLoadingState={true}
              renderLoading={this.renderLoading}
              onMessage={this.handleMessage}
              injectedJavaScript={injectedJSToGrabTitle}
            />
          </View>
        </PSScreenWrapper>
      );
    }
  }
}
