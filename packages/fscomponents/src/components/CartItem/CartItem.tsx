import React, { PureComponent } from 'react';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import { Stepper } from '../Stepper';
import { CartItemDetails } from './CartItemDetails';

const decreaseBtn = require('../../../assets/images/decreaseImage.png');
const increaseBtn = require('../../../assets/images/increaseImage.png');


export type CartItemUpdateQuantityFunction = (
  item: CommerceTypes.CartItem, qty: number
) => Promise<void>;

export type CartItemRemoveFunction = (item: CommerceTypes.CartItem) => Promise<void>;

export type CartItemRenderFunction = (
  item: CommerceTypes.CartItem,
  updateQty: CartItemUpdateQuantityFunction,
  remove: CartItemRemoveFunction
) => React.ReactNode;

export interface SerializableCartItemProps {
  /**
   * Styles to apply to the default stepper
   */
  stepperStyle?: ViewStyle;

  /**
   * Styles to apply to the default remove button
   */
  removeButtonStyle?: ViewStyle;

  /**
   * Styles to apply to the default remove button text
   */
  removeButtonTextStyle?: TextStyle;

  /**
   * Height of thumbnail image; required if image provided
   */
  imageHeight?: number;

  /**
   *  Width of thumbnail image; required if image provided
   */
  imageWidth?: number;

  /**
   * Styles to apply to the main container
   */
  style?: ViewStyle;

  /**
   * Styles to apply to the left (image) column
   */
  leftColumnStyle?: ViewStyle;

  /**
   *  Styles to apply to the right (details & quantity) column
   */
  rightColumnStyle?: ViewStyle;

  /**
   * Styles to apply to the quantity (stepper & remove button) row
   */
  quantityRowStyle?: ViewStyle;
}

export interface CartItemProps extends CommerceTypes.CartItem, Omit<
SerializableCartItemProps,
'stepperStyle' |
'removeButtonStyle' |
'removeButtonTextStyle' |
'style' |
'leftColumnStyle' |
'rightColumnStyle' |
'quantityRowStyle'
> {
  /**
   * A function to invoke when the user wants to remove the item from cart.
   */
  removeItem: CartItemRemoveFunction;

  /**
   * A function to invoke when the user wants to modify the quantity of an item in cart.
   */
  updateQty: CartItemUpdateQuantityFunction;

  /**
   * An optional custom render function to render the item details
   */
  renderDetails?: CartItemRenderFunction;

  /**
   * An optional custom render function to modify the item quantity
   */
  renderStepper?: CartItemRenderFunction;

  /**
   * Styles to apply to the default stepper
   */
  stepperStyle?: StyleProp<ViewStyle>;

  /**
   * An optional custom render function to render the remove button
   */
  renderRemoveButton?: CartItemRenderFunction;

  /**
   * Styles to apply to the default remove button
   */
  removeButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the default remove button text
   */
  removeButtonTextStyle?: StyleProp<TextStyle>;

  /**
   * A callback to invoke if the user taps on the image
   */
  onImagePress?: (item: CommerceTypes.CartItem) => void;

  /**
   *  An optional custom render function to render an arbitrary element displayed under the
   *  quantity. Typically used to display a promo message.
   */
  renderPromo?: CartItemRenderFunction;

  /**
   * Styles to apply to the main container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the left (image) column
   */
  leftColumnStyle?: StyleProp<ViewStyle>;

  /**
   *  Styles to apply to the right (details & quantity) column
   */
  rightColumnStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the quantity (stepper & remove button) row
   */
  quantityRowStyle?: StyleProp<ViewStyle>;
}

export interface CartItemState {
  image?: ImageURISource;
  imageStyle: StyleProp<ImageStyle>;
}

const defaultStyle = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 10
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  }
});

export class CartItem extends PureComponent<CartItemProps, CartItemState> {
  static defaultProps: Partial<CartItemProps> = {
    imageHeight: 100,
    imageWidth: 100
  };

  static getDerivedStateFromProps(
    nextProps: CartItemProps,
    prevState: CartItemState
  ): Partial<CartItemState> | null {
    return {
      image: nextProps.images && nextProps.images.find(img => !!img.uri),
      imageStyle: {
        height: nextProps.imageHeight,
        width: nextProps.imageWidth
      }
    };
  }

  state: CartItemState = {
    image: undefined,
    imageStyle: undefined
  };

  render(): React.ReactNode {
    const {
      itemText,
      leftColumnStyle,
      price,
      productId,
      quantity,
      quantityRowStyle,
      removeItem,
      renderDetails,
      renderPromo,
      renderStepper,
      rightColumnStyle,
      stepperStyle,
      style,
      totalPrice,
      updateQty
    } = this.props;

    return (
      <View style={[defaultStyle.container, style]}>
        {this.state.image && (
          <View style={leftColumnStyle}>
            {this.renderImage()}
          </View>
        )}
        <View style={[defaultStyle.rightColumn, rightColumnStyle]}>
          {renderDetails && renderDetails(this.props, updateQty, removeItem) || (
            <CartItemDetails
              itemText={itemText}
              productId={productId}
              price={price}
              totalPrice={totalPrice}
            />
          )}
          <View style={[defaultStyle.quantityRow, quantityRowStyle]}>
            {renderStepper && renderStepper(this.props, updateQty, removeItem) || (
              <Stepper
                count={quantity}
                stepperStyle={stepperStyle}
                onDecreaseButtonPress={this.handleDecrease}
                onIncreaseButtonPress={this.handleIncrease}
                decreaseButtonImage={decreaseBtn}
                increaseButtonImage={increaseBtn}
              />
            )}
            {this.renderRemoveButton()}
          </View>
          {renderPromo && renderPromo(this.props, updateQty, removeItem)}
        </View>
      </View>
    );
  }

  private renderRemoveButton = (): React.ReactNode => {
    const {
      renderRemoveButton,
      removeButtonStyle,
      removeButtonTextStyle,
      removeItem,
      updateQty
    } = this.props;

    if (renderRemoveButton) {
      return renderRemoveButton(this.props, updateQty, removeItem);
    }

    return (
      <TouchableOpacity onPress={this.handleRemove}>
        <View style={removeButtonStyle}>
          <Text style={removeButtonTextStyle}>
            {FSI18n.string(translationKeys.flagship.cart.actions.remove.actionBtn)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * Renders the cart item image.
   * @returns {React.ReactNode} The cart item image or null if there is no image.
   */
  private renderImage(): React.ReactNode {
    if (!this.state.image) {
      return null;
    }

    if (this.props.onImagePress) {
      return (
        <TouchableOpacity accessibilityTraits='link' onPress={this.handleImagePress}>
          <Image source={this.state.image} style={this.state.imageStyle} />
        </TouchableOpacity>
      );
    } else {
      return <Image source={this.state.image} style={this.state.imageStyle} />;
    }
  }

  /**
   * Increments the item quantity by one.
   */
  private handleIncrease = async (): Promise<void> => {
    return this.props.updateQty(this.props, this.props.quantity + 1);
  }

  /**
   * Decrements the item quantity by one. The quantity cannot go lower than zero.
   */
  private handleDecrease = async (): Promise<void> => {
    let { quantity } = this.props;

    return this.props.updateQty(this.props, --quantity >= 0 ? quantity : 0);
  }

  /**
   * Removes the item from cart.
   */
  private handleRemove = async (): Promise<void> => {
    return this.props.removeItem(this.props);
  }

  /**
   * Handles when the user taps the cart item image.
   */
  private handleImagePress = () => {
    if (this.props.onImagePress) {
      this.props.onImagePress(this.props);
    }
  }
}
