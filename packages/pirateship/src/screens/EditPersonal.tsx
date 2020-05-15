import { NavButton, ScreenProps } from '../lib/commonTypes';
import React, { Component } from 'react';
import PSScreenWrapper from '../components/PSScreenWrapper';
import PSButton from '../components/PSButton';
import { border, padding } from '../styles/variables';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Options } from 'react-native-navigation';
import { backButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import withAccount, { AccountProps } from '../providers/accountProvider';
import ContactInfoForm, { ContactFormValues } from '../components/ContactInfoForm';
import { handleAccountRequestError } from '../lib/shortcuts';
import AccountStyle from '../styles/Account';
import translate, { translationKeys } from '../lib/translations';

const styles = StyleSheet.create({
  form: {
    marginTop: padding.base,
    borderTopWidth: border.width,
    borderTopColor: border.color
  }
});

interface EditPersonalScreenProps extends ScreenProps, AccountProps {}

interface EditPersonalScreenState {
  values: ContactFormValues;
}

class EditPersonal extends Component<EditPersonalScreenProps, EditPersonalScreenState> {
  static options: Options = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  form: ContactInfoForm | null = null;

  constructor(props: EditPersonalScreenProps) {
    super(props);
    props.navigator.mergeOptions({
      topBar: {
        title: {
          text: translate.string(translationKeys.screens.editPersonal.title)
        }
      }
    });

    const accountStore = this.props.account.store;

    this.state = {
      values: {
        firstName: accountStore?.firstName ? accountStore.firstName : '',
        lastName: accountStore?.lastName ? accountStore.lastName : '',
        email: accountStore?.email ? accountStore.email : '',
        emailConfirmation: accountStore?.email ? accountStore.email : '',
        password: '',
        passwordConfirmation: '',
        age: accountStore?.age ? accountStore.age : '',
        gender: accountStore?.gender ? accountStore.gender : '',
        specials: accountStore?.receiveEmail ? accountStore.receiveEmail : false
      }
    };
  }

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
        needInSafeArea={true}
        scroll={false}
        style={AccountStyle.container}
        keyboardAvoidingViewProps={{
          keyboardVerticalOffset: 60 // offset action buttons
        }}
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

  onChange = (values: ContactFormValues) => {
    this.setState({ values });
  }

  cancel = async () => {
    return this.props.navigator.pop()
    .catch(e => console.warn('POP error: ', e));
  }

  save = () => {
    const values = this.form !== null && this.form.form.getValue();
    if (values) {
      this.props
        .updateAccount(values)
        .then(this.cancel)
        .catch((e: Error) => handleAccountRequestError(
          e, this.props.navigator, this.props.signOut));
    }
  }

  updateFormRef = (form: ContactInfoForm) => {
    this.form = form;
  }
}

export default withAccount(EditPersonal);
