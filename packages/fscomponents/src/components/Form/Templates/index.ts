import { labelInlineTextbox } from './inline';
import { labelFloatingTextbox } from './floating';
import { labelHiddenTextbox } from './hidden';
import { labelAboveTextbox} from './above';

export const inlineLabels = {
  textbox: labelInlineTextbox
};

export const hiddenLabels = {
  textbox: labelHiddenTextbox
};

export const floatingLabels = {
  textbox: labelFloatingTextbox
};

export const aboveLabels = {
  textbox: labelAboveTextbox
};

export * from './above';
export * from './floating';
export * from './hidden';
export * from './inline';

export * from './stylesheet';
