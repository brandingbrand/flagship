/* tslint:disable:jsx-use-translation-function */

import React, { Component } from 'react';
import {
  ScrollView,
  Text
} from 'react-native';
import { showDataNavPush } from '../../lib/navigation';

import Row from '../../components/Row';
import {
  cmsProductCatalog
} from '../../lib/datasource';
import {
  BrandCMSProductCatalog
} from '@brandingbrand/fsbrandcmsproductcatalog';

interface BrandCMS {
  componentId: string;
}

class BrandCMS extends Component<BrandCMS> {
  client: BrandCMSProductCatalog;

  constructor(props: BrandCMS) {
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

  fetchProduct = () => {
    alert('not implemented');
  }

  fetchProducts = () => {
    alert('not implemented');
  }

  fetchCategory = (id: string) => () => {
    this.client
      .fetchCategory(id)
      .then(data => {
        showDataNavPush(this.props.componentId, data);
      })
      .catch((err: Error) => {
        console.warn(err);
      });
  }
}

export default BrandCMS;
