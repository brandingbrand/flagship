import React from 'react';

import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { AddressForm } from '../AddressForm';
import { FormLabelPosition } from '../Form';

const defaultStyle = {
  padding: 10
};

const defaultValue = {
  firstName: 'Test',
  lastName: 'Brander',
  address1: '2313 E Carson St',
  address2: 'APT 12',
  isPoBox: false,
  city: 'Pittsburgh',
  postalCode: 15203,
  stateCode: 'PA',
  phone: 4121231231,
  email: 'test@bb.com'
};

const fieldsStyle = {
  textbox: {
    normal: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 5,
      fontSize: 15,
      backgroundColor: '#f8f8f8'
    },
    error: {
      borderRadius: 5,
      fontSize: 15
    }
  },
  errorBlock: {
    fontSize: 12
  }
};

const fieldType = {
  email: null
};

const renderAddressForm = (labelPosition?: FormLabelPosition): (() => JSX.Element) => {
  return (
    () => (
      <AddressForm
        style={object('Style', defaultStyle)}
        value={object('Value', defaultValue)}
        submitText={text('Submit Text', 'CONTINUE')}
        onSubmit={action('Submit')}
        fieldsStyleConfig={fieldsStyle}
        fieldsTypes={fieldType}
        labelPosition={labelPosition}
      />
    )
  );
};

storiesOf('AddressForm', module)
  .add('basic usage', renderAddressForm())
  .add('label above', renderAddressForm(FormLabelPosition.Above))
  .add('label floating', renderAddressForm(FormLabelPosition.Floating))
  .add('label hidden', renderAddressForm(FormLabelPosition.Hidden));
