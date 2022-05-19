import React, { Component } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { CTABlock } from './CTABlock';
import { TextBlock } from './TextBlock';

export interface TextBannerProps {
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
}

export default class TextBannerBlock extends Component<TextBannerProps> {
  public render(): JSX.Element {
    const { containerStyle, contents } = this.props;

    return (
      <View style={containerStyle}>
        {contents.Eyebrow.enabled && <TextBlock {...contents.Eyebrow} />}
        <TextBlock {...contents.Text} />
        <CTABlock {...contents.CTA} />
      </View>
    );
  }
}
