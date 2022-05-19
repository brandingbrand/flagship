import React from 'react';

import StatefulTextbox from './StatefulTextbox';

export enum FormLabelPosition {
  Above,
  Floating,
  Hidden,
  Inline,
}

export const labelAboveFieldTemplate = (
  locals: Record<string, unknown>,
  componentFactory: (
    locals: Record<string, unknown>,
    textboxStyle: Record<string, unknown>,
    color: string
  ) => JSX.Element
): React.ReactNode => (
  <StatefulTextbox
    componentFactory={componentFactory}
    labelPosition={FormLabelPosition.Above}
    locals={locals}
  />
);

export const labelFloatingFieldTemplate = (
  locals: Record<string, unknown>,
  componentFactory: (
    locals: Record<string, unknown>,
    textboxStyle: Record<string, unknown>,
    color: string
  ) => JSX.Element
): React.ReactNode => (
  <StatefulTextbox
    componentFactory={componentFactory}
    labelPosition={FormLabelPosition.Floating}
    locals={locals}
  />
);

export const labelHiddenFieldTemplate = (
  locals: Record<string, unknown>,
  componentFactory: (
    locals: Record<string, unknown>,
    textboxStyle: Record<string, unknown>,
    color: string
  ) => JSX.Element
): React.ReactNode => (
  <StatefulTextbox
    componentFactory={componentFactory}
    labelPosition={FormLabelPosition.Hidden}
    locals={locals}
  />
);

export const labelInlineFieldTemplate = (
  locals: Record<string, unknown>,
  componentFactory: (
    locals: Record<string, unknown>,
    textboxStyle: Record<string, unknown>,
    color: string
  ) => JSX.Element
): React.ReactNode => (
  <StatefulTextbox
    componentFactory={componentFactory}
    labelPosition={FormLabelPosition.Inline}
    locals={locals}
  />
);
