import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { PromoFormFK } from '../PromoFormFK';

const defaultStyle = {
  padding: 10
};

const defaultButtonStyle = {
  backgroundColor: 'rgb(34, 125, 116)'
};

const defaultLabelStyle = {
  color: '#000',
  fontSize: 15
};

const defaultValue = 'VISA25';

const label = 'PROMO CODE';

const renderPromoFormFK = (formPositionInline: boolean = false): (() => JSX.Element) => {
  return (
    () => (
      <PromoFormFK
        label={formPositionInline ? '' : text('label', label)}
        labelStyle={formPositionInline ? undefined : object('labelStyle', defaultLabelStyle)}
        containerStyle={object('containerStyle', defaultStyle)}
        placeholder={formPositionInline ? text('placeholder', label) : text('placeholder', '')}
        value={text('value', defaultValue)}
        submitButtonStyle={object('submitButtonStyle', defaultButtonStyle)}
        onSubmit={action('EmailForm onSubmit')}
        formPositionInline={formPositionInline}
      />
    )
  );
};

storiesOf('PromoFormFK', module)
  .add('basic usage', renderPromoFormFK())
  .add('inline usage', renderPromoFormFK(true));
