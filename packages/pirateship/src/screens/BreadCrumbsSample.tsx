import React, { Component } from 'react';
import { View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { Breadcrumbs, BreadcrumbsProps } from '@brandingbrand/fscomponents';

type Screen = import ('react-native-navigation').Screen;

export interface BreadCrumbsSampleScreenProps extends ScreenProps, BreadcrumbsProps {}

class BreadCrumbsSample extends Component<BreadCrumbsSampleScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  render(): JSX.Element {

    const { navigator } = this.props;
    const screenTitles = ['Search', 'More', 'Cart'];
    const screenCrumbs = screenTitles.map(crumb => {
      return {
        title: crumb,
        onPress: this.goTo({ title: crumb, screen: crumb, navigatorStyle: navBarTabLanding })
      };
    });

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
      >
        <View style={{padding: 15}}>
          <Breadcrumbs
            items={screenCrumbs}
            separator={'•'}
            showTrailingSeparator={false}
          />
        </View>
      </PSScreenWrapper>
    );
  }

  goTo = (screen: Screen) => () => {
    this.props.navigator.push(screen);
  }
}

export default BreadCrumbsSample;
