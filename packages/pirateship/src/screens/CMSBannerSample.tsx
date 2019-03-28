import React, { Component } from 'react';
import { View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { backButton } from '../lib/navStyles';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarSampleScreen } from '../styles/Navigation';
import { AddressForm, AddressFormProps } from '@brandingbrand/fscomponents';

export interface CMSBannerSampleProps extends ScreenProps, AddressFormProps {}
// TODO: update with CMS Banner
class CMSBannerSample extends Component<CMSBannerSampleProps> {
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

export default CMSBannerSample;
