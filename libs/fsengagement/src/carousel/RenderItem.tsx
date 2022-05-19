import React, { Component } from 'react';

import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';

import styles from './SliderEntry.style';

export interface RenderItemProps {
  data?: any;
  index?: number;
  parallax?: unknown;
  parallaxProps?: unknown;
  even?: boolean;
  navigator: unknown;
  onPressOpenModal?: boolean;
  isDemoProduct?: boolean;
  horizPadding: number;
  itemWidth: number;
}

const { height: viewportHeight } = Dimensions.get('window');

export default class RenderItem extends Component<RenderItemProps> {
  private get image(): JSX.Element {
    const {
      data: { source },
      even,
      parallax,
      parallaxProps,
    } = this.props;

    return parallax ? (
      <ParallaxImage
        source={source}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image source={source} style={styles.image} />
    );
  }

  private readonly onPress = () => false;

  public render(): JSX.Element {
    const {
      data: { ratio, subtitle, title },
      even,
      horizPadding = 0,
      itemWidth,
    } = this.props;

    let itemStyle: any = {};
    itemStyle =
      ratio && itemWidth
        ? {
            width: itemWidth,
            height: itemWidth / Number.parseFloat(ratio),
            paddingHorizontal: horizPadding,
          }
        : {
            width: itemWidth,
            height: viewportHeight * 0.36,
            paddingHorizontal: horizPadding,
          };
    const uppercaseTitle = title ? (
      <Text style={[styles.title, even ? styles.titleEven : {}]} numberOfLines={2}>
        {title.toUpperCase()}
      </Text>
    ) : (
      false
    );

    return (
      <TouchableOpacity activeOpacity={1} style={itemStyle} onPress={this.onPress}>
        <View style={[styles.imageContainerNoCard, even ? {} : {}]}>{this.image}</View>
        {title && (
          <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
            {uppercaseTitle}
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
