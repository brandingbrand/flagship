import React from 'react';

import { action } from '@storybook/addon-actions';
import { object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { EmailForm } from '../src/components/EmailForm';
import { FormLabelPosition } from '../src/components/Form';

const defaultStyle = {
  padding: 10,
};

const defaultValue = {
  email: 'test@bb.com',
};

const renderEmailForm =
  (labelPosition?: FormLabelPosition): (() => JSX.Element) =>
  () =>
    (
      <EmailForm
        labelPosition={labelPosition}
        onSubmit={action('EmailForm onSubmit')}
        style={object('style', defaultStyle)}
        submitText={text('submitText', 'SUBMIT')}
        value={object('value', defaultValue)}
      />
    );

storiesOf('EmailForm', module)
  .add('basic usage', renderEmailForm())
  .add('label above', renderEmailForm(FormLabelPosition.Above))
  .add('label hidden', renderEmailForm(FormLabelPosition.Hidden))
  .add('label floating', renderEmailForm(FormLabelPosition.Floating));
