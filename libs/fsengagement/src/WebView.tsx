import React, { PureComponent } from 'react';

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';

import type { Navigator } from '@brandingbrand/fsapp/legacy';
import { makeLegacyScreen } from '@brandingbrand/fsapp/legacy';

import backArrow from '../assets/images/backArrow.png';

import type { Action, ScreenProps } from './types';

const styles = StyleSheet.create({
  growStretch: {
    alignSelf: 'stretch',
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12,
  },
  backIcon: {
    width: 14,
    height: 25,
  },
});

export interface WebViewProps extends ScreenProps {
  actions: Action;
  navigator: Navigator;
  isBlog?: boolean;
  backButton?: boolean;
}

class EngagementWebView extends PureComponent<WebViewProps> {
  private readonly navigationEventListener: any;

  private async navigationButtonPressed({ buttonId }: any): Promise<any> {
    if (buttonId === 'close') {
      return this.props.navigator.dismissModal();
    }
  }

  private readonly onBackPress = async (): Promise<void> => this.props.navigator.pop();

  private injectBlogJS(): string {
    return this.props.isBlog
      ? `var els = document.querySelectorAll(
      ".site-header, .notice-bar, .site-footer, .site-footer__navigation");
      for (i=0;i<els.length;i++) { els[i].style.display = 'none'; }`
      : ``;
  }

  public componentDidMount(): void {}

  public componentWillUnmount(): void {
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
  }

  public render(): JSX.Element {
    const {
      actions: { value },
    } = this.props;
    return (
      <View style={styles.growStretch}>
        <WebView source={{ uri: value }} injectedJavaScript={this.injectBlogJS()} />
        {this.props.backButton && (
          <TouchableOpacity onPress={this.onBackPress} style={styles.backButton}>
            <Image resizeMode="contain" source={backArrow} style={styles.backIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default makeLegacyScreen(EngagementWebView, [], {});
