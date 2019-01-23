import React, { PureComponent } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, WebView } from 'react-native';

import {
  Action,
  ScreenProps
} from './types';

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
  constructor(props: WebViewProps) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = (event: any) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal();
      }
    }
  }

  onBackPress = (): void => {
    this.props.navigator.pop();
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
        {this.props.backButton &&
          <TouchableOpacity onPress={this.onBackPress} style={styles.backButton}>
            <Image
              resizeMode='contain'
              source={backArrow}
              style={styles.backIcon}
            />
          </TouchableOpacity>}
      </View>
    );
  }
}
