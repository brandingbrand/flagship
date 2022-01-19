import React from 'react';
import StatefulTextbox from './StatefulTextbox';

export enum FormLabelPosition {
  Above,
  Floating,
  Hidden,
  Inline,
}

export function labelAboveFieldTemplate(
  locals: Record<string, any>,
  componentFactory: (
    locals: Record<string, any>,
    textboxStyle: Record<string, any>,
    color: string
  ) => JSX.Element
): React.ReactNode {
  return (
    <StatefulTextbox
      locals={locals}
      componentFactory={componentFactory}
      labelPosition={FormLabelPosition.Above}
    />
  );
}

export function labelFloatingFieldTemplate(
  locals: Record<string, any>,
  componentFactory: (
    locals: Record<string, any>,
    textboxStyle: Record<string, any>,
    color: string
  ) => JSX.Element
): React.ReactNode {
  return (
    <StatefulTextbox
      locals={locals}
      componentFactory={componentFactory}
      labelPosition={FormLabelPosition.Floating}
    />
  );
}

export function labelHiddenFieldTemplate(
  locals: Record<string, any>,
  componentFactory: (
    locals: Record<string, any>,
    textboxStyle: Record<string, any>,
    color: string
  ) => JSX.Element
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
  locals: Record<string, any>,
  componentFactory: (
    locals: Record<string, any>,
    textboxStyle: Record<string, any>,
    color: string
  ) => JSX.Element
): React.ReactNode {
  return (
    <StatefulTextbox
      locals={locals}
      componentFactory={componentFactory}
      labelPosition={FormLabelPosition.Inline}
    />
  );
}
