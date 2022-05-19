import React, { PureComponent } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import memoize from 'memoize-one';

// dynamically generates stylesheet w/ correct active, error, inactive colors
import {
  aboveLabels,
  floatingLabels,
  FormLabelPosition,
  hiddenLabels,
  inlineLabels,
  // styles returns a modified version of t-comb default stylesheet to suit templating needs
  styles,
} from './Templates';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

// TODO: Update tcomb-form-native to support typing
type TcombForm = any;

// eslint-disable-next-line @typescript-eslint/no-redeclare
const TcombForm = t.form.Form;
const defaultTemplates = t.form.Form.templates;

const LabelMap = {
  [FormLabelPosition.Inline]: inlineLabels,
  [FormLabelPosition.Hidden]: hiddenLabels,
  [FormLabelPosition.Floating]: floatingLabels,
  [FormLabelPosition.Above]: aboveLabels,
};

export interface FormProps<T> {
  fieldsTypes: any;
  fieldsOptions?: any;
  fieldsStyleConfig?: any;
  labelPosition?: FormLabelPosition;
  style?: StyleProp<ViewStyle>;
  value?: T;
  onChange?: (value: T) => void;
  templates?: FormTemplates;
  activeColor?: string;
  errorColor?: string;
  inactiveColor?: string;
  validateOnBlur?: boolean;
}

export interface FormTemplates {
  checkbox?: (locals: unknown) => React.ReactNode;
  datepicker?: (locals: unknown) => React.ReactNode;
  list?: (locals: unknown) => React.ReactNode;
  select?: (locals: unknown) => React.ReactNode;
  struct?: (locals: unknown) => React.ReactNode;
  textbox?: (locals: unknown) => React.ReactNode;
}

type CalculateStylesType = (
  activeColor: string,
  errorColor: string,
  inactiveColor: string
) => Record<string, unknown>;

type CalculateBlursType = (fieldsOptions: Record<string, unknown>) => void;

export class Form<T = any> extends PureComponent<FormProps<T>> {
  public static defaultProps: Partial<FormProps<unknown>> = {
    errorColor: '#d0021b',
    activeColor: '#000000',
    inactiveColor: '#cccccc',
    labelPosition: FormLabelPosition.Inline,
  };

  private readonly form = React.createRef<TcombForm>();

  // dynamically generates stylesheet w/ correct active, error, inactive colors
  public calculateStyles: CalculateStylesType = memoize(
    (activeColor: string, errorColor: string, inactiveColor: string) =>
      styles({ activeColor, errorColor, inactiveColor })
  );

  // memoized function that ensures the user's onBlur function is retained
  public calculateBlurs: CalculateBlursType = memoize((fieldsOptions: Record<string, any>) => {
    for (const path of Object.keys(fieldsOptions)) {
      const prevOnBlur = fieldsOptions[path].onBlur;
      fieldsOptions[path].onBlur = () => {
        if (prevOnBlur instanceof Function) {
          prevOnBlur();
        }
        this.validateField(path);
      };
    }
  });

  public componentDidMount(): void {
    console.warn('Form is deprecated and will be removed in the next version of Flagship.');
  }

  public getValue = () => {
    if (this.form.current) {
      return this.form.current.getValue();
    }
  };

  public validate = () => {
    if (this.form.current) {
      return this.form.current.validate();
    }
  };

  // for individual field validation
  public validateField = (path: unknown) => {
    if (this.form.current) {
      return this.form.current.getComponent(path).validate();
    }
  };

  public getComponent = (...args: unknown[]) => {
    if (this.form.current) {
      return this.form.current.getComponent.apply(this.form.current, args);
    }
  };

  public render(): JSX.Element {
    const {
      errorColor = '#d0021b',
      activeColor = '#000000',
      inactiveColor = '#9B9B9B',
      fieldsTypes,
      fieldsOptions,
      fieldsStyleConfig,
      labelPosition = FormLabelPosition.Inline,
      style,
      value,
      onChange,
      templates,
      validateOnBlur,
    } = this.props;

    // returns a new version stylesheet customized with new or changed color props, if any
    const stylesheet = this.calculateStyles(activeColor, errorColor, inactiveColor);

    if (validateOnBlur !== false) {
      this.calculateBlurs(fieldsOptions);
    }

    const _options = {
      stylesheet: { ...stylesheet, ...fieldsStyleConfig },
      fields: fieldsOptions,
      templates: { ...defaultTemplates, ...LabelMap[labelPosition], ...templates },
    };

    return (
      <View style={style}>
        <TcombForm
          onChange={onChange}
          options={_options}
          ref={this.form}
          type={fieldsTypes}
          value={value}
        />
      </View>
    );
  }
}
