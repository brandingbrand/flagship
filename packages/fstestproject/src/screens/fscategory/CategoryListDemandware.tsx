import React, { Component } from 'react';
import {
  Platform
} from 'react-native';
import { goToNavPush } from '../../lib/navigation';

import { demandware } from '../../lib/datasource';
import { Category } from '@brandingbrand/fscategory';

interface CategoryListDemandwareProps {
  history: string[];
  componentId: string;
  categoryId: string;
}

export default class CategoryListDemandware extends Component<CategoryListDemandwareProps> {
  constructor(props: CategoryListDemandwareProps) {
    super(props);
    this.state = {
      categories: []
    };
  }

  goTo = (screen: string, backButtonTitle: string = 'Back') => (category: {title: string}) => {
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
