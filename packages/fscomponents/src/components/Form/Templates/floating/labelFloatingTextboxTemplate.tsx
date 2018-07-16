import React from 'react';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import StatefulTextbox from './LabelFloatingStatefulTextbox';
import { Dictionary } from '@brandingbrand/fsfoundation';

export function labelFloatingTextbox(locals: Dictionary): JSX.Element {

  return (
    <StatefulTextbox
      locals={locals}
    />
  );
}
