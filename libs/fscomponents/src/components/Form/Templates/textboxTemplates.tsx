import React from 'react';
import StatefulTextbox from './StatefulTextbox';
import { FormLabelPosition } from './fieldTemplates';

export function labelAboveTextbox(
  locals: Record<string, any>,
  componentFactory?: (locals: Record<string, any>, textboxStyle: any, color: string) => JSX.Element
): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Above}
      componentFactory={componentFactory}
    />
  );
}

export function labelFloatingTextbox(
  locals: Record<string, any>,
  componentFactory?: (locals: Record<string, any>, textboxStyle: any, color: string) => JSX.Element
): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Floating}
      componentFactory={componentFactory}
    />
  );
}

export function labelHiddenTextbox(
  locals: Record<string, any>,
  componentFactory?: (locals: Record<string, any>, textboxStyle: any, color: string) => JSX.Element
): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Hidden}
      componentFactory={componentFactory}
    />
  );
}

export function labelInlineTextbox(
  locals: Record<string, any>,
  componentFactory?: (locals: Record<string, any>, textboxStyle: any, color: string) => JSX.Element
): JSX.Element {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Inline}
      componentFactory={componentFactory}
    />
  );
}
