import React from 'react';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import StatefulTextbox from './LabelAboveStatefulTextbox';
import { Dictionary } from '@brandingbrand/fsfoundation';

export function labelAboveTextbox(locals: Dictionary): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
    />
  );
}
