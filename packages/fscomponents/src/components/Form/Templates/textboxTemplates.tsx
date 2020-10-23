import React from 'react';
import StatefulTextbox from './StatefulTextbox';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { FormLabelPosition } from './fieldTemplates';

export function labelAboveTextbox(locals: Dictionary, componentFactory?:
  (locals: Dictionary, textboxStyle: any, color: string) => JSX.Element): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Above}
      componentFactory={componentFactory}
    />
  );
}

export function labelFloatingTextbox(locals: Dictionary, componentFactory?:
  (locals: Dictionary, textboxStyle: any, color: string) => JSX.Element): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Floating}
      componentFactory={componentFactory}
    />
  );
}


export function labelHiddenTextbox(locals: Dictionary, componentFactory?:
  (locals: Dictionary, textboxStyle: any, color: string) => JSX.Element): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Hidden}
      componentFactory={componentFactory}
    />
  );
}


export function labelInlineTextbox(locals: Dictionary, componentFactory?:
  (locals: Dictionary, textboxStyle: any, color: string) => JSX.Element): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Inline}
      componentFactory={componentFactory}
    />
  );
}

