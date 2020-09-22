import React, { Component } from 'react';
import { ImageRequireSource, InteractionManager, StyleProp, View, ViewStyle } from 'react-native';
import formFieldStyles from '../styles/FormField';
import { select, textbox, textboxWithRightIcon } from '../lib/formTemplate';
import { Form } from '@brandingbrand/fscomponents';
// @ts-ignore TODO: Add types for tcomb-form-native
import * as t from 'tcomb-form-native';
import CCType, { CardBrand } from 'credit-card-type';

const months = require('../../assets/months.json');
const icons: { [key in CardBrand]?: ImageRequireSource } = {
  'american-express': require('../../assets/images/amex.png'),
  discover: require('../../assets/images/discover.png'),
  mastercard: require('../../assets/images/mastercard.png'),
  visa: require('../../assets/images/visa.png')
};

export interface FormOptions {
  stylesheet: any;
  fields: any;
}

export interface PSCreditCardFormState {
  value: any;
}

export interface PSCreditCardFormProps {
  style?: StyleProp<ViewStyle>;
  value?: any;
  hideCvv?: boolean;
}

export default class PSCreditCardForm extends Component<
  PSCreditCardFormProps,
  PSCreditCardFormState
> {
  formRef: any;

  formType: any;

  fieldOptions: any = {
    ccNumber: {
      factory: t.form.Textbox,
      template: textboxWithRightIcon,
      config: {
        showIcon: false
      },
      label: 'Card Number',
      error: 'Card Number is required',
      placeholder: 'Required',
      returnKeyType: 'next',
      keyboardType: 'numeric',
      transformer: {
        format: formatCCNumber,
        parse: parseCCNumber
      },
      onSubmitEditing: () => this.focusField('ccExpireMonth')
    },
    ccExpireMonth: {
      label: 'Exp. Month',
      error: 'Exp. Month is required',
      config: {
        title: 'Select Month',
        placeholder: 'Select Month'
      },
      nullOption: false
    },
    ccExpireYear: {
      label: 'Exp. Year',
      error: 'Exp. Year is required',
      config: {
        title: 'Select Year',
        placeholder: 'Select Year',
        onValueChange: () => {
          InteractionManager.runAfterInteractions(() => {
            this.focusField('ccCVV');
          });
        }
      },
      nullOption: false
    },
    ccCVV: {
      label: 'CVV',
      error: 'CVV is required',
      placeholder: 'Required',
      keyboardType: 'phone-pad',
      returnKeyType: 'next'
    }
  };

  constructor(props: PSCreditCardFormProps) {
    super(props);

    const types: any = {
      ccNumber: t.Object,
      ccExpireMonth: t.enums(months),
      ccExpireYear: t.enums(getYears())
    };
    if (!props.hideCvv) {
      types.ccCVV = t.String;
    }

    this.formType = t.struct(types);

    this.state = {
      value: props.value
    };

    this.updateCCIcon(this.state.value && this.state.value.ccNumber);
  }

  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        <Form
          ref={this.getFormRef}
          fieldsTypes={this.formType}
          fieldsOptions={this.fieldOptions}
          fieldsStyleConfig={formFieldStyles}
          onChange={this.handleChange}
          value={this.state.value}
          templates={{ textbox, select }}
        />
      </View>
    );
  }

  focusField = (fieldName: string) => {
    const field = this.formRef.getComponent(fieldName);
    if (!field) {
      return console.warn(`field ${fieldName} doesn't exist`);
    }

    const inputRef = field.refs.input;
    if (inputRef.focus) {
      inputRef.focus();
    } else if (inputRef.openModal) {
      inputRef.openModal();
    } else {
      console.warn(`field ${fieldName} cannot be focused`);
    }
  }

  getFormRef = (ref: any) => (this.formRef = ref);
  getValue = () => this.formRef.getValue();
  validate = () => this.formRef.validate();
  handleChange = (value: any) => {
    const oldCC = this.state.value && this.state.value.ccNumber;
    const newCC = value.ccNumber;

    // String check is needed because the transformer initially returns
    // an object before calling onChange again with the string value
    if (typeof newCC === 'string' && oldCC !== newCC) {
      this.updateCCIcon(newCC);
    }

    this.setState({ value });
  }

  updateCCIcon = (ccNumber: string = '') => {
    // Handle saved CC numbers
    if (ccNumber.includes('*')) {
      ccNumber = ccNumber.substring(0, ccNumber.indexOf('*'));
    }

    let icon;
    const parsedCC = parseCCNumber(ccNumber);

    if (parsedCC && parsedCC.ccType) {
      icon = icons[parsedCC.ccType];
    }

    this.fieldOptions = t.update(this.fieldOptions, {
      ccNumber: {
        config: {
          icon: { $set: icon },
          showIcon: { $set: !!icon }
        }
      }
    });
  }
}

function getYears(): { [key: string]: string } {
  const currentYear = new Date().getFullYear();
  const years: { [key: string]: string } = {};
  for (let i = 0; i < 20; i++) {
    years[`${currentYear + i}`] = `${currentYear + i}`;
  }
  return years;
}

export function keepNumber(str: string = ''): string {
  return str.replace(/[^\d\*]/g, '');
}

function spitCCNubmer(str: string = '', spliter: string): string {
  return splitByPad(str, [4, 4, 4, 4]).join(spliter);
}

function spitCCNubmerAmex(str: string = '', spliter: string): string {
  return splitByPad(str, [4, 6, 5]).join(spliter);
}

function splitByPad(str: string = '', sizings: number[]): string[] {
  const arr = [] as string[];
  let i = 0;
  sizings.forEach(size => {
    if (str.substring(i, i + size)) {
      arr.push(str.substring(i, i + size));
    }
    i = i + size;
  });
  return arr;
}

// format credit card number, eg. 4111111111111111 to 4111-1111-1111-1111
function formatCCNumber(value: string): string {
  value = keepNumber(value);
  const cardType = CCType(value);
  if (!cardType || !cardType.length || !value) {
    return value;
  }
  const ccType = cardType[0].type;
  if (ccType === 'american-express') {
    return spitCCNubmerAmex(value, '-');
  } else {
    return spitCCNubmer(value, '-');
  }
}

// parse formated credit card number, eg. 4111-1111-1111-1111
// to {value: '4111111111111111', type: 'visa'}
function parseCCNumber(value: string = ''): { value: string; ccType?: CardBrand } | undefined {
  if (!value) {
    return;
  }

  value = keepNumber(value);
  const cardType = CCType(value);
  if (!cardType || !cardType.length || !value) {
    return { value };
  }

  const ccType = cardType[0].type;
  return { ccType, value };
}
