import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import {
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import Decimal from 'decimal.js';
import { CartItem, VariantCartItem } from '../CartItem';
import {Stepper} from '../Stepper';
import FSI18n, {translationKeys} from '@brandingbrand/fsi18n';

const noopPromise = async () => (Promise.resolve());

const styles = StyleSheet.create({
  rightColumnStyle: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  stepperStyle: {
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityRowStyle: {
    justifyContent: 'space-between'
  },
  removeButtonStyle: {
    marginRight: 20
  },
  removeButtonTextStyle: {
    color: 'red'
  }
});

const testCartItem: CommerceTypes.CartItem = {
  title: 'Kingsford 24',
  itemId: '153141',
  productId: '1534131',
  itemText: 'Test text',
  quantity: 3,
  totalPrice: {
    value: new Decimal(30),
    currencyCode: 'USD'
  },
  price: {
    value: new Decimal(10),
    currencyCode: 'USD'
  },
  originalPrice: {
    value: new Decimal(20),
    currencyCode: 'USD'
  },
  handle: 'Kingsford-24-Charcoal-Grill',
  images: [{ uri: 'https://placehold.it/100x100' }],
  options: [{
    id: 'size',
    name: 'Size',
    values: [{
      name: 'Small',
      value: 'S',
      available: true
    }, {
      name: 'Large',
      value: 'L',
      available: true
    }]
  }],
  variants: [{
    id: '1534131',
    available: true,
    optionValues: [{
      name: 'size',
      value: 'L'
    }]
  }]
};

const renderStepper = () => {
  return (
    <Stepper
      count={testCartItem.quantity}
      countUpperLimit={10}
      onDecreaseButtonPress={action('Stepper onDecreaseButtonPress')}
      onIncreaseButtonPress={action('Stepper onIncreaseButtonPress')}
      stepperStyle={styles.stepperStyle}
    />
  );
};

const renderRemoveButton = (): React.ReactNode => {
  return (
    <TouchableOpacity onPress={action('RemoveButton onPress')}>
      <View style={styles.removeButtonStyle}>
        <Text style={styles.removeButtonTextStyle}>
          {FSI18n.string(translationKeys.flagship.cart.actions.remove.actionBtn)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

storiesOf('CartItem', module)
  .add('basic usage', () => (
    <CartItem
      {...object('CartItem', testCartItem)}
      removeItem={noopPromise}
      updateQty={noopPromise}
      rightColumnStyle={styles.rightColumnStyle}
      quantityRowStyle={styles.quantityRowStyle}
      stepperStyle={styles.stepperStyle}
      removeButtonStyle={styles.removeButtonStyle}
      removeButtonTextStyle={styles.removeButtonTextStyle}
      renderStepper={renderStepper}
      renderRemoveButton={renderRemoveButton}
    />
  ))
  .add('variant cart item', () => (
    <VariantCartItem
      {...object('CartItem', testCartItem)}
      onQtyChange={noopPromise}
    />
  ));
