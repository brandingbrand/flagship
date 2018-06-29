import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Form } from './Form';

export interface SingleLineFormProps {
  fieldsTypes: any;
  fieldsOptions?: any;
  fieldsStyleConfig?: any;
  onSubmit?: (value: any) => void;
  submitButtonStyle?: any;
  submitTextStyle?: any;
  submitText?: any;
  value?: any;
  style?: any;
}

const S = StyleSheet.create({
  container: {
    flexDirection: 'row'
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
    height: 40
  }
});

export class SingleLineForm extends PureComponent<SingleLineFormProps> {
  form: any;
  fieldsStyleConfig: any;
  fieldsTypes: any;
  fieldsOptions: any;

  constructor(props: SingleLineFormProps) {
    super(props);

    this.fieldsStyleConfig = {
      textbox: {
        normal: {
          borderRadius: 0,
          fontSize: 14,
          height: 40,
          paddingHorizontal: 10
        },
        error: {
          borderRadius: 0,
          fontSize: 14,
          height: 40,
          paddingHorizontal: 10
        }
      },
      errorBlock: {
        fontSize: 13
      },
      ...props.fieldsStyleConfig
    };

    this.fieldsTypes = props.fieldsTypes;
    this.fieldsOptions = props.fieldsOptions;
  }

  handleSubmit = () => {
    const value = this.form.getValue();
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  }

  render(): JSX.Element {
    return (
      <View style={[S.container, this.props.style]}>
        <Form
          ref={ref => (this.form = ref)}
          fieldsTypes={this.fieldsTypes}
          fieldsOptions={this.fieldsOptions}
          fieldsStyleConfig={this.fieldsStyleConfig}
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
    );
  }
}
