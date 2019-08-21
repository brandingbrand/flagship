import React, { Component } from 'react';
import {
  Platform
} from 'react-native';
import { goToNavPush } from '../../lib/navigation';

import { demandware } from '../../lib/datasource';
import { Category } from '@brandingbrand/fscategory';

export default class CategoryListDemandware extends Component<any> {
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
        commerceDataSource={demandware}
        categoryId={this.props.categoryId}
        onNavigate={this.goTo('CategoryListDemandware')}
        categoryItemProps={{
          style: { height: 50 }
        }}
      />
    );
  }
}
