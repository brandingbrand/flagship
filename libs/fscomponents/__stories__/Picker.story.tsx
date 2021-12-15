import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  number,
  text
} from '@storybook/addon-knobs';
import { range } from 'lodash-es';
import Picker from '../src/components/Form/Templates/Picker';
import { action } from '@storybook/addon-actions';

const setFormikField = (field: string, value: any, shouldValidate?: boolean): void => {
  action('Set Formik Field')({
    field,
    value,
    shouldValidate
  });
};

storiesOf('Picker', module)
  .add('basic usage', () => (
    <Picker
      formFieldName={text('Form Field Name', 'Test')}
      items={range(1, number('Number of options', 4) + 1).map(optionNumber => {
        return {
          label: 'Option ' + optionNumber,
          value: optionNumber
        };
      })}
      setFormikField={setFormikField}
    />
  ));
