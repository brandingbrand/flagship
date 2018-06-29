/* tslint:disable:jsx-use-translation-function */

import React, { Component } from 'react';
import {
  ScrollView,
  Text
} from 'react-native';
import Row from '../../components/Row';
import {
  cmsProductCatalog
} from '../../lib/datasource';
import {
  BrandCMSProductCatalog
} from '@brandingbrand/fsbrandcmsproductcatalog';

export default class BrandCMS extends Component<any, any> {
  client: BrandCMSProductCatalog;

  constructor(props: any) {
    super(props);
    this.client = cmsProductCatalog;
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Text style={{ padding: 10, color: '#999' }}>
          This is using a demo CMS instance
        </Text>
        <Row
          text='Fetch home/home-category-grid'
          onPress={this.fetchCategory('home/home-category-grid')}
        />
        <Row
          text='Fetch Non Exist Category'
          onPress={this.fetchCategory('root')}
        />
        <Row text='Fetch Product' onPress={this.fetchProduct} />
        <Row text='Fetch Product Index' onPress={this.fetchProducts} />
      </ScrollView>
    );
  }

  showData = (data: any) => {
    this.props.navigator.push({
      screen: 'fscommerce.DataView',
      passProps: {
        json: JSON.stringify(data, null, '  ')
      }
    });
  }

  fetchProduct = () => {
    alert('not implemented');
  }

  fetchProducts = () => {
    alert('not implemented');
  }

  fetchCategory = (id: any) => () => {
    this.client
      .fetchCategory(id)
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }
}
