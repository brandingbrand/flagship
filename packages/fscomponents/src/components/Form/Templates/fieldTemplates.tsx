import React from 'react';
import { Dictionary } from '@brandingbrand/fsfoundation';
import StatefulTextbox from './StatefulTextbox';
import { FormLabelPosition } from '../Form';

export function labelAboveFieldTemplate(
  locals: Dictionary,
  componentFactory: (locals: Dictionary, textboxStyle: Dictionary, color: string) => JSX.Element
 ): React.ReactNode {
  return (
    <StatefulTextbox
      locals={locals}
      componentFactory={componentFactory}
      labelPosition={FormLabelPosition.Above}
    />
  );
}

export function labelFloatingFieldTemplate(locals: Dictionary, componentFactory: (
  locals: Dictionary,
  textboxStyle: Dictionary, color: string) => JSX.Element): React.ReactNode {
  return (
    <StatefulTextbox
      locals={locals}
      componentFactory={componentFactory}
      labelPosition={FormLabelPosition.Floating}
    />
  );
}

export function labelHiddenFieldTemplate(
  locals: Dictionary,
  componentFactory: (locals: Dictionary, textboxStyle: Dictionary, color: string) => JSX.Element
 ): React.ReactNode {
  return (
    <StatefulTextbox
      locals={locals}
      componentFactory={componentFactory}
      labelPosition={FormLabelPosition.Hidden}
    />
  );
}

export function labelInlineFieldTemplate(
  locals: Dictionary,
  componentFactory: (locals: Dictionary, textboxStyle: Dictionary, color: string) => JSX.Element
 ): React.ReactNode {
  return (
    <StatefulTextbox
      locals={locals}
      componentFactory={componentFactory}
      labelPosition={FormLabelPosition.Inline}
    />
  );
}
