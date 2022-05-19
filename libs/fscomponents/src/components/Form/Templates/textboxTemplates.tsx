import React from 'react';

import StatefulTextbox from './StatefulTextbox';
import { FormLabelPosition } from './fieldTemplates';

export const labelAboveTextbox = (
  locals: Record<string, unknown>,
  componentFactory?: (
    locals: Record<string, unknown>,
    textboxStyle: unknown,
    color: string
  ) => JSX.Element
): JSX.Element => (
  <StatefulTextbox
    componentFactory={componentFactory}
    labelPosition={FormLabelPosition.Above}
    locals={locals}
  />
);

export const labelFloatingTextbox = (
  locals: Record<string, unknown>,
  componentFactory?: (
    locals: Record<string, unknown>,
    textboxStyle: unknown,
    color: string
  ) => JSX.Element
): JSX.Element => (
  <StatefulTextbox
    componentFactory={componentFactory}
    labelPosition={FormLabelPosition.Floating}
    locals={locals}
  />
);

export const labelHiddenTextbox = (
  locals: Record<string, unknown>,
  componentFactory?: (
    locals: Record<string, unknown>,
    textboxStyle: unknown,
    color: string
  ) => JSX.Element
): JSX.Element => (
  <StatefulTextbox
    componentFactory={componentFactory}
    labelPosition={FormLabelPosition.Hidden}
    locals={locals}
  />
);

export const labelInlineTextbox = (
  locals: Record<string, unknown>,
  componentFactory?: (
    locals: Record<string, unknown>,
    textboxStyle: unknown,
    color: string
  ) => JSX.Element
): JSX.Element => (
  <StatefulTextbox
    componentFactory={componentFactory}
    labelPosition={FormLabelPosition.Inline}
    locals={locals}
  />
);
