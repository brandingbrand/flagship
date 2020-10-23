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
// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');
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
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.checkout.creditCardForm;


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

interface CreditCardValidation {
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
}

interface CCNumber {
  number: string;
}


export interface CreditCardFormProps {
  fieldsOptions?: Dictionary;
  fieldsStyleConfig?: Dictionary;
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

  formRef?: Form;

  componentDidMount(): void {
    // tslint:disable-next-line:ter-max-len
    console.warn('CreditCardForm is deprecated and will be removed in the next version of Flagship.');
  }

  fieldOptions = (labelPosition?: FormLabelPosition) => {
    const defaultFieldOptions = {
      name: {
        label: FSI18n.string(componentTranslationKeys.name),
        placeholder: FSI18n.string(componentTranslationKeys.name),
        autoCorrect: false,
        error: FSI18n.string(componentTranslationKeys.nameError)
      },
      number: {
        auto: 'none',
        label: FSI18n.string(componentTranslationKeys.numberLabel),
        placeholder: FSI18n.string(componentTranslationKeys.numberPlaceholder),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        error: this.handleNumberError,
        template: getFieldTemplates(labelPosition).creditCard,
        config: {
          cardImageStyle: {
            marginLeft: 2,
            marginTop: -1
          },
          cardImageWidth: 26,
          creditCardTypeImages: this.props.supportedCards,
          defaultCardImage: this.props.defaultCardImage,
          onBlur: this.handleNumberError
        }
      },
      cvv: {
        error: FSI18n.string(componentTranslationKeys.cscError),
        keyboardType: 'phone-pad',
        label: FSI18n.string(componentTranslationKeys.cscPlaceholder),
        placeholder: FSI18n.string(componentTranslationKeys.cscPlaceholder),
        template: getFieldTemplates(labelPosition).maskedInput,
        config: {
          type: 'custom',
          options: {
            mask: '9999'
          }
        }
      },
      expirationDate: {
        error: FSI18n.string(componentTranslationKeys.expirationError),
        template: getFieldTemplates(labelPosition).maskedInput,
        label: FSI18n.string(componentTranslationKeys.expirationLabel),
        placeholder: FSI18n.string(componentTranslationKeys.expirationPlaceholder),
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
    return this?.formRef?.getValue();
  }

  _saveFormRef = (ref: Form) => {
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
          validateOnBlur={true}
        />
      </View>
    );
  }

  handleNumberError = (value: CCNumber) => {
    const isValid = this.validateNumber(value);
    if (!isValid) {
      return FSI18n.string(componentTranslationKeys.numberError);
    }
    return '';
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

  validateNumber = (val: CCNumber) => {
    if (this.formRef) {
      const validation = this.formRef.getComponent('number').validate();
      if (validation.isValid()) {
        return this.validateCCNumber(val); // this validation was held till submit before
      }
      return false;
    }
    return true;
  }

  private validateCCNumber = (value: CCNumber) => {
    const validationResult = creditCard.validate({
      cardType: creditCard.determineCardType(value.number),
      number: value.number
    });
    let valid = true;
    if (!validationResult.validCardNumber) {
      this?.formRef?.getComponent('number').setState({ hasError: true });
      valid = false;
    }
    return valid;
  }

  private validateCreditCard = (value: CreditCardValidation) => {
    let valid = true;

    const expirationDateParts = (value.expirationDate || '').split('/');
    const expirationMonth = parseInt(expirationDateParts[0], 10);
    const expirationYear = parseInt('20' + expirationDateParts[1], 10);

    const validationResult = creditCard.validate({
      cardType: creditCard.determineCardType(value.number),
      number: value.number,
      cvv: value.cvv,
      expiryMonth: expirationMonth,
      expiryYear: expirationYear
    });

    if (!validationResult.validCardNumber) {
      this?.formRef?.getComponent('number').setState({ hasError: true });
      valid = false;
    }

    if (
      !validationResult.validExpiryMonth
      || !validationResult.validExpiryYear
      || creditCard.isExpired(expirationMonth, expirationYear)
    ) {
      this?.formRef?.getComponent('expirationDate').setState({ hasError: true });
      valid = false;
    }

    if (!validationResult.validCvv) {
      this?.formRef?.getComponent('cvv').setState({ hasError: true });
      valid = false;
    }

    return valid;
  }
}
