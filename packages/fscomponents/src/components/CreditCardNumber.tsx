import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  View
} from 'react-native';
import {
  TextInputMask,
  TextInputMaskOptionProp,
  TextInputMaskProps
} from 'react-native-masked-text';
import { Dictionary, Omit } from '@brandingbrand/fsfoundation';
// @ts-ignore TODO: Update credit-card to support typing
import { determineCardType } from 'credit-card';
import { CreditCardType } from '../types/Store';


const icons: Dictionary = {
  AMERICANEXPRESS: require('../../assets/images/amex.png'),
  null: require('../../assets/images/creditCard.png'),
  DISCOVER: require('../../assets/images/discover.png'),
  MASTERCARD: require('../../assets/images/mastercard.png'),
  VISA: require('../../assets/images/visa.png')
};

const kMaskPatternAMEX = '9999 999999 99999';
const kMaskPatternDefault = '9999 9999 9999 9999';

// As of verison 1.7.0 react-native-masked-text incorrectly defines TextInputMaskOptionProp.
// When type='custom' it expects a `mask` property. This should be removed once
// react-native-masked-text fixes their definition of TextInputMaskOptionProp or we should remove
// usage of react-native-masked-text.
export interface TextInputMaskCustomOptionProp extends TextInputMaskOptionProp {
  mask: string;
}

const styles = StyleSheet.create({
  cardImage: {
    position: 'absolute',
    height: 17,
    width: 28
  },
  container: {
    justifyContent: 'center'
  }
});

export interface CreditCardNumberProps extends Omit<TextInputMaskProps, 'type'> {
  cardImageStyle?: StyleProp<ImageStyle>;
  cardImageWidth: number;
  creditCardTypeImages: {
    type: CreditCardType;
    image: ImageURISource;
  }[];
  defaultCardImage: ImageURISource;
}

export interface CreditCardNumberState {
  cardType: CreditCardType;
  cardImage: ImageURISource;
  options: TextInputMaskCustomOptionProp;
}

export class CreditCardNumber extends Component<CreditCardNumberProps, CreditCardNumberState> {
  static getDerivedStateFromProps(
    nextProps: CreditCardNumberProps,
    prevState?: CreditCardNumberState
  ): Partial<CreditCardNumberState> | null {
    const cardType = determineCardType(nextProps.value, { allowPartial: true }) as CreditCardType;

    if (!prevState || cardType !== prevState.cardType) {
      // We don't have a previous state or the card type has changed
      const cardImage = nextProps.creditCardTypeImages.find(val => val.type === cardType);

      return {
        cardType,
        cardImage: cardImage && cardImage.image || nextProps.defaultCardImage,
        options: {
          mask: cardType === 'AMERICANEXPRESS' ? kMaskPatternAMEX : kMaskPatternDefault
        }
      };
    }

    return null;
  }

  render(): React.ReactNode {
    const {
      cardImageStyle,
      cardImageWidth,
      creditCardTypeImages,
      defaultCardImage,
      ...textInputProps
    } = this.props;

    const { cardType } = this.state;

    return (
      <View style={styles.container}>
        <Image
          source={icons[cardType]}
          style={[styles.cardImage, this.props.cardImageStyle]}
        />
        <TextInputMask
          {...textInputProps}
          type='custom'
          options={this.state.options}
          style={[textInputProps.style, { paddingLeft: this.props.cardImageWidth + 10}]}
        />
      </View>
    );
  }
}
