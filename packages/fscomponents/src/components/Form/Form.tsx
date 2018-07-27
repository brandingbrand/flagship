import React, { PureComponent, RefObject } from 'react';
import { View } from 'react-native';
import memoize from 'memoize-one';
// dynamically generates stylesheet w/ correct active, error, inactive colors
import { Dictionary } from '@brandingbrand/fsfoundation';

// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import {
  aboveLabels,
  floatingLabels,
  hiddenLabels,
  inlineLabels,
  // styles returns a modified version of t-comb default stylesheet to suit templating needs
  styles
} from './Templates';

// TODO: Update tcomb-form-native to support typing
type TcombForm = any;

const TcombForm = t.form.Form;
const defaultTemplates = t.form.Form.templates;

export enum FormLabelPosition {
  Above,
  Floating,
  Hidden,
  Inline
}

const LabelMap = {
  [FormLabelPosition.Inline]: inlineLabels,
  [FormLabelPosition.Hidden]: hiddenLabels,
  [FormLabelPosition.Floating]: floatingLabels,
  [FormLabelPosition.Above]: aboveLabels
};

export interface FormProps {
  fieldsTypes: any;
  fieldsOptions?: any;
  fieldsStyleConfig?: any;
  labelPosition?: FormLabelPosition;
  style?: any;
  value?: any;
  onChange?: (value: any) => void;
  templates?: FormTemplates;
  activeColor?: string;
  errorColor?: string;
  inactiveColor?: string;
}

export interface FormTemplates {
  checkbox?: (locals: any) => React.ReactNode;
  datepicker?: (locals: any) => React.ReactNode;
  list?: (locals: any) => React.ReactNode;
  select?: (locals: any) => React.ReactNode;
  struct?: (locals: any) => React.ReactNode;
  textbox?: (locals: any) => React.ReactNode;
}

type CalculateStylesType =
  (activeColor: string, errorColor: string, inactiveColor: string) => Dictionary;

type CalculateBlursType = (fieldsOptions: Dictionary) => void;

export class Form extends PureComponent<FormProps> {
  static defaultProps: Partial<FormProps> = {
    errorColor: '#d0021b',
    activeColor: '#000000',
    inactiveColor: '#cccccc',
    labelPosition: FormLabelPosition.Inline
  };

  // dynamically generates stylesheet w/ correct active, error, inactive colors
  calculateStyles: CalculateStylesType = memoize(
  (activeColor: string, errorColor: string, inactiveColor: string) => {
    return styles({activeColor, errorColor, inactiveColor});
  });

  // memoized function that ensures the user's onBlur function is retained
  calculateBlurs: CalculateBlursType = memoize(
    (fieldsOptions: Dictionary) => {
      Object.keys(fieldsOptions).forEach(path => {
        const prevOnBlur = fieldsOptions[path].onBlur;
        fieldsOptions[path].onBlur = () => {
          if (prevOnBlur instanceof Function) {
            prevOnBlur();
          }
          this.validateField(path);
        };
      });
    }
  );

  private form: RefObject<TcombForm>;

  constructor(props: FormProps) {
    super(props);

    this.form = React.createRef<TcombForm>();
  }

  getValue = () => {
    if (this.form.current) {
      return this.form.current.getValue();
    }
  }

  validate = () => {
    if (this.form.current) {
      return this.form.current.validate();
    }
  }

  // for individual field validation
  validateField = (path: any) => {
    if (this.form.current) {
      return this.form.current.getComponent(path).validate();
    }
  }

  getComponent = (...args: any[]) => {
    if (this.form.current) {
      return this.form.current.getComponent.apply(this.form.current, args);
    }
  }


  render(): JSX.Element {
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
      templates
    } = this.props;


    // returns a new version stylesheet customized with new or changed color props, if any
    const stylesheet = this.calculateStyles(activeColor, errorColor, inactiveColor);

    this.calculateBlurs(fieldsOptions);

    const _options = {
      stylesheet: { ...stylesheet, ...fieldsStyleConfig },
      fields: fieldsOptions,
      templates: { ...defaultTemplates, ...LabelMap[labelPosition], ...templates }
    };

    return (
      <View style={style}>
        <TcombForm
          ref={this.form}
          options={_options}
          type={fieldsTypes}
          onChange={onChange}
          value={value}
        />
      </View>
    );
  }
}
