import React from 'react';

import { action } from '@storybook/addon-actions';
import { object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { AddressForm } from '../src/components/AddressForm';
import { FormLabelPosition } from '../src/components/Form';

const defaultStyle = {
  padding: 10,
};

const defaultValue = {
  firstName: 'Test',
  lastName: 'Brander',
  address1: '2313 E Carson St',
  address2: 'APT 12',
  isPoBox: false,
  city: 'Pittsburgh',
  postalCode: 15_203,
  stateCode: 'PA',
  phone: 4_121_231_231,
  email: 'test@bb.com',
};

const fieldsStyle = {
  textbox: {
    normal: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 5,
      fontSize: 15,
      backgroundColor: '#f8f8f8',
    },
    error: {
      borderRadius: 5,
      fontSize: 15,
    },
  },
  errorBlock: {
    fontSize: 12,
  },
};

const fieldType = {
  email: null,
};

const renderAddressForm =
  (labelPosition?: FormLabelPosition): (() => JSX.Element) =>
  () =>
    (
      <AddressForm
        fieldsStyleConfig={fieldsStyle}
        fieldsTypes={fieldType}
        labelPosition={labelPosition}
        onSubmit={action('Submit')}
        style={object('Style', defaultStyle)}
        submitText={text('Submit Text', 'CONTINUE')}
        value={object('Value', defaultValue)}
      />
    );

storiesOf('AddressForm', module)
  .add('basic usage', renderAddressForm())
  .add('label above', renderAddressForm(FormLabelPosition.Above))
  .add('label floating', renderAddressForm(FormLabelPosition.Floating))
  .add('label hidden', renderAddressForm(FormLabelPosition.Hidden));
