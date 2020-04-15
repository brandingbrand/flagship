/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import { ImageURISource, Text } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { CreditCardForm } from '../CreditCardForm';
import { CreditCardType } from '../../types/Store';
import { FormLabelPosition } from '../Form';
import {
  object,
  select
// tslint:disable-next-line:no-implicit-dependencies
} from '@storybook/addon-knobs';

const icons: Record<string, ImageURISource> = {
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

const cscIconStyle = {
  marginLeft: 5,
  marginTop: 35
};

const supportedIconStyle = {
  height: 16,
  width: 26,
  marginLeft: 10
};

const supportedCardsLabel = <Text>Supported</Text>;

const renderCCForm = (labelPosition?: FormLabelPosition): (() => JSX.Element) => {
  return (
    () => (
      <CreditCardForm
        cscIcon={icons[select('Open Icon', Object.keys(icons), 'cvv')]}
        cscIconStyle={object('style', cscIconStyle)}
        fieldsStyleConfig={fieldsStyle}
        defaultCardImage={icons.card}
        supportedCards={cardIcons}
        supportedCardsLabel={supportedCardsLabel}
        supportedCardsStyle={{justifyContent: 'flex-start'}}
        supportedIconStyle={object('style', supportedIconStyle)}
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
