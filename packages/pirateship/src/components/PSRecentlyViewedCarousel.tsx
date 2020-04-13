import React, { FunctionComponent, memo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import PSProductCarousel from './PSProductCarousel';
import { border, palette } from '../styles/variables';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import translate, { translationKeys } from '../lib/translations';
import { Navigator } from '@brandingbrand/fsapp';

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: border.color,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column'
  },
  recentTitle: {
    color: palette.onBackground,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 15
  },
  recentProductsCarousel: {
    marginVertical: 20
  }
});

export interface PSRecentlyViewedCarouselProps {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  carouselStyle?: StyleProp<ViewStyle>;
  items: CommerceTypes.Product[];
  navigator: Navigator;
}

const PSRecentlyViewedCarousel: FunctionComponent<PSRecentlyViewedCarouselProps> =
(props): JSX.Element => {

  const handlePromotedProductPress = (productId: string) => () => {
    props.navigator.push({
      component: {
        name: 'ProductDetail',
        passProps: {
          productId
        }
      }
    }).catch(e => console.warn('ProductDetail PUSH error: ', e));
  };

  return (
    <View style={[styles.container, props.containerStyle]}>
      <Text style={[styles.recentTitle, props.titleStyle]}>
        {translate.string(translationKeys.screens.productDetail.recentlyViewed)}
      </Text>
      <PSProductCarousel
        style={[styles.recentProductsCarousel, props.carouselStyle]}
        items={props.items.map(prod => ({
          ...prod,
          image: (prod.images || []).find(img => !!img.uri),
          onPress: handlePromotedProductPress(prod.id),
          key: prod.id
        }))}
      />
    </View>
  );
};

export default memo(PSRecentlyViewedCarousel);
