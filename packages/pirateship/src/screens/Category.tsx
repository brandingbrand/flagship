import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { Category as FSCategory } from '@brandingbrand/fscategory';

import PSScreenWrapper from '../components/PSScreenWrapper';
import { dataSource, dataSourceConfig } from '../lib/datasource';
import { backButton, searchButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { NavArrow } from '@brandingbrand/fscomponents';
import { palette } from '../styles/variables';

// Default padding for CategoryBox component
const CATEGORY_BOX_DEFAULT_PADDING = 20;
const DEFAULT_IMAGE_WIDTH = 150;

const gridItemProps = {
  style: {
    flex: 1,
    padding: 15
  },
  titleStyle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    height: 65
  }
};

const listItemProps = {
  style: {
    flex: 1,
    padding: 0
  },
  titleStyle: {
    fontSize: 15,
    textAlign: 'left',
    height: 35,
    marginTop: 20
  },
  renderAccessory: (): JSX.Element => {
    return (
      <NavArrow color={palette.primary} style={{marginRight: 10}} />
    );
  }
};

export interface CategoryProps {
  categoryId: string;
  format?: string;
}

export interface PropType extends CategoryProps, ScreenProps {}

export interface StateType {
  screenWidth: number;
}

export default class Category extends Component<PropType, StateType> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  static rightButtons: NavButton[] = [searchButton];
  state: StateType = {
    screenWidth: Dimensions.get('window').width
  };

  componentDidMount(): void {
    Dimensions.addEventListener('change', this.onDimensionsChange);
  }

  componentWillUnmount(): void {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  onDimensionsChange = (dimensions: { window: any; screen: any }): void => {
    this.setState({
      screenWidth: dimensions.window.width
    });
  }

  onNavigate = (data: CommerceTypes.Category) => {
    let categoryPromise: Promise<CommerceTypes.Category>;

    if (dataSourceConfig.type === 'commercecloud') {
      // When using Commerce Cloud, a subcategory object has no indication whether it has child
      // categories or not, so we make an additional request to fetch that category's full response
      // to see if we should display it as a category or product index.
      categoryPromise = dataSource.fetchCategory(data.id)
        .then((category: CommerceTypes.Category) => {
          return category;
        });
    } else {
      categoryPromise = Promise.resolve(data);
    }

    categoryPromise.then(category => {
      const screen = Array.isArray(category.categories) && category.categories.length > 0 ?
        'Category' : 'ProductIndex';

      const passProps: any = {
        categoryId: category.id,
        title: category.title || ''
      };

      if (screen === 'Category') {
        passProps.format = dataSourceConfig.categoryFormat;
      }

      this.props.navigator.push({
        screen,
        title: category.title || '',
        passProps
      });
    })
    .catch(err => {
      console.warn(err);
    });
  }

  render(): JSX.Element {
    const { categoryId, format, navigator } = this.props;
    const categoryFormat = format && format === 'list' ? 'list' : 'grid';
    const margin = categoryFormat === 'grid' ? 15 : 0;
    const itemProps: any =
      categoryFormat === 'grid' ? gridItemProps : listItemProps;

    if (categoryFormat === 'grid') {
      let imageWidth = DEFAULT_IMAGE_WIDTH;

      if (this.state.screenWidth) {
        imageWidth = Math.floor(
          (this.state.screenWidth - margin * 2) / 2 -
            CATEGORY_BOX_DEFAULT_PADDING
        );
        imageWidth = Math.min(imageWidth, DEFAULT_IMAGE_WIDTH);
      }

      itemProps.imageStyle = {
        width: imageWidth,
        height: imageWidth
      };
    }

    return (
      <PSScreenWrapper
        navigator={navigator}
      >
        <View style={{ margin }}>
          <FSCategory
            format={categoryFormat}
            commerceDataSource={dataSource}
            categoryId={categoryId}
            onNavigate={this.onNavigate}
            categoryItemProps={itemProps}
            categoryGridProps={{
              showRowSeparators: true,
              showColumnSeparators: true
            }}
            onDataLoaded={this.updateTitle}
          />
        </View>
      </PSScreenWrapper>
    );
  }

  updateTitle = (data: any) => {
    if (data && typeof data === 'object') {
      const { title = '' } = data;
      this.props.navigator.setTitle({ title });
    }
  }
}
