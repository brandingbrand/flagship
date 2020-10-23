import React, { Component } from 'react';
import { View } from 'react-native';
import { LayoutComponent, Options } from 'react-native-navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { Breadcrumbs, BreadcrumbsProps } from '@brandingbrand/fscomponents';


export interface BreadCrumbsSampleScreenProps extends ScreenProps, BreadcrumbsProps {}

class BreadCrumbsSample extends Component<BreadCrumbsSampleScreenProps> {
  static options: Options = navBarTabLanding;

  render(): JSX.Element {

    const screenTitles = ['Search', 'More', 'Cart'];
    const screenCrumbs = screenTitles.map(crumb => {
      return {
        title: crumb,
        onPress: this.goTo({
          name: crumb,
          options: {
            ...navBarTabLanding,
            topBar: {
              title: {
                text: crumb
              }
            }
          }
        })
      };
    });

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
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

  goTo = (component: LayoutComponent) => () => {
    this.props.navigator.push({ component })
    .catch(e => console.warn(`${component.name} PUSH error: `, e));
  }
}

export default BreadCrumbsSample;
