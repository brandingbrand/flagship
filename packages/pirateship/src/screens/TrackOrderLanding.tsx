import React, { Component } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Options } from 'react-native-navigation';
// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');
import { Form } from '@brandingbrand/fscomponents';
import PSScreenWrapper from '../components/PSScreenWrapper';
import PSButton from '../components/PSButton';
import { backButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, ScreenProps } from '../lib/commonTypes';
import { border, color, padding, palette } from '../styles/variables';
import formFieldStyles from '../styles/FormField';
import { CUSTOMER_SERVICE_PHONE_NUMBER } from '../lib/constants';
import { textbox } from '../lib/formTemplate';

import translate, { translationKeys } from '../lib/translations';
const orderHistoryTranslations = translationKeys.account.orderHistory;

const env = require('../../env/env');

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface
  },
  text: {
    padding: padding.base,
    color: palette.onSurface
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 17
  },
  errorText: {
    fontWeight: 'bold',
    marginBottom: padding.base,
    color: palette.error
  },
  link: {
    fontWeight: 'bold',
    color: palette.secondary
  },
  buttonContainer: {
    padding: padding.base,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    width: 0,
    flexGrow: 1
  },
  rightButton: {
    marginLeft: padding.base
  }
});

export interface TrackOrderLandingState {
  isLoading: boolean;
  errors: string[];
  orderId: string;
  customerInfo: string;
}

export default class TrackOrderLanding extends Component<ScreenProps, TrackOrderLandingState> {
  static options: Options = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  form: any;
  formFields: any;
  formFieldOptions: any;

  constructor(props: ScreenProps) {
    super(props);
    props.navigator.mergeOptions({
      topBar: {
        title: {
          text: translate.string(translationKeys.screens.trackOrder.title)
        }
      }
    });

    this.formFields = t.struct({
      orderId: t.String,
      customerInfo: t.String
    });

    this.formFieldOptions = {
      orderId: {
        label: 'Order ID',
        placeholder: 'Required',
        placeholderTextColor: color.gray,
        autoCapitalize: 'none',
        autoCorrect: false,
        onSubmitEditing: this.focusField('customerInfo'),
        returnKeyType: 'next',
        help: this.renderOrderIdHelpBlock(),
        error: 'This field is required.'
      },
      customerInfo: {
        label: 'Contact Info',
        placeholder: 'Required',
        placeholderTextColor: color.gray,
        autoCapitalize: 'none',
        autoCorrect: false,
        returnKeyType: 'done',
        help: 'e.g. Last Name, Phone # (no dashes) or Shipping Zip/Postal Code.',
        error: 'This field is required.'
      }
    };

    this.state = {
      isLoading: false,
      errors: [],
      orderId: '',
      customerInfo: ''
    };
  }

  componentDidMount(): void {
    // tslint:disable-next-line:ter-max-len
    console.warn('TrackOrderLanding is deprecated and will be removed in the next version of Flagship.');
  }

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        navigator={this.props.navigator}
        style={styles.container}
        hideGlobalBanner={true}
        needInSafeArea={true}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled'
        }}
        keyboardAvoidingViewProps={{
          keyboardVerticalOffset: 56 // offset tab bar
        }}
      >
        <View>
          <Text style={styles.text}>
            {translate.string(orderHistoryTranslations.actions.trackOrder.description)}
          </Text>
          <View
            style={{
              padding: padding.base
            }}
          >
            {this.renderErrors()}
          </View>
          <Form
            ref={this.updateFormRef}
            fieldsTypes={this.formFields}
            fieldsOptions={this.formFieldOptions}
            fieldsStyleConfig={formFieldStyles}
            value={this.state}
            onChange={this.updateFormValues}
            templates={{ textbox }}
          />
          <View style={styles.buttonContainer}>
            <PSButton
              title={translate.string(orderHistoryTranslations.actions.reset.actionBtn)}
              onPress={this.resetFormValues}
              light={true}
              style={styles.button}
              loading={this.state.isLoading}
            />
          </View>
        </View>
        <View
          style={{
            margin: padding.base,
            borderBottomColor: border.color,
            borderBottomWidth: border.width
          }}
        />
        <View>
          <Text style={[styles.text, styles.headerText]}>
            {translate.string(orderHistoryTranslations.needHelp)}
          </Text>
          <Text style={styles.text}>
            {translate.string(orderHistoryTranslations.updateInterval)}
          </Text>
          <View style={styles.buttonContainer}>
            <PSButton
              title={translate.string(orderHistoryTranslations.actions.contact.actionBtn)}
              onPress={this.goToContactUs}
              light
              style={styles.button}
            />
            <PSButton
              title={translate.string(orderHistoryTranslations.actions.callSupport.actionBtn, {
                phone: CUSTOMER_SERVICE_PHONE_NUMBER
              })}
              onPress={this.callCustomerService}
              style={[styles.button, styles.rightButton]}
            />
          </View>
        </View>
      </PSScreenWrapper>
    );
  }

  updateFormRef = (form: any) => {
    this.form = form;
  }

  updateFormValues = (values: TrackOrderLandingState) => {
    this.setState({
      orderId: values.orderId,
      customerInfo: values.customerInfo
    });
  }

  focusField = (field: string) => {
    return () => this.form.getComponent(field).refs.input.focus();
  }

  renderErrors = () => {
    const { errors } = this.state;
    if (!Array.isArray(errors) || errors.length === 0) {
      return;
    }

    return errors.map((error, index) => {
      return (
        <Text
          key={index}
          style={styles.errorText}
        >
          {error}
        </Text>
      );
    });
  }

  resetFormValues = () => {
    this.setState({
      orderId: '',
      customerInfo: ''
    });
  }

  renderOrderIdHelpBlock = () => {
    return (
      <Text style={formFieldStyles.helpBlock.normal}>
        {translate.string(orderHistoryTranslations.actions.trackOrder.exampleQueries)}
        {' '}
        <Text
          onPress={this.goToOrderTrackerInfo}
          style={styles.link}
        >
          {translate.string(orderHistoryTranslations.actions.trackOrder.queryHelp)}
        </Text>
      </Text>
    );
  }

  goToOrderTrackerInfo = () => {
    this.props.navigator.push({
      component: {
        name: 'DesktopPassthrough',
        options: {
          topBar: {
            title: {
              text: translate.string(translationKeys.screens.trackOrder.title)
            }
          }
        },
        passProps: {
          url: `${env.desktopHost}/Customercare/OrderTrackerInfo.html`
        }
      }
    }).catch(e => console.warn('DesktopPassthrough PUSH error: ', e));
  }

  goToContactUs = () => {
    this.props.navigator.push({
      component: {
        name: 'DesktopPassthrough',
        options: {
          topBar: {
            title: {
              text: translate.string(translationKeys.screens.contactUs.title)
            }
          }
        },
        passProps: {
          url: `${env.desktopHost}/contactus`
        }
      }
    }).catch(e => console.warn('DesktopPassthrough PUSH error: ', e));
  }

  callCustomerService = async () => {

    const url = `tel:${CUSTOMER_SERVICE_PHONE_NUMBER}`;
    try {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn(`Unable to open url ${url}`, e);
      alert(
        'Cannot initialize Phone. Please try again later or dial ' +
        CUSTOMER_SERVICE_PHONE_NUMBER + '.'
      );
    }
  }
}
