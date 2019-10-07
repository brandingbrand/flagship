import React, { Component } from 'react';

import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.reviews;

const S = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20
  },
  syndicatedLabel: {
    color: '#767676',
    fontSize: 13,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

export interface SyndicationIndicatorProps {
  syndicationSource: any;
  rowStyle?: StyleProp<ViewStyle>;
}

export interface SyndicationIndicatorState {
  syndicatedImageHeight?: number;
  syndicatedImageWidth?: number;
}

export default class SyndicationIndicator extends
Component<SyndicationIndicatorProps, SyndicationIndicatorState> {
  constructor(props: SyndicationIndicatorProps) {
    super(props);
    this.state = {};
  }

  getImageSizeSuccess = (w: number, h: number) => {
    if (!this.state.syndicatedImageHeight || !this.state.syndicatedImageWidth) {
      this.setState({
        syndicatedImageHeight: h,
        syndicatedImageWidth: w
      });
    }
  }

  async componentDidMount(): Promise<void> {
    Image.getSize(
      this.props.syndicationSource.LogoImageUrl,
      this.getImageSizeSuccess,
      () => null
    );
  }

  render(): JSX.Element {
    return (
      <View
        style={[
          S.row, { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20 },
          this.props.rowStyle
        ]}
      >
        <Image
          style={{
            height: this.state.syndicatedImageHeight,
            width: this.state.syndicatedImageWidth,
            marginRight: 6
          }}
          source={{uri: this.props.syndicationSource.LogoImageUrl}}
          accessibilityLabel={`${this.props.syndicationSource.Name} logo`}
        />
        <Text style={[S.syndicatedLabel]}>
          {FSI18n.string(componentTranslationKeys.syndicatedLabel, {
            site: this.props.syndicationSource.Name
          })}
        </Text>
      </View>
    );

  }
}
