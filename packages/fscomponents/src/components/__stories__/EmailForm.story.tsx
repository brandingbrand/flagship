import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { EmailForm } from '../EmailForm';
import { FormLabelPosition } from '../Form';

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
