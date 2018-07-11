import React from 'react';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import StatefulTextbox from './LabelHiddenStatefulTextbox';
import { Dictionary } from '@brandingbrand/fsfoundation';

export function labelHiddenTextbox(locals: Dictionary): JSX.Element {

  return (
    <StatefulTextbox
      locals={locals}
    />
  );
}
