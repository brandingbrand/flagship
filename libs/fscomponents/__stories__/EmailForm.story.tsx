import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { EmailForm } from '../src/components/EmailForm';
import { FormLabelPosition } from '../src/components/Form';

const defaultStyle = {
  padding: 10
};

const defaultValue = {
  email: 'test@bb.com'
};

const renderEmailForm = (labelPosition?: FormLabelPosition): (() => JSX.Element) => {
  return (
    () => (
      <EmailForm
        value={object('value', defaultValue)}
        style={object('style', defaultStyle)}
        submitText={text('submitText', 'SUBMIT')}
        onSubmit={action('EmailForm onSubmit')}
        labelPosition={labelPosition}
      />
    )
  );
};

storiesOf('EmailForm', module)
  .add('basic usage', renderEmailForm())
  .add('label above', renderEmailForm(FormLabelPosition.Above))
  .add('label hidden', renderEmailForm(FormLabelPosition.Hidden))
  .add('label floating', renderEmailForm(FormLabelPosition.Floating));
