import React, { PureComponent } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { CommerceDataSource, CommerceTypes } from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { cloneDeep, find, get } from 'lodash-es';

import type { ButtonProps } from './Button';
import { Button } from './Button';
import type { StepperProps } from './Stepper';
import { Stepper } from './Stepper';
import type { SwatchesProps } from './Swatches';
import { Swatches } from './Swatches';

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
  renderStepper?: (onChange: (count: number) => void) => JSX.Element;
  renderButton?: (onPress: () => void) => JSX.Element;
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
  public static getDerivedStateFromProps(
    nextProps: AddToCartProps
  ): Partial<AddToCartState> | null {
    const { defaultVariantId, product } = nextProps;
    const variant = defaultVariantId
      ? product.variants && product.variants.find((variant) => variant.id === defaultVariantId)
      : get(product.variants, '0');

    if (variant) {
      return {
        variantId: variant.id,
        optionValues: cloneDeep(variant.optionValues),
      };
    }

    return null;
  }

  constructor(props: AddToCartProps) {
    super(props);

    this.state = {
      quantity: 1,
      optionValues: [],
      variantId: this.determineVariant(props),
    };
  }

  private determineVariant(props: AddToCartProps): string {
    if (props.product && props.product.id && !props.product.variants) {
      return props.product.id;
    }
    return '';
  }

  private readonly changeQty = (count: number) => {
    this.setState(() => ({ quantity: count }));
  };

  private readonly addToCart = () => {
    const { commerceDataSource, onAddToCart } = this.props;
    const { quantity, variantId } = this.state;

    const response =
      !quantity || !variantId
        ? Promise.reject(new Error(FSI18n.string(translationKeys.flagship.cart.error)))
        : commerceDataSource.addToCart(variantId, quantity);

    if (onAddToCart) {
      onAddToCart(response);
    }
  };

  private readonly updateOption = (name: string, value: string) => {
    const { optionValues } = this.state;
    const { onChangeOption, product } = this.props;

    // Copy existing options
    const newOptionValues = [...optionValues];
    const newOptionValue = newOptionValues.find((option) => option.name === name);
    if (!newOptionValue) {
      newOptionValues.push({ name, value });
    } else {
      newOptionValue.value = value;
    }

    // Search for matching variant
    const variant = find<CommerceTypes.Variant>(product.variants, {
      optionValues: newOptionValues,
    });

    // Update State
    this.setState({
      optionValues: newOptionValues,
      variantId: (variant && variant.id) || undefined,
    });

    // Notify upstream components of option change
    if (onChangeOption) {
      onChangeOption(name, value, variant);
    }
  };

  private renderStepper(): JSX.Element {
    const { renderStepper, stepperProps } = this.props;

    if (renderStepper) {
      return renderStepper(this.changeQty);
    }
    return (
      <Stepper
        count={1}
        onDecreaseButtonPress={this.changeQty}
        onIncreaseButtonPress={this.changeQty}
        {...stepperProps}
      />
    );
  }

  private renderButton(): JSX.Element {
    const { buttonProps, renderButton } = this.props;

    if (renderButton) {
      return renderButton(this.addToCart);
    }
    return (
      <Button
        onPress={this.addToCart}
        title={FSI18n.string(translationKeys.flagship.cart.actions.add.actionBtn)}
        {...buttonProps}
      />
    );
  }

  public render(): JSX.Element {
    const {
      actionBarStyle,
      buttonStyle,
      product,
      stepperStyle,
      style,
      swatchesProps,
      swatchesStyle,
    } = this.props;

    const { optionValues } = this.state;

    return (
      <View style={style}>
        {product.options ? (
          <View style={swatchesStyle}>
            {product.options.map((option, index) => {
              const defaultOption = optionValues.find((value) => option.name === option.id);
              return (
                <Swatches
                  defaultValue={defaultOption ? defaultOption.value : undefined}
                  items={option.values}
                  key={index}
                  onChangeSwatch={this.updateOption.bind(this, option.id)}
                  title={option.name}
                  {...swatchesProps}
                />
              );
            })}
          </View>
        ) : null}
        <View style={[{ flexDirection: 'row' }, actionBarStyle]}>
          <View style={[{ flex: 1 }, stepperStyle]}>{this.renderStepper()}</View>
          <View style={[{ flex: 1 }, buttonStyle]}>{this.renderButton()}</View>
        </View>
      </View>
    );
  }
}
