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
import { Form } from './Form';
import { creditCardTemplate, maskedInputTemplate } from '../lib/inputTemplates';
import { CreditCardType } from '../types/Store';

const FIELD_TYPES = t.struct({
  number: t.String,
  name: t.String,
  extra: t.struct({
    expirationDate: t.String,
    cvv: t.String
  })
});

const FIELD_TYPES_HIDE_NAME = t.struct({
  number: t.String,
  extra: t.struct({
    expirationDate: t.String,
    cvv: t.String
  })
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
  inlineFormCVV: {
    width: 100
  },
  inlineFormExpirationDate: {
    width: 140
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
  formRef: any;

  fieldOptions = () => {
    const defaultFieldOptions = {
      number: {
        auto: 'none',
        label: 'Credit Card Number',
        placeholder: 'Credit Card Number',
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        error: 'Please enter a valid credit card number',
        template: creditCardTemplate,
        config: {
          cardImageStyle: {
            marginLeft: 2,
            marginTop: -3
          },
          cardImageWidth: 26,
          creditCardTypeImages: this.props.supportedCards,
          defaultCardImage: this.props.defaultCardImage
        }
      },
      extra: {
        template: this.inlineFormTemplate,
        fields: {
          cvv: {
            error: 'Invalid CSC',
            keyboardType: 'phone-pad',
            label: 'CSC',
            placeholder: 'CSC',
            template: maskedInputTemplate,
            config: {
              type: 'custom',
              options: {
                mask: '9999'
              }
            }
          },
          expirationDate: {
            error: 'Invalid MM/YY',
            template: maskedInputTemplate,
            label: 'Expiration Date',
            placeholder: 'MM/YY',
            keyboardType: 'phone-pad',
            config: {
              type: 'custom',
              options: {
                mask: '99/99'
              }
            }
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
        <View style={[styles.cardImages, this.props.supportedCardsStyle]}>
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
          fieldsOptions={this.fieldOptions()}
          fieldsStyleConfig={this.props.fieldsStyleConfig}
          fieldsTypes={this.props.hideName ? FIELD_TYPES_HIDE_NAME : FIELD_TYPES}
          ref={this._saveFormRef}
          value={this.props.value}
          onChange={this.props.onChange}
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

  private inlineFormTemplate = (locals: any) => {
    return (
      <View style={styles.inlineForm}>
        <View style={styles.inlineFormWrap}>
          <View style={styles.inlineFormExpirationDate}>
            {locals.inputs.expirationDate}
          </View>
        </View>
        <View>
          <View style={styles.inlineFormCVV}>
            {locals.inputs.cvv}
          </View>
        </View>
        {this.props.cscIcon && (
          <View>
            <Image
              source={this.props.cscIcon}
              style={this.props.cscIconStyle}
            />
          </View>
        )}
      </View>
    );
  }

  private validateCreditCard = (value: any) => {
    const expirationDate = moment(value.extra.expirationDate, 'MM/YY');

    const validationResult = creditCard.validate({
      cardType: creditCard.determineCardType(value.number),
      number: value.number,
      cvv: value.extra.cvv,
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
      this.formRef.getComponent('extra.expirationDate').setState({ hasError: true });
      valid = false;
    }
    if (!validationResult.validCvv) {
      this.formRef.getComponent('extra.cvv').setState({ hasError: true });
      valid = false;
    }
    return valid;
  }
}
