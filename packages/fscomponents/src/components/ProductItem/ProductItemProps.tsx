import {
  ImageStyle,
  ImageURISource,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { ButtonProps } from '../Button';
import { ReviewIndicatorProps } from '../ReviewIndicator';
import { SwatchesProps, SwatchItemType } from '../Swatches';

export interface ProductItemProps extends CommerceTypes.Product {
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  brandStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  priceStyle?: StyleProp<TextStyle>;
  originalPriceStyle?: StyleProp<TextStyle>;
  salePriceStyle?: StyleProp<TextStyle>;
  promoContainerStyle?: StyleProp<ViewStyle>;
  promoStyle?: StyleProp<TextStyle>;
  variantText?: string;
  variantTextStyle?: StyleProp<TextStyle>;
  reviewStyle?: StyleProp<ViewStyle>;
  reviewCountStyle?: StyleProp<TextStyle>;
  reviewIndicatorProps?: ReviewIndicatorProps;
  extraElement?: JSX.Element;
  swatchItems?: SwatchItemType[];
  swatchStyle?: StyleProp<ViewStyle>;
  swatchesProps?: SwatchesProps;

  /**
   * @deprecated you probably want FSCommerce's "promotions"
   */
  promos?: string[];
  /**
   * @deprecated you probably want FSCommerce's "images"
   */
  image?: ImageURISource;
  /**
   * @deprecated you probably want FSCommerce's "reviews"
   */
  reviewValue?: number;
  /**
   * @deprecated you probably want FSCommerce's "reviews"
   */
  reviewCount?: number;

  // button
  buttonText?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  buttonProps?: ButtonProps;
  onButtonPress?: () => void;
  renderButton?: () => React.ReactNode;

  // fav button
  onFavButtonPress?: () => void;
  favButtonImage?: ImageURISource;
  renderFavButton?: () => React.ReactNode;

  // custom render
  renderPrice?: () => React.ReactNode;
  renderPromos?: () => React.ReactNode;
  renderTitle?: () => React.ReactNode;
  renderVariantText?: () => React.ReactNode;
  renderBrand?: () => React.ReactNode;
  renderImage?: () => React.ReactNode;
  renderReviews?: () => React.ReactNode;
  renderSwatches?: () => React.ReactNode;
}
