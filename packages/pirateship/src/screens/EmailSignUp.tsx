import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Options } from 'react-native-navigation';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const tcomb = require('@brandingbrand/tcomb-form-native');
import { CMSBannerStacked, Form } from '@brandingbrand/fscomponents';

import { NavButton, ScreenProps } from '../lib/commonTypes';
import { backButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { CMSProvider, CMSValueSlot, fetchCMS } from '../lib/cms';
import { fontSize, palette } from '../styles/variables';
import formFieldStyles from '../styles/FormField';
import { textbox } from '../lib/formTemplate';
import PSButton from '../components/PSButton';
import PSHalfModal from '../components/PSHalfModal';
import { EMAIL_REGEX } from '../lib/constants';
import translate, { translationKeys } from '../lib/translations';
export interface EmailSignUpState {
  descriptionText?: string;
  modalVisible: boolean;
}

const FIELD_TYPES = tcomb.struct({
  email: tcomb.refinement(tcomb.String, (email: string) => {
    return EMAIL_REGEX.test(email);
  })
});

const FIELD_OPTIONS = {
  email: {
    label: translate.string(translationKeys.emailSignUp.form.email.label),
    keyboardType: 'email-address',
    error: translate.string(translationKeys.emailSignUp.form.email.error),
    autoCorrect: false,
    autoCapitalize: 'none'
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 100
  },
  cmsImage: {
    marginBottom: 14
  },
  cmsText: {
    marginBottom: 16,
    paddingLeft: 15,
    paddingRight: 15
  },
  submitButton: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    borderRadius: 6
  },
  modalCloseButton: {
    fontWeight: 'bold',
    color: palette.secondary,
    fontSize: fontSize.base
  },
  modalBody: {
    padding: 10,
    flex: 1
  },
  catalogButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10
  }
});

export default class EmailSignUp extends Component<ScreenProps, EmailSignUpState> {
  static options: Options = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  form?: Form;
  state: EmailSignUpState = {
    modalVisible: false
  };

  constructor(props: ScreenProps) {
    super(props);
    props.navigator.mergeOptions({
      topBar: {
        title: {
          text: translate.string(translationKeys.screens.emailSignUp.title)
        }
      }
    });
  }

  componentDidMount(): void {
    console.warn('EmailSignUp is deprecated and will be removed in the next version of Flagship.');

    fetchCMS('EmailSignup', 'promo')
      .then(instances => {
        const firstInstance = instances[0] as CMSValueSlot | undefined;
        if (firstInstance && firstInstance.Value) {
          this.setState({
            descriptionText: firstInstance.Value
          });
        }
      })
      .catch(error => {
        console.warn(error);
      });
  }

  setForm = (ref: Form) => {
    this.form = ref;
  }

  submitForm = () => {
    const values = this.form && this.form.getValue();

    if (values) {
      // This is currently hardcoded to the "success" state for demo purposes. Needs to be hooked
      // up to an actual data source for full functionality.
      this.setState({
        modalVisible: true
      });
    }
  }

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  }

  renderForm(): JSX.Element {
    return (
      <Form
        fieldsOptions={FIELD_OPTIONS}
        fieldsTypes={FIELD_TYPES}
        ref={this.setForm}
        fieldsStyleConfig={formFieldStyles}
        templates={{ textbox }}
      />
    );
  }

  renderSubmit(): JSX.Element {
    return (
      <PSButton
        title={translate.string(translationKeys.emailSignUp.actions.subscribe.actionText)}
        onPress={this.submitForm}
        style={styles.submitButton}
      />
    );
  }

  renderModalRightItem = (): JSX.Element => {
    return (
      <TouchableOpacity onPress={this.closeModal}>
        <Text style={styles.modalCloseButton}>
          {translate.string(translationKeys.emailSignUp.actions.subscribe.closeBtn)}
        </Text>
      </TouchableOpacity>
    );
  }

  renderModal(): JSX.Element {
    return (
      <PSHalfModal
        title={translate.string(translationKeys.emailSignUp.actions.subscribe.confirmationCallout)}
        onClose={this.closeModal}
        visible={this.state.modalVisible}
        renderRightItem={this.renderModalRightItem}
      >
        <View style={styles.modalBody}>
          <Text>
            {translate.string(translationKeys.emailSignUp.actions.subscribe.confirmationText)}
          </Text>
        </View>
      </PSHalfModal>
    );
  }

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        style={styles.container}
        hideGlobalBanner={true}
        navigator={this.props.navigator}
      >
        <CMSBannerStacked
          cmsProviderManagementConfig={CMSProvider}
          cmsProviderGroup='EmailSignup'
          cmsProviderSlot='hero'
          style={styles.cmsImage}
        />
        {this.state.descriptionText &&
          <Text style={styles.cmsText}>{this.state.descriptionText}</Text>
        }
        {this.renderForm()}
        {this.renderSubmit()}
        {this.renderModal()}
      </PSScreenWrapper>
    );
  }
}
