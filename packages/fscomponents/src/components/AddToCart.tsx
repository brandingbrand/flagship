import React, { PureComponent } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { cloneDeep, find, get } from 'lodash-es';
import { Button, ButtonProps } from './Button';
import { Swatches, SwatchesProps } from './Swatches';
import { Stepper, StepperProps } from './Stepper';

import {
  CommerceDataSource,
  CommerceTypes
} from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

export interface AddToCartProps {
  product: CommerceTypes.Product;
  commerceDataSource: CommerceDataSource;
  defaultVariantId?: string;

  // Events
  onChangeOption?: (name: string, value: string, variant?: CommerceTypes.Variant) => void;
  onAddToCart?: (cart: Promise<CommerceTypes.Cart>) => void;

  // Styles
  style?: StyleProp<ViewStyle>;
  swatchesStyle?: StyleProp<ViewStyle>;
  stepperStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  actionBarStyle?: StyleProp<ViewStyle>;

  // Child Props
  buttonProps?: Partial<ButtonProps>;
  swatchesProps?: Partial<SwatchesProps>;
  stepperProps?: Partial<StepperProps>;

  // Custom Rendering
  renderStepper?(onChange: (count: number) => void): JSX.Element;
  renderButton?(onPress: () => void): JSX.Element;
}

// TODO: This should be replaced with a type from fscommerce
export interface AddToCartOptionValue {
  name: string;
  value: string;
}

export interface AddToCartState {
  quantity: number;
  optionValues: AddToCartOptionValue[];
  variantId?: string;
}

export class AddToCart extends PureComponent<AddToCartProps, AddToCartState> {
  static getDerivedStateFromProps(nextProps: AddToCartProps): Partial<AddToCartState> | null {
    const { defaultVariantId, product } = nextProps;
    const variant = defaultVariantId ?
      product.variants && product.variants.find(variant => variant.id === defaultVariantId) :
      get(product.variants, '0');

    if (variant) {
      return {
        variantId: variant.id,
        optionValues: cloneDeep(variant.optionValues)
      };
    }

    return null;
  }

  constructor(props: AddToCartProps) {
    super(props);

    this.state = {
      quantity: 1,
      optionValues: [],
      variantId: this.determineVariant(props)
    };
  }

  determineVariant(props: AddToCartProps): string {
    if (props.product &&
      props.product.id &&
      !props.product.variants) {
      return props.product.id;
    }
    return '';
  }

  changeQty = (count: number) => {
    this.setState(prevState => {
      return { quantity: count };
    });
  }

  addToCart = () => {
    const { commerceDataSource, onAddToCart } = this.props;
    const { quantity, variantId } = this.state;

    let response;

    if (!quantity || !variantId) {
      response = Promise.reject(new Error(FSI18n.string(translationKeys.flagship.cart.error)));
    } else {
      response = commerceDataSource.addToCart(variantId, quantity);
    }

    if (onAddToCart) {
      onAddToCart(response);
    }
  }

  updateOption = (name: string, value: string) => {
    const { optionValues } = this.state;
    const { product, onChangeOption } = this.props;

    // Copy existing options
    const newOptionValues = [...optionValues];
    const optionIndex = newOptionValues.findIndex(option => option.name === name);
    if (optionIndex === -1) {
      newOptionValues.push({ name, value });
    } else {
      newOptionValues[optionIndex].value = value;
    }

    // Search for matching variant
    const variant = find<CommerceTypes.Variant>(product.variants, {
      optionValues: newOptionValues
    });

    // Update State
    this.setState({
      optionValues: newOptionValues,
      variantId: (variant && variant.id) || undefined
    });

    // Notify upstream components of option change
    if (onChangeOption) {
      onChangeOption(name, value, variant);
    }
  }

  _renderStepper(): JSX.Element {
    const { renderStepper, stepperProps } = this.props;

    if (renderStepper) {
      return renderStepper(this.changeQty);
    } else {
      return (
        <Stepper
          count={1}
          onIncreaseButtonPress={this.changeQty}
          onDecreaseButtonPress={this.changeQty}
          {...stepperProps}
        />
      );
    }
  }

  _renderButton(): JSX.Element {
    const { renderButton, buttonProps } = this.props;

    if (renderButton) {
      return renderButton(this.addToCart);
    } else {
      return (
        <Button
          title={FSI18n.string(translationKeys.flagship.cart.actions.add.actionBtn)}
          onPress={this.addToCart}
          {...buttonProps}
        />
      );
    }
  }

  render(): JSX.Element {
    const {
      product,
      swatchesProps,
      style,
      swatchesStyle,
      stepperStyle,
      buttonStyle,
      actionBarStyle
    } = this.props;

    const {
      optionValues
    } = this.state;

    return (
      <View style={style}>
        {product.options && (
          <View style={swatchesStyle}>
            {product.options.map((option, index) => {
              const defaultOption = optionValues.find(value => option.name === option.id);
              return (
                <Swatches
                  key={index}
                  title={option.name}
                  items={option.values}
                  defaultValue={defaultOption ? defaultOption.value : undefined}
                  onChangeSwatch={this.updateOption.bind(this, option.id)}
                  {...swatchesProps}
                />
              );
            })}
          </View>
        )}
        <View style={[{ flexDirection: 'row' }, actionBarStyle]}>
          <View style={[{ flex: 1 }, stepperStyle]}>
            {this._renderStepper()}
          </View>
          <View style={[{ flex: 1 }, buttonStyle]}>
            {this._renderButton()}
          </View>
        </View>
      </View>
    );
  }
}
