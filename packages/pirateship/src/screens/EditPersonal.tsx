import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import React, { Component } from 'react';
import PSScreenWrapper from '../components/PSScreenWrapper';
import PSButton from '../components/PSButton';
import { border, padding } from '../styles/variables';
import { ScrollView, StyleSheet, View } from 'react-native';
import { backButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import withAccount, { AccountProps } from '../providers/accountProvider';
import ContactInfoForm from '../components/ContactInfoForm';
import { handleAccountRequestError } from '../lib/shortcuts';
import AccountStyle from '../styles/Account';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import translate, { translationKeys } from '../lib/translations';

const styles = StyleSheet.create({
  form: {
    marginTop: padding.base,
    borderTopWidth: border.width,
    borderTopColor: border.color
  }
});

interface EditPersonalScreenProps extends ScreenProps, AccountProps {}

class EditPersonal extends Component<EditPersonalScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  form: any;
  formFields: any;
  formFieldOptions: any;
  state: any;

  constructor(props: EditPersonalScreenProps) {
    super(props);
    props.navigator.setTitle({
      title: translate.string(translationKeys.screens.editPersonal.title)
    });

    // TODO: Update to match proper commerce types
    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      receiveEmail
      /* tslint:disable-next-line:no-unnecessary-type-assertion */
    } = this.props.account.store as CommerceTypes.CustomerAccount & { [key: string]: any };

    this.state = {
      values: {
        firstName,
        lastName,
        email,
        emailConfirmation: email,
        password: '',
        passwordConfirmation: '',
        age,
        gender,
        specials: receiveEmail
      }
    };
  }

  render(): JSX.Element {
    const { navigator } = this.props;
    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        needInSafeArea={true}
        scroll={false}
        style={AccountStyle.container}
        keyboardAvoidingViewProps={{
          keyboardVerticalOffset: 60 // offset action buttons
        }}
        navigator={navigator}
      >
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          style={AccountStyle.formContainer}
        >
          <ContactInfoForm
            style={styles.form}
            values={this.state.values}
            onChange={this.onChange}
            updateFormRef={this.updateFormRef}
            optionalFields={['password', 'passwordConfirmation', 'age', 'gender']}
          />
        </ScrollView>
        <View style={AccountStyle.bottomRow}>
          <View style={AccountStyle.buttonsContainer}>
            <View style={AccountStyle.buttonContainer}>
              <PSButton
                light
                title={translate.string(translationKeys.contactInfo.actions.cancel.actionBtn)}
                onPress={this.cancel}
              />
            </View>
            <View style={AccountStyle.buttonContainer}>
              <PSButton
                title={translate.string(translationKeys.contactInfo.actions.save.actionBtn)}
                onPress={this.save}
              />
            </View>
          </View>
        </View>
      </PSScreenWrapper>
    );
  }

  onChange = (values: any) => {
    this.setState({ values });
  }

  cancel = () => {
    return this.props.navigator.pop();
  }

  save = () => {
    const values = this.form.getValue();
    if (values) {
      this.props
        .updateAccount(values)
        .then(this.cancel)
        // TODO: add types for errors
        .catch((e: any) => handleAccountRequestError(e, this.props.navigator, this.props.signOut));
    }
  }

  updateFormRef = (form: any) => {
    this.form = form;
  }
}

export default withAccount(EditPersonal);
