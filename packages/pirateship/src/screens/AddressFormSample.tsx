import React, { Component } from 'react';
import { View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarSampleScreen } from '../styles/Navigation';
import { AddressForm, AddressFormProps } from '@brandingbrand/fscomponents';
import { backButton } from '../lib/navStyles';

export interface AddressFormSampleProps extends ScreenProps, AddressFormProps {
  sampleScreen?: boolean;
}

class AddressFormSample extends Component<AddressFormSampleProps> {
  static navigatorStyle: NavigatorStyle = navBarSampleScreen;
  static leftButtons: NavButton[] = [backButton];

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
      >
        <View style={{padding: 15}}>
          <AddressForm />
        </View>
      </PSScreenWrapper>
    );
  }

}

export default AddressFormSample;
