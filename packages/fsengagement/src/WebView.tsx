import React, { PureComponent } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { EventSubscription } from 'react-native-navigation';

import {
  Action,
  ScreenProps
} from './types';
import WebView from 'react-native-webview';

const styles = StyleSheet.create({
  growStretch: {
    alignSelf: 'stretch',
    flexGrow: 1
  },
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12
  },
  backIcon: {
    width: 14,
    height: 25
  }
});

const backArrow = require('../assets/images/backArrow.png');

export interface WebViewProps extends ScreenProps {
  actions: Action;
  isBlog?: boolean;
  backButton?: boolean;
}

export default class EngagementWebView extends PureComponent<WebViewProps> {
  navigationEventListener?: EventSubscription | null;
  constructor(props: WebViewProps) {
    super(props);
  }

  componentDidMount(): void {
    this.navigationEventListener = this.props.navigator.bindNavigation(this);
  }

  componentWillUnmount(): void {
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
  }

  async navigationButtonPressed({ buttonId }: any): Promise<any> {
    if (buttonId === 'close') {
      return this.props.navigator.dismissModal();
    }
  }

  onBackPress = async (): Promise<void> => {
    return this.props.navigator.pop();
  }

  injectBlogJS(): string {
    return this.props.isBlog ? `var els = document.querySelectorAll(
      ".site-header, .notice-bar, .site-footer, .site-footer__navigation");
      for (i=0;i<els.length;i++) { els[i].style.display = 'none'; }` : ``;
  }

  render(): JSX.Element {
    const { actions: { value } } = this.props;
    return (
      <View style={styles.growStretch}>
        <WebView
          source={{ uri: value }}
          injectedJavaScript={this.injectBlogJS()}
        />
        {this.props.backButton && (
          <TouchableOpacity onPress={this.onBackPress} style={styles.backButton}>
            <Image
              resizeMode='contain'
              source={backArrow}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
