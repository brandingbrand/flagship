/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { CreditCardForm } from '../CreditCardForm';
import { CreditCardType } from '../../types/Store';
import { FormLabelPosition } from '../Form';

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

const fieldsStyle = {
  floatingLabelView: {
    marginTop: 10,
    marginBottom: 0,
    position: 'absolute',
    top: -12
  }
};

const renderCCForm = (labelPosition?: FormLabelPosition): (() => JSX.Element) => {
  return (
    () => (
      <CreditCardForm
        cscIcon={icons.cvv}
        cscIconStyle={{ marginLeft: 5, marginTop: 35 }}
        fieldsStyleConfig={fieldsStyle}
        defaultCardImage={icons.card}
        supportedCards={cardIcons}
        supportedCardsLabel={<Text>Supported</Text>}
        supportedCardsStyle={{ justifyContent: 'flex-start' }}
        supportedIconStyle={{ height: 16, width: 26, marginLeft: 10 }}
        labelPosition={labelPosition}
      />
    )
  );
};

storiesOf('CreditCardForm', module)
  .add('basic usage', renderCCForm())
  .add('label above', renderCCForm(FormLabelPosition.Above))
  .add('label floating', renderCCForm(FormLabelPosition.Floating))
  .add('label hidden', renderCCForm(FormLabelPosition.Hidden));
