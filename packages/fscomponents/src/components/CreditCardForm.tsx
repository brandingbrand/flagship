import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

// @ts-ignore TODO: Update credit-card to support typing
import * as creditCard from 'credit-card';
import moment from 'moment';
// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import {
  creditCardAboveLabelTemplate,
  creditCardFloatingLabelTemplate,
  creditCardHiddenLabelTemplate,
  creditCardInlineLabelTemplate,
  Form,
  FormLabelPosition,
  maskedInputAboveLabelTemplate,
  maskedInputFloatingLabelTemplate,
  maskedInputHiddenLabelTemplate,
  maskedInputInlineLabelTemplate
} from './Form';
import { CreditCardType } from '../types/Store';
import { Dictionary } from '@brandingbrand/fsfoundation';

function getFieldTemplates(labelPosition?: FormLabelPosition): Dictionary {
  switch (labelPosition) {
    case FormLabelPosition.Above:
      return {
        creditCard: creditCardAboveLabelTemplate,
        maskedInput: maskedInputAboveLabelTemplate
      };
    case FormLabelPosition.Floating:
      return {
        creditCard: creditCardFloatingLabelTemplate,
        maskedInput: maskedInputFloatingLabelTemplate
      };
    case FormLabelPosition.Hidden:
      return {
        creditCard: creditCardHiddenLabelTemplate,
        maskedInput: maskedInputHiddenLabelTemplate
      };
    case FormLabelPosition.Inline:
      return {
        creditCard: creditCardInlineLabelTemplate,
        maskedInput: maskedInputInlineLabelTemplate
      };
    default:
      return {
        creditCard: creditCardInlineLabelTemplate,
        maskedInput: maskedInputInlineLabelTemplate
      };
  }
}

const NameType = t.refinement(t.String, (str: string) => {
  return str.length >= 4;
});

const FIELD_TYPES = t.struct({
  number: NameType,
  name: t.String,
  expirationDate: t.String,
  cvv: t.String
});

const FIELD_TYPES_HIDE_NAME = t.struct({
  number: NameType,
  expirationDate: t.String,
  cvv: t.String
});

const styles = StyleSheet.create({
  cardImages: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    marginTop: 5
  },
  inlineForm: {
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  inlineFormWrap: {
    width: '40%',
    maxWidth: 250
  }
});


export interface CreditCardFormData {
  number: string;
  name: string;
  extra: {
    expirationDate: string;
    cvv: string;
  };
}


export interface CreditCardFormProps {
  fieldsOptions?: any;
  fieldsStyleConfig?: any;
  hideName?: boolean;
  cscIcon?: ImageURISource;
  cscIconStyle?: StyleProp<ImageStyle>;
  defaultCardImage?: ImageURISource;
  labelPosition?: FormLabelPosition;
  style?: StyleProp<ViewStyle>;
  supportedCards?: {
    type: CreditCardType;
    image: ImageURISource;
  }[];
  supportedCardsLabel?: JSX.Element;
  supportedCardsStyle?: StyleProp<ViewStyle>;
  supportedIconStyle?: StyleProp<ImageStyle>;
  value?: CreditCardFormData;
  onChange?: (value: CreditCardFormData) => void;
}

export class CreditCardForm extends Component<CreditCardFormProps> {
  static defaultProps: Partial<CreditCardFormProps> = {
    labelPosition: FormLabelPosition.Inline
  };

  formRef: any;

  fieldOptions = (labelPosition?: FormLabelPosition) => {
    const defaultFieldOptions = {
      name: {
        label: 'Name',
        placeholder: 'Name',
        autoCorrect: false,
        error: 'Please enter your name'
      },
      number: {
        auto: 'none',
        label: 'Card Number',
        placeholder: 'Credit Card Number',
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        error: 'Please enter a valid card number',
        template: getFieldTemplates(labelPosition).creditCard,
        config: {
          cardImageStyle: {
            marginLeft: 2,
            marginTop: -1
          },
          cardImageWidth: 26,
          creditCardTypeImages: this.props.supportedCards,
          defaultCardImage: this.props.defaultCardImage
        }
      },
      cvv: {
        error: 'Invalid CSC',
        keyboardType: 'phone-pad',
        label: 'CSC',
        placeholder: 'CSC',
        template: getFieldTemplates(labelPosition).maskedInput,
        config: {
          type: 'custom',
          options: {
            mask: '9999'
          }
        }
      },
      expirationDate: {
        error: 'Invalid MM/YY',
        template: getFieldTemplates(labelPosition).maskedInput,
        label: 'Exp. Date',
        placeholder: 'Exp. Date (MM/YY)',
        keyboardType: 'phone-pad',
        config: {
          type: 'custom',
          options: {
            mask: '99/99'
          }
        }
      }
    };
    return {
      ...defaultFieldOptions,
      ...this.props.fieldsOptions
    };
  }
  getValue = () => {
    return this.formRef.getValue();
  }

  _saveFormRef = (ref: any) => {
    this.formRef = ref;
  }

  render(): JSX.Element {
    const cards = this.props.supportedCards || [];
    return (
      <View style={this.props.style}>
        <View style={[styles.cardImages, this.props.supportedCardsStyle, {marginBottom: 15}]}>
          {this.props.supportedCardsLabel}
          {cards.map(({ type, image }) => {
            return (
              <Image
                accessibilityLabel={type}
                key={`supported-card-${type}`}
                source={image}
                style={this.props.supportedIconStyle}
              />
            );
          })}
        </View>
        <Form
          fieldsOptions={this.fieldOptions(this.props.labelPosition)}
          fieldsStyleConfig={this.props.fieldsStyleConfig}
          fieldsTypes={this.props.hideName ? FIELD_TYPES_HIDE_NAME : FIELD_TYPES}
          ref={this._saveFormRef}
          value={this.props.value}
          onChange={this.props.onChange}
          labelPosition={this.props.labelPosition}
        />
      </View>
    );
  }
  validate = () => {
    if (this.formRef) {
      const validation = this.formRef.validate();
      if (validation.isValid()) {
        return this.validateCreditCard(this.formRef.getValue());
      } else {
        return false;
      }
    }
    return true;
  }

  private validateCreditCard = (value: any) => {
    const expirationDate = moment(value.expirationDate, 'MM/YY');

    const validationResult = creditCard.validate({
      cardType: creditCard.determineCardType(value.number),
      number: value.number,
      cvv: value.cvv,
      expiryMonth: expirationDate.month() + 1, // moment months are 0-11, creditCard expects 1-12
      expiryYear: expirationDate.year()
    });
    let valid = true;
    if (!validationResult.validCardNumber) {
      this.formRef.getComponent('number').setState({ hasError: true });
      valid = false;
    }
    if (!validationResult.validExpiryMonth || !validationResult.validExpiryYear ||
        creditCard.isExpired(expirationDate.month() + 1, expirationDate.year())) {
      this.formRef.getComponent('expirationDate').setState({ hasError: true });
      valid = false;
    }
    if (!validationResult.validCvv) {
      this.formRef.getComponent('cvv').setState({ hasError: true });
      valid = false;
    }
    return valid;
  }
}
