import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleProp,
  View,
  ViewStyle
} from 'react-native';

import TextBlock from './TextBlock';
import CTABlock from './CTABlock';

export interface TextBannerProps {
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
}

export default class TextBannerBlock extends Component<TextBannerProps> {
  static contextTypes: any = {
    handleAction: PropTypes.func
  };
  render(): JSX.Element {
    const {
      containerStyle,
      contents
    } = this.props;

    return (
      <View style={containerStyle}>
        {contents.Eyebrow.enabled && <TextBlock
          {...contents.Eyebrow}
        />}
        <TextBlock
          {...contents.Text}
        />
        <CTABlock
          {...contents.CTA}
        />
      </View>
    );
  }
}
