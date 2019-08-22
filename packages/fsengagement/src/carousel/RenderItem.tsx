/* tslint:disable */
import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { itemWidth } from './SliderEntry.style';

export interface RenderItemProps {
  data?: any;
  parallax?: any;
  parallaxProps?: any;
  even?: boolean;
}
export default class RenderItem extends Component<RenderItemProps> {
  get image(): any {
    const { data: { source }, parallax, parallaxProps, even } = this.props;

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
        <Image
          source={source}
          style={styles.image}
        />
      );
  }
  onImagePress = (): void => {
    return;
  }
  render() {
    const { data: { ratio, title, subtitle }, even } = this.props;
    let heightStyle: any = {};
    if (ratio && itemWidth) {
      heightStyle = {
        height: itemWidth / parseFloat(ratio)
      };
    }
    console.log('image width: '+ itemWidth)
    console.log('image height: ' + heightStyle.height)
    const uppercaseTitle = title ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
        numberOfLines={2}
      >
        {title.toUpperCase()}
      </Text>
    ) : false;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.slideInnerContainer, heightStyle]}
        onPress={this.onImagePress}
      >
        {/* <View style={styles.shadow} /> */}
        <View style={[styles.imageContainerNoCard, even ? {} : {}]}>
          {this.image}
          {/* <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} /> */}
        </View>
        {title && <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
          {uppercaseTitle}
          <Text
            style={[styles.subtitle, even ? styles.subtitleEven : {}]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </View>}
      </TouchableOpacity>
    );
  }
}
