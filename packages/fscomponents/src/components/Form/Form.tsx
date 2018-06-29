import React, { PureComponent, RefObject } from 'react';
import { View } from 'react-native';

// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { floatingLabels, hiddenLabels, inlineLabels } from './Templates';

// TODO: Update tcomb-form-native to support typing
type TcombForm = any;

const TcombForm = t.form.Form;
const defaultFormStylesheet = t.form.Form.stylesheet;
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
  [FormLabelPosition.Above]: defaultTemplates
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
}

export interface FormTemplates {
  checkbox?: (locals: any) => React.ReactNode;
  datepicker?: (locals: any) => React.ReactNode;
  list?: (locals: any) => React.ReactNode;
  select?: (locals: any) => React.ReactNode;
  struct?: (locals: any) => React.ReactNode;
  textbox?: (locals: any) => React.ReactNode;
}

export class Form extends PureComponent<FormProps> {
  static defaultProps: Partial<FormProps> = {
    labelPosition: FormLabelPosition.Inline
  };

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

  getComponent = (...args: any[]) => {
    if (this.form.current) {
      return this.form.current.getComponent.apply(this.form.current, args);
    }
  }

  render(): JSX.Element {
    const {
      fieldsTypes,
      fieldsOptions,
      fieldsStyleConfig,
      labelPosition = FormLabelPosition.Inline,
      style,
      value,
      onChange,
      templates
    } = this.props;

    const _options = {
      stylesheet: { ...defaultFormStylesheet, ...fieldsStyleConfig },
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
          labelPosition={labelPosition}
        />
      </View>
    );
  }
}
