import React, { Component } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { fontSize, palette } from '../styles/variables';
import { fetchCMS } from '../lib/cms';
import { ImageWithOverlay } from '@brandingbrand/fscomponents';

const styles = StyleSheet.create({
  container: {
    height: 30,
    backgroundColor: palette.primary
  },
  text: {
    fontSize: fontSize.small,
    textAlign: 'center',
    color: palette.onPrimary
  },
  imageWithOverlay: {
    flex: 1
  }
});

export const kPromoImageKey = 'Banner-Promo-Image';
export const kPromoDescriptionKey = 'Banner-Promo-Description';
export const kPromoBackgroundColorKey = 'Background-Color';

export interface PSGlobalBannerSlotItem {
  [kPromoImageKey]?: object;
  [kPromoDescriptionKey]: string;
  [kPromoBackgroundColorKey]?: string;
}

export interface PSGlobalBannerProps {
  cmsGroup: string;
  cmsSlot: string;
  cmsIdentifier?: string;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  fontColor?: string;
  override?: PSGlobalBannerSlotItem;
}

export interface PSGlobalBannerState {
  slotData: any;
  isLoading: boolean;
}

export default class PSGlobalBanner extends Component<
  PSGlobalBannerProps,
  PSGlobalBannerState
> {
  state: PSGlobalBannerState = {
    slotData: null,
    isLoading: true
  };

  componentWillMount(): void {
    if (this.props.override) {
      this.setState({
        slotData: this.props.override,
        isLoading: false
      });
    } else {
      fetchCMS(
        this.props.cmsGroup,
        this.props.cmsSlot,
        this.props.cmsIdentifier
      )
        .then(data =>
          this.setState({
            isLoading: false,
            slotData: data && data.length && data[0]
          })
        )
        .catch(e => {
          console.warn('error fetching cms slot ', e);
          this.setState({ isLoading: false });
        });
    }
  }

  render(): React.ReactNode {
    const { slotData, isLoading } = this.state;

    if (isLoading) {
      return <View style={styles.container} />;
    }

    if (!slotData || !slotData[kPromoDescriptionKey]) {
      return null;
    }

    const promoImg = slotData[kPromoImageKey];
    const containerStyle = [
      styles.container,
      this.props.backgroundColor
        ? { backgroundColor: this.props.backgroundColor }
        : null,
      slotData[kPromoBackgroundColorKey]
        ? { backgroundColor: slotData[kPromoBackgroundColorKey] }
        : null,
      promoImg && promoImg.height ? { height: promoImg.height } : null
    ];

    if (promoImg && promoImg.path) {
      return (
        <View style={containerStyle}>
          <ImageWithOverlay
            style={styles.imageWithOverlay}
            overlayPosition='center'
            imageProps={{ source: promoImg.path }}
            overlay={this.renderOverlay()}
          />
        </View>
      );
    }

    return null;
  }

  renderOverlay(): JSX.Element {
    const textStyle = [
      styles.text,
      this.props.fontColor ? { color: this.props.fontColor } : null,
      this.state.slotData['Text-Color']
        ? { color: this.state.slotData['Text-Color'] }
        : null
    ];
    return (
      <Text style={textStyle}>
        {this.state.slotData[kPromoDescriptionKey]}
      </Text>
    );
  }
}
