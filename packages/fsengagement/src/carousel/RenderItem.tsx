/* tslint:disable */
import React, { Component } from 'react';
import { Dimensions, Image, Share, Text, TouchableOpacity, View } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './SliderEntry.style';

export interface RenderItemProps {
  data?: any;
  parallax?: any;
  parallaxProps?: any;
  even?: boolean;
  horizPadding: number,
  itemWidth: number
}

const { height: viewportHeight } = Dimensions.get('window');

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
    Share.share({
      message: 'BAM: we\'re helping your business with awesome React Native apps',
      url: 'http://bam.tech',
      title: 'Wow, did you see that?'
    }, {
        // Android only:
        dialogTitle: 'Share BAM goodness',
        // iOS only:
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter'
        ]
      });
  }
  render() {
    const {
      data: {
        ratio,
        title,
        subtitle
      },
      even,
      itemWidth,
      horizPadding = 0
    } = this.props;

    let itemStyle: any = {};
    if (ratio && itemWidth) {
      itemStyle = {
        width: itemWidth,
        height: itemWidth / parseFloat(ratio),
        paddingHorizontal: horizPadding
      };
    } else {
      itemStyle = {
        width: itemWidth,
        height: viewportHeight * .36,
        paddingHorizontal: horizPadding
      };
    }
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
        style={itemStyle}
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
            style={styles.subtitle}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </View>}
      </TouchableOpacity>
    );
  }
}
