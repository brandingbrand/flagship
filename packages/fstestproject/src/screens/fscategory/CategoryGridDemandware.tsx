import React, { Component } from 'react';
import {
  Platform
} from 'react-native';

import { demandware } from '../../lib/datasource';
import { Category } from '@brandingbrand/fscategory';
import { goToNavPush } from '../../lib/navigation';

export default class CategoryGridDemandware extends Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {
      categories: []
    };
  }

  goTo = (screen: string, backButtonTitle: string = 'Back') => (category: any) => {
    if (Platform.OS === 'web') {
      this.props.history.push('/' + screen);
    } else {
      goToNavPush('fscategory', this.props.componentId, screen, category.title, backButtonTitle);
    }
  }

  render(): JSX.Element {
    return (
      <Category
        format='grid'
        columns={3}
        commerceDataSource={demandware}
        categoryId={this.props.categoryId}
        onNavigate={this.goTo('CategoryListDemandware')}
        categoryItemProps={{
          style: { height: 120 }
        }}
      />
    );
  }
}
