import React, { Component } from 'react';
import {
  Platform
} from 'react-native';

import { demandware } from '../../lib/datasource';
import { Category } from '@brandingbrand/fscategory';
import { goToNavPush } from '../../lib/navigation';

interface CategoryGridDemandwareProps {
  componentId: string;
  history: string[];
  categoryId: string;
}

export default class CategoryGridDemandware extends Component<CategoryGridDemandwareProps> {
  constructor(props: CategoryGridDemandwareProps) {
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
