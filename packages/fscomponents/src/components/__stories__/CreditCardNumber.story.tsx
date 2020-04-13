import React from 'react';
import { CreditCardNumber } from '../CreditCardNumber';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { CreditCardType } from '../../types/Store';
import { text } from '@storybook/addon-knobs'; // tslint:disable-line:no-implicit-dependencies

const icons = {
  cvv: require('./assets/images/cvv.png'),
  card: require('./assets/images/credit_card.png')
};

const cardIcons = [
  { type: 'AMERICANEXPRESS' as CreditCardType, image: require('./assets/images/amex.png') },
  { type: 'DISCOVER' as CreditCardType, image: require('./assets/images/discover.png') },
  { type: 'MASTERCARD' as CreditCardType, image: require('./assets/images/mastercard.png') },
  { type: 'VISA' as CreditCardType, image: require('./assets/images/visa.png') }
];

const style = {
  borderColor: 'black',
  borderWidth: 1,
  height: 50,
  padding: 10
};

const renderUpdateNameOrEmailForm = (): JSX.Element => {
  return (
    <CreditCardNumber
      cardImageWidth={30}
      creditCardTypeImages={cardIcons}
      defaultCardImage={icons.card}
      autoCapitalize={'none'}
      autoFocus={true}
      blurOnSubmit={true}
      editable={true}
      keyboardType={'name-phone-pad'}
      placeholder={text('title', 'Cart number')}
      style={style}
      placeholderTextColor={'red'}
    />
  );
};

const renderCustomUpdateNameOrEmailForm = (): JSX.Element => {
  return (
    <CreditCardNumber
      cardImageWidth={30}
      creditCardTypeImages={cardIcons}
      defaultCardImage={icons.card}
    />
  );
};

storiesOf('CreditCardNumber', module).
add('basic usage', renderUpdateNameOrEmailForm).
add('custom styling', renderCustomUpdateNameOrEmailForm);
