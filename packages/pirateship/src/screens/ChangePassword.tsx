import React, { Component } from 'react';

import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ContactInfoForm from '../components/ContactInfoForm';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { backButton } from '../lib/navStyles';
import { navBarHide } from '../styles/Navigation';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import withAccount, { AccountProps } from '../providers/accountProvider';
import { border, padding, palette } from '../styles/variables';
import PSButton from '../components/PSButton';
import translate, { translationKeys } from '../lib/translations';

const accountImage = require('../../assets/images/account-image.png');

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: palette.surface
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: palette.surface
  },
  headerContainer: {
    paddingHorizontal: padding.base
  },
  headerCallout: {
    textAlign: 'center',
    fontSize: 35,
    lineHeight: 41,
    marginBottom: 4,
    fontWeight: 'bold'
  },
  headerText: {
    textAlign: 'center'
  },
  accountImage: {
    margin: padding.base,
    marginBottom: 26
  },
  formContainer: {
    alignSelf: 'stretch',
    borderTopColor: border.color,
    borderTopWidth: border.width
  },
  button: {
    margin: padding.base
  },
  errorContainer: {
    backgroundColor: palette.surface,
    padding: padding.base,
    minHeight: 40,
    alignSelf: 'stretch'
  },
  errorText: {
    fontWeight: 'bold',
    color: palette.error
  }
});

export interface ChangePasswordScreenProps extends ScreenProps, AccountProps {
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

class ChangePassword extends Component<ChangePasswordScreenProps, ChangePasswordState> {
  static navigatorStyle: NavigatorStyle = navBarHide;
  static leftButtons: NavButton[] = [backButton];
  form: any;

  constructor(props: ChangePasswordScreenProps) {
    super(props);
    props.navigator.setTitle({
      title: translate.string(translationKeys.screens.changePassword.title)
    });

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
    const { isLoading } = this.state;
    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        needInSafeArea={true}
        style={styles.screenContainer}
        navigator={navigator}
      >
        <View style={styles.container}>
          <Image source={accountImage} style={styles.accountImage} />
          <View style={styles.headerContainer}>
            <Text style={styles.headerCallout}>
              {translate.string(translationKeys.account.actions.changePassword.headerCallout)}
            </Text>
            <Text style={styles.headerText}>
              {translate.string(translationKeys.account.actions.changePassword.headerText)}
            </Text>
          </View>
          {this.renderErrors()}
          <View style={styles.formContainer}>
            <ContactInfoForm
              values={this.state.values}
              onChange={this.onChange}
              updateFormRef={this.updateFormRef}
              hiddenFields={[
                'firstName',
                'lastName',
                'email',
                'emailConfirmation',
                'age',
                'gender',
                'specials'
              ]}
            />
            <PSButton
              title={translate.string(translationKeys.account.actions.changePassword.actionBtn)}
              onPress={this.handleChangePasswordPress}
              style={styles.button}
              loading={isLoading}
            />
          </View>
        </View>
      </PSScreenWrapper>
    );
  }

  renderErrors = () => {
    const { errors } = this.state;
    let errorMsgs;

    if (Array.isArray(errors) && errors.length > 0) {
      errorMsgs = errors.map((error, index) => (
        <Text
          key={index}
          style={styles.errorText}
        >
          {error}
        </Text>
      ));
    }

    return (
      <View style={styles.errorContainer}>
        {errorMsgs}
      </View>
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

export default withAccount(ChangePassword);
