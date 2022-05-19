import type { FC } from 'react';
import React from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PageIndicator } from '@brandingbrand/fscomponents';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import ghostStar from '../../assets/images/ghostStar.png';
import ContentLoader, { Rect } from '../lib/RNContentLoader';

const icons = {
  ghostStar,
};

const baseStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 100,
    height: 55,
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 1,
  },
  buttonWrapper: {
    paddingHorizontal: 20,
  },
  ghostContentWrapper: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 22,
    paddingBottom: 24,
    paddingHorizontal: 15,
  },
  imageContainer: {
    marginBottom: 15,
  },
  pagination: {
    marginTop: 15,
  },
  paginationActive: {
    marginTop: 15,
  },
  starsWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 24,
    marginRight: 27,
  },
});

export interface SerializableProductDetailGhostProps {
  /**
   * Styles to container
   */
  containerStyle?: ViewStyle;

  /**
   * Styles to apply to the default pagination
   */
  paginationStyle?: ViewStyle;

  /**
   * Styles to apply to the default paginationActive
   */
  paginationActiveStyle?: ViewStyle;

  /**
   * Styles to apply to the default ghostContentWrapper
   */
  ghostContentWrapperStyle?: ViewStyle;

  /**
   * Styles to apply to the default starsWrapper
   */
  starsWrapperStyle?: ViewStyle;

  /**
   * Styles to apply to the default buttonWrapper
   */
  buttonWrapperStyle?: ViewStyle;

  /**
   * Styles to apply to the default button
   */
  buttonStyle?: ViewStyle;

  /**
   * Styles to apply to the default buttonText
   */
  buttonTextStyle?: TextStyle;

  /**
   * Main width screen
   */
  screenWidth?: number;

  /**
   * Count of indicators
   */
  countPages?: number;

  /**
   * Image height
   */
  imageHeight?: number;

  /**
   * Title width
   */
  titleWidth?: number;
}

export interface ProductDetailGhostProps
  extends Omit<
    SerializableProductDetailGhostProps,
    | 'buttonStyle'
    | 'buttonTextStyle'
    | 'buttonWrapperStyle'
    | 'containerStyle'
    | 'countPages'
    | 'ghostContentWrapperStyle'
    | 'imageHeight'
    | 'paginationActiveStyle'
    | 'paginationStyle'
    | 'screenWidth'
    | 'starsWrapperStyle'
    | 'titleWidth'
  > {
  containerStyle?: StyleProp<ViewStyle>;
  paginationStyle?: StyleProp<ViewStyle>;
  paginationActiveStyle?: StyleProp<ViewStyle>;
  ghostContentWrapperStyle?: StyleProp<ViewStyle>;
  starsWrapperStyle?: StyleProp<ViewStyle>;
  buttonWrapperStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  screenWidth?: number;
  countPages?: number;
  imageHeight?: number;
  titleWidth?: number;
}

const ProductDetailGhost: FC<ProductDetailGhostProps> = (props: ProductDetailGhostProps) => {
  const dimmensionWidth = Dimensions.get('screen').width;

  const {
    containerStyle,
    paginationStyle,
    paginationActiveStyle,
    ghostContentWrapperStyle,
    starsWrapperStyle,
    buttonWrapperStyle,
    buttonStyle,
    buttonTextStyle,
    screenWidth = dimmensionWidth,
    imageHeight,
    titleWidth,
    countPages,
  } = props;

  const mainImageHeight = imageHeight ? imageHeight : 443;
  const titleWidthSection = titleWidth ? titleWidth : 155;
  const starArray = Array.from({ length: 5 }).fill({});

  return (
    <ScrollView style={containerStyle}>
      <View style={baseStyles.imageContainer}>
        <ContentLoader
          height={mainImageHeight}
          viewBox={`0 0 ${screenWidth} ${mainImageHeight}`}
          width={screenWidth}
        >
          <Rect height={mainImageHeight} rx="4" ry="4" width={screenWidth} x="0" y="0" />
        </ContentLoader>
      </View>
      <PageIndicator
        currentIndex={0}
        dotActiveStyle={paginationActiveStyle}
        dotStyle={paginationStyle}
        itemsCount={countPages || 3}
      />
      <View style={[baseStyles.ghostContentWrapper, ghostContentWrapperStyle]}>
        <ContentLoader
          height={24}
          viewBox={`0 0 ${titleWidthSection} 24`}
          width={titleWidthSection}
        >
          <Rect height="24" rx="4" ry="4" width={titleWidthSection} x="0" y="0" />
        </ContentLoader>
        <View style={[baseStyles.starsWrapper, starsWrapperStyle]}>
          {starArray.map((elem, i: number) => (
            <Image key={i} source={icons.ghostStar} />
          ))}
        </View>
      </View>
      <View style={[baseStyles.buttonWrapper, buttonWrapperStyle]}>
        <View style={[baseStyles.button, buttonStyle]}>
          <Text style={[baseStyles.buttonText, buttonTextStyle]}>
            {FSI18n.string(translationKeys.flagship.productIndex.addToBag)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetailGhost;
