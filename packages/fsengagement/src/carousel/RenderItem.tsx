/* tslint:disable */
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { ParallaxImage, ParallaxImageProps } from 'react-native-snap-carousel';
import styles from './SliderEntry.style';
import { Navigator } from '@brandingbrand/fsapp';

interface DataProps {
  source: ImageSourcePropType;
  ratio: string;
  title: string;
  subtitle: string;
}

export interface RenderItemProps<T> {
  data: T;
  index?: number;
  parallax?: boolean;
  parallaxProps?: ParallaxImageProps;
  even?: boolean;
  navigator: Navigator;
  onPressOpenModal?: boolean;
  isDemoProduct?: boolean;
  horizPadding: number;
  itemWidth: number;
}

const { height: viewportHeight } = Dimensions.get('window');

export default class RenderItem<T extends DataProps> extends Component<RenderItemProps<T>> {
  get image(): React.ReactElement {
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
  onPress = () => {
    return false;
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

    let itemStyle: StyleProp<ViewStyle> = {};
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
        onPress={this.onPress}
      >
        <View style={[styles.imageContainerNoCard, even ? {} : {}]}>
          {this.image}
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
