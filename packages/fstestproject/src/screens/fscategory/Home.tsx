import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';

export default class Home extends Component<any> {
  goTo = (screen: string, title: string, backButtonTitle: string) => () => {
    this.props.navigator.push({ screen: 'fscategory.' + screen, title, backButtonTitle });
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row
          text='Category Grid BrandCMS'
          onPress={this.goTo(
            'CategoryGridBrandCMS',
            'CategoryGridBrandCMS',
            'Back'
          )}
        />
        <Row
          text='Category List BrandCMS'
          onPress={this.goTo(
            'CategoryListBrandCMS',
            'CategoryListBrandCMS',
            'Back'
          )}
        />
        <Row
          text='Category List Demandware'
          onPress={this.goTo(
            'CategoryListDemandware',
            'CategoryListDemandware',
            'Back'
          )}
        />
        <Row
          text='Category Grid Demandware (3 Col)'
          onPress={this.goTo(
            'CategoryGridDemandware',
            'CategoryGridDemandware',
            'Back'
          )}
        />
      </ScrollView>
    );
  }
}
