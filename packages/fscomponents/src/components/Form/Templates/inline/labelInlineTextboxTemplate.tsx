import React from 'react';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import StatefulTextbox from './LabelInlineStatefulTextbox';
import { Dictionary } from '@brandingbrand/fsfoundation';

export function labelInlineTextbox(locals: Dictionary): JSX.Element {

  return (
    <StatefulTextbox
      locals={locals}
    />
  );
}
