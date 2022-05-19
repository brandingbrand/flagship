import React, { PureComponent } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Form, FormLabelPosition } from './Form';

export interface SingleLineFormProps {
  fieldsTypes: any;
  fieldsOptions?: any;
  fieldsStyleConfig?: any;
  labelPosition?: FormLabelPosition;
  onSubmit?: (value: any) => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<ViewStyle>;
  submitText?: any;
  value?: any;
  style?: StyleProp<ViewStyle>;
}

const S = StyleSheet.create({
  container: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  form: {
    flex: 1,
  },
  submitButtonStyle: {
    alignItems: 'center',
    backgroundColor: '#EEE',
    height: 38,
    justifyContent: 'center',
    padding: 10,
    width: 100,
  },
});

export class SingleLineForm extends PureComponent<SingleLineFormProps> {
  constructor(props: SingleLineFormProps) {
    super(props);

    this.fieldsStyleConfig = {
      ...props.fieldsStyleConfig,
    };

    this.fieldsTypes = props.fieldsTypes;
    this.fieldsOptions = props.fieldsOptions;

    // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
    this.labelPosition =
      typeof props.labelPosition === 'number' ? props.labelPosition : FormLabelPosition.Inline;
  }

  private form: any;
  private readonly fieldsStyleConfig: any;
  private readonly fieldsTypes: unknown;
  private readonly fieldsOptions: unknown;
  private readonly labelPosition: FormLabelPosition;

  public componentDidMount(): void {
    console.warn(
      'SingleLineForm is deprecated and will be removed in the next version of Flagship.'
    );
  }

  private readonly handleSubmit = () => {
    const value = this.form.getValue();
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  };

  public render(): JSX.Element {
    // labelPosition 0 is 'above'
    return this.labelPosition === 0 ? (
      <View>
        <View style={[S.container, this.props.style]}>
          <Form
            fieldsOptions={this.fieldsOptions}
            fieldsStyleConfig={this.fieldsStyleConfig}
            fieldsTypes={this.fieldsTypes}
            labelPosition={this.labelPosition}
            ref={(ref) => (this.form = ref)}
            style={S.form}
            value={this.props.value}
          />
        </View>
        <TouchableOpacity
          onPress={this.handleSubmit}
          style={[
            S.submitButtonStyle,
            this.props.submitButtonStyle,
            { marginLeft: 10, marginTop: -12 },
          ]}
        >
          <Text style={this.props.submitTextStyle}>{this.props.submitText || 'Submit'}</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={[S.container, this.props.style]}>
        <Form
          fieldsOptions={this.fieldsOptions}
          fieldsStyleConfig={this.fieldsStyleConfig}
          fieldsTypes={this.fieldsTypes}
          labelPosition={this.labelPosition}
          ref={(ref) => (this.form = ref)}
          style={S.form}
          value={this.props.value}
        />
        <TouchableOpacity
          onPress={this.handleSubmit}
          style={[S.submitButtonStyle, this.props.submitButtonStyle]}
        >
          <Text style={this.props.submitTextStyle}>{this.props.submitText || 'Submit'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
