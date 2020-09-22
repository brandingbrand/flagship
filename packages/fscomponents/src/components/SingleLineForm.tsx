import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Form, FormLabelPosition } from './Form';

export interface SingleLineFormProps {
  fieldsTypes: any;
  fieldsOptions?: any;
  fieldsStyleConfig?: any;
  labelPosition?: FormLabelPosition;
  onSubmit?: (value: any) => void;
  submitButtonStyle?: any;
  submitTextStyle?: any;
  submitText?: any;
  value?: any;
  style?: any;
}

const S = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  form: {
    flex: 1
  },
  submitButtonStyle: {
    width: 100,
    backgroundColor: '#EEE',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38
  }
});

export class SingleLineForm extends PureComponent<SingleLineFormProps> {
  form: any;
  fieldsStyleConfig: any;
  fieldsTypes: any;
  fieldsOptions: any;
  labelPosition: FormLabelPosition;

  constructor(props: SingleLineFormProps) {
    super(props);

    this.fieldsStyleConfig = {
      ...props.fieldsStyleConfig
    };

    this.fieldsTypes = props.fieldsTypes;
    this.fieldsOptions = props.fieldsOptions;

    // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
    this.labelPosition = (typeof props.labelPosition === 'number') ?
      props.labelPosition : FormLabelPosition.Inline;
  }

  handleSubmit = () => {
    const value = this.form.getValue();
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  }

  render(): JSX.Element {
    // labelPosition 0 is 'above'
    return (this.labelPosition === 0 ?
     (
     <View>
        <View style={[S.container, this.props.style]}>
          <Form
            ref={ref => (this.form = ref)}
            fieldsTypes={this.fieldsTypes}
            fieldsOptions={this.fieldsOptions}
            fieldsStyleConfig={this.fieldsStyleConfig}
            labelPosition={this.labelPosition}
            value={this.props.value}
            style={S.form}
          />
        </View>
        <TouchableOpacity
          style={[S.submitButtonStyle, this.props.submitButtonStyle,
            {marginLeft: 10, marginTop: -12}]}
          onPress={this.handleSubmit}
        >
          <Text style={this.props.submitTextStyle}>
            {this.props.submitText || 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    ) :
    (
      <View style={[S.container, this.props.style]}>
        <Form
          ref={ref => (this.form = ref)}
          fieldsTypes={this.fieldsTypes}
          fieldsOptions={this.fieldsOptions}
          fieldsStyleConfig={this.fieldsStyleConfig}
          labelPosition={this.labelPosition}
          value={this.props.value}
          style={S.form}
        />
        <TouchableOpacity
          style={[S.submitButtonStyle, this.props.submitButtonStyle]}
          onPress={this.handleSubmit}
        >
          <Text style={this.props.submitTextStyle}>
            {this.props.submitText || 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    ));
  }
}
