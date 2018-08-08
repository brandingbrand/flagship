import { ScreenProps } from '../lib/commonTypes';
import { Component, default as React } from 'react';
import { ScrollView, View } from 'react-native';
import PSAddressForm, { AddressFormValues } from '../components/PSAddressForm';
import PSButton from '../components/PSButton';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { dataSource } from '../lib/datasource';
import { handleAccountRequestError } from '../lib/shortcuts';
import withAccount, { AccountProps } from '../providers/accountProvider';
import AccountStyle from '../styles/Account';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import translate, { translationKeys } from '../lib/translations';

interface EditAddressScreenProps extends ScreenProps, AccountProps {
  address: CommerceTypes.CustomerAddress;
  edit: boolean;
  onComplete: Function;
}

class EditAddress extends Component<EditAddressScreenProps> {
  state: any;
  address?: CommerceTypes.CustomerAddress;
  form: any;

  constructor(props: EditAddressScreenProps) {
    super(props);

    let title = translate.string(translationKeys.screens.editAddress.noId);
    if (props && props.address && props.address.id) {
      title = translate.string(translationKeys.screens.editAddress.title, {
        address: props.address.id
      });
    }
    props.navigator.setTitle({ title });

    if (this.props.edit) {
      this.state = {
        values: {
          firstName: this.props.address.firstName,
          lastName: this.props.address.lastName,
          phone: this.props.address.phone,
          countryCode: this.props.address.countryCode,
          address1: this.props.address.address1,
          city: this.props.address.city,
          stateCode: this.props.address.stateCode,
          postalCode: this.props.address.postalCode,
          address2: this.props.address.address2,
          receiveEmail: false
        }
      };
    } else {
      this.state = {
        values: {}
      };
    }
  }

  updateFormRef = (ref: any) => {
    this.form = ref;
  }

  render(): JSX.Element {
    let actionTranslations = translationKeys.address.actions.add;
    if (this.props.edit) {
      actionTranslations = translationKeys.address.actions.edit;
    }

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
          <PSAddressForm
            values={this.state.values}
            onChange={this.onFormUpdate}
            updateFormRef={this.updateFormRef}
          />
        </ScrollView>

        <View style={AccountStyle.bottomRow}>
          <View style={AccountStyle.buttonsContainer}>
            <View style={AccountStyle.buttonContainer}>
              <PSButton
                light
                title={translate.string(actionTranslations.cancelBtn)}
                onPress={this.cancel}
              />
            </View>
            <View style={AccountStyle.buttonContainer}>
              <PSButton
                title={translate.string(actionTranslations.confirmBtn)}
                onPress={this.save}
              />
            </View>
          </View>
        </View>
      </PSScreenWrapper>
    );
  }

  onFormUpdate = (values: AddressFormValues) => {
    const {
      address1 = '',
      address2,
      city = '',
      countryCode = '',
      firstName = '',
      lastName = '',
      phone = '',
      postalCode = '',
      stateCode = ''
    } = values;

    this.address = {
      id: this.props.address && this.props.address.id,
      preferred: this.props.address && this.props.address.preferred,
      address1,
      address2,
      city,
      countryCode,
      firstName,
      lastName,
      phone,
      postalCode,
      stateCode
    };
  }

  cancel = () => {
    return this.props.navigator.dismissModal();
  }

  save = () => {
    if (this.form.getValue() && this.address) {
      let update;

      if (this.props.edit) {
        update = dataSource.editSavedAddress(this.address);
      } else {
        update = dataSource.addSavedAddress(this.address);
      }

      update.then(result => {
        if (this.props.onComplete) {
          this.props.onComplete(this.address);
          this.props.navigator.dismissModal();
        }
      })
      .catch(e => {
        alert(e.response.data.error.message);
        handleAccountRequestError(e, this.props.navigator, this.props.signOut);
      });
    }
  }
}

export default withAccount(EditAddress);
