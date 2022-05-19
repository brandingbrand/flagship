import React from 'react';

import { action } from '@storybook/addon-actions';
import { number, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { range } from 'lodash-es';

import Picker from '../src/components/Form/Templates/Picker';

const setFormikField = (field: string, value: unknown, shouldValidate?: boolean): void => {
  action('Set Formik Field')({
    field,
    value,
    shouldValidate,
  });
};

storiesOf('Picker', module).add('basic usage', () => (
  <Picker
    formFieldName={text('Form Field Name', 'Test')}
    items={range(1, number('Number of options', 4) + 1).map((optionNumber) => ({
      label: `Option ${optionNumber}`,
      value: optionNumber,
    }))}
    setFormikField={setFormikField}
  />
));
