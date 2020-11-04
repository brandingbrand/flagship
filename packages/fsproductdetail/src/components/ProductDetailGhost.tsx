import React, { FC } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import ContentLoader, { Rect } from '../lib/RNContentLoader';
import { PageIndicator } from '@brandingbrand/fscomponents';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const baseStyles = StyleSheet.create({
  imageContainer: {
    marginBottom: 15
  },
  pagination: {
    marginTop: 15
  },
  paginationActive: {
    marginTop: 15
  },
  ghostContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 22,
    paddingBottom: 24,
    marginBottom: 20,
    borderBottomWidth: 1
  },
  starsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    marginRight: 27
  },
  buttonWrapper: {
    paddingHorizontal: 20
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 100,
    height: 55,
    width: '100%'
  },
  buttonText: {
    fontWeight: '500',
    color: '#fff',
    fontSize: 18,
    letterSpacing: 1
  }
});

const icons = {
  ghostStar: require('../../assets/images/ghostStar.png')
};

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

export interface ProductDetailGhostProps extends Omit<
  SerializableProductDetailGhostProps,
  'containerStyle' |
  'paginationStyle' |
  'paginationActiveStyle' |
  'ghostContentWrapperStyle' |
  'starsWrapperStyle' |
  'buttonWrapperStyle' |
  'buttonStyle' |
  'buttonTextStyle' |
  'screenWidth' |
  'countPages' |
  'imageHeight' |
  'titleWidth'
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
    countPages
  } = props;

  const mainImageHeight = !!imageHeight ? imageHeight : 443;
  const titleWidthSection = !!titleWidth ? titleWidth : 155;
  const starArray = new Array(5).fill({});

  return (
    <ScrollView style={containerStyle}>
      <View style={baseStyles.imageContainer}>
        <ContentLoader
          width={screenWidth}
          height={mainImageHeight}
          viewBox={`0 0 ${screenWidth} ${mainImageHeight}`}
        >
          <Rect x='0' y='0' rx='4' ry='4' width={screenWidth} height={mainImageHeight}/>
        </ContentLoader>
      </View>
      <PageIndicator
        currentIndex={0}
        itemsCount={countPages || 3}
        dotStyle={paginationStyle}
        dotActiveStyle={paginationActiveStyle}
      />
      <View style={[baseStyles.ghostContentWrapper, ghostContentWrapperStyle]}>
        <ContentLoader
          width={titleWidthSection}
          height={24}
          viewBox={`0 0 ${titleWidthSection} 24`}
        >
          <Rect x='0' y='0' rx='4' ry='4' width={titleWidthSection} height='24'/>
        </ContentLoader>
        <View style={[baseStyles.starsWrapper, starsWrapperStyle]}>
          {starArray.map((elem, i: number) => {
            return (
              <Image
                key={i}
                source={icons.ghostStar}
              />
            );
          })}
        </View>
      </View>
      <View style={[baseStyles.buttonWrapper, buttonWrapperStyle]}>
        <View
          style={[baseStyles.button, buttonStyle]}
        >
          <Text style={[baseStyles.buttonText, buttonTextStyle]}>
            {FSI18n.string(translationKeys.flagship.productIndex.addToBag)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetailGhost;
