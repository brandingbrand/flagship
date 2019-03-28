import React, { Component } from 'react';

import {
  StyleSheet,
  View
} from 'react-native';
import ContactInfoForm from '../components/ContactInfoForm';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { backButton } from '../lib/navStyles';
import { navBarSampleScreen } from '../styles/Navigation';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import withAccount, { AccountProps } from '../providers/accountProvider';
import { border, palette } from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: palette.surface
  },
  formContainer: {
    borderTopColor: border.color,
    borderTopWidth: border.width
  }
});

export interface ContactInfoSampleProps extends ScreenProps, AccountProps {
  email: string;
  currentPassword: string;
  onChangeSuccess: () => void;
  forceLogin?: boolean;
}

interface ChangePasswordState {
  isLoading: boolean;
  errors?: string[];
  values: FormValues;
}

interface FormValues {
  password: string;
  passwordConfirmation: string;
}

class ContactInfoSample extends Component<ContactInfoSampleProps, ChangePasswordState> {
  static navigatorStyle: NavigatorStyle = navBarSampleScreen;
  static leftButtons: NavButton[] = [backButton];
  form: any;

  constructor(props: ContactInfoSampleProps) {
    super(props);

    const state = {
      isLoading: false,
      errors: [],
      values: {
        password: '',
        passwordConfirmation: ''
      }
    };

    if (props.forceLogin && props.email && props.currentPassword) {
      state.isLoading = true;
      props
        .signIn(props.email, props.currentPassword)
        .then(() => this.setState({ isLoading: false }))
        .catch(() => this.setState({ isLoading: false }));

    }

    this.state = state;
  }

  render(): JSX.Element {
    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        needInSafeArea={true}
        style={styles.screenContainer}
        navigator={navigator}
      >
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <ContactInfoForm
              values={this.state.values}
              onChange={this.onChange}
              updateFormRef={this.updateFormRef}
            />
          </View>
        </View>
      </PSScreenWrapper>
    );
  }

  onChange = (values: FormValues) => {
    this.setState({ values });
  }

  updateFormRef = (ref: any) => {
    this.form = ref;
  }

  handleChangePasswordPress = async () => {
    this.setState({ errors: [] });
    const { errors } = this.form.validate();
    if (errors.length > 0) {
      return;
    }

    const { password } = this.state.values;
    const {
      currentPassword,
      updatePassword,
      email,
      updateCredentials,
      onChangeSuccess
    } = this.props;

    try {
      this.setState({ isLoading: true });
      await updatePassword(currentPassword, password);
      await updateCredentials(email, password);
      onChangeSuccess();
    } catch (e) {
      let errors = [translate.string(translationKeys.account.actions.changePassword.error)];

      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.error &&
        e.response.data.error.message
      ) {
        const msg = e.response.data.error.message;
        errors = Array.isArray(msg) ? msg : [msg];
      }

      this.setState({ errors });
    } finally {
      this.setState({ isLoading: false });
    }

  }
}

export default withAccount(ContactInfoSample);
