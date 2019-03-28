/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';
import PSScreenWrapper from '../components/PSScreenWrapper';

import { Grid } from '@brandingbrand/fscomponents';
import {
  Dimensions,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { border, palette } from '../styles/variables';
import { handleDeeplink } from '../lib/deeplinkHandler';
import { GridItem, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { env } from '@brandingbrand/fsapp';
import { PushedScreen } from 'react-native-navigation';
const { desktopHost } = env;

const styles = StyleSheet.create({
  grid: {
    paddingVertical: 20
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75
  },
  gridImageContainer: {
    height: 75,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },
  gridText: {
    marginTop: 15,
    color: palette.secondary
  },
  listItemBorder: {
    borderBottomWidth: border.width,
    borderBottomColor: border.color
  }
});

const GRID_ITEMS: SampleMenuGridItem[] = [
  {
    title: 'Account',
    image: require('../../assets/images/user.png'),
    path: '/',
    screen: {
      title: 'Account Examples',
      screen: 'AccountSampleMenu',
      backButtonTitle: ''
    }
  },
  {
    title: 'Product',
    image: require('../../assets/images/tag.png'),
    path: '/',
    screen: {
      title: 'Product Examples',
      screen: 'ProductSampleMenu',
      backButtonTitle: ''
    }
  },
  {
    title: 'Cart',
    image: require('../../assets/images/shopping-cart.png'),
    path: '/',
    screen: {
      title: 'Cart Examples',
      screen: 'CartSampleMenu',
      backButtonHidden: false,
      backButtonTitle: ''
    }
  },
  {
    title: 'Images',
    image: require('../../assets/images/image.png'),
    path: '/',
    screen: {
      title: 'Image Examples',
      screen: 'ImagesSampleMenu',
      backButtonTitle: ''
    }
  },
  {
    title: 'Forms',
    image: require('../../assets/images/check-form.png'),
    path: '/',
    screen: {
      title: 'Form Examples',
      screen: 'FormsSampleMenu',
      backButtonTitle: ''
    }
  },
  {
    title: 'Locations',
    image: require('../../assets/images/location-placeholder.png'),
    path: '/',
    screen: {
      title: 'Location Examples',
      screen: 'LocationSampleMenu', // todo
      backButtonTitle: ''
    }
  },
  {
    title: 'UI',
    image: require('../../assets/images/smartphone.png'),
    path: '/',
    screen: {
      title: 'UI Components',
      screen: 'UISampleMenu',
      backButtonTitle: ''
    }
  },
  {
    title: 'CMS',
    image: require('../../assets/images/content.png'),
    path: '/',
    screen: {
      title: 'CMS Components',
      screen: 'CMSSampleMenu',
      backButtonTitle: ''
    }
  }
];

export interface ComponentSampleMenuState {
  gridItemWidth?: number;
  gridItemHeight?: number;
}

export interface SampleMenuGridItem extends GridItem {
  screen: PushedScreen<{}>;
}

export default class ComponentSampleMenu extends Component<ScreenProps, ComponentSampleMenuState> {
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  constructor(props: ScreenProps) {
    super(props);
    // The grid items should be equal height and width. The width is dependent on the width
    // of the user's screen, so we'll derive the height from the screen width.
    this.state = {
      gridItemWidth: Math.floor(Dimensions.get('screen').width / 2),
      gridItemHeight: Math.floor(Dimensions.get('screen').height - 200) /
        (GRID_ITEMS.length / 2)
    };
  }

  componentWillMount(): void {
    Dimensions.addEventListener('change', this.handleDimensionChange);
  }

  componentWillUnmount(): void {
    Dimensions.removeEventListener('change', this.handleDimensionChange);
  }

  handleDimensionChange = (event: any) => {
    this.setState({
      gridItemWidth: Math.floor(event.screen.width / 2),
      gridItemHeight: Math.floor(event.screen.height - 200) /
      (GRID_ITEMS.length / 2)
    });
  }

  pushToScreen = (item: SampleMenuGridItem) => () => {
    this.props.navigator.push(item.screen);
  }

  goToPassthrough = (path: string) => () => {
    handleDeeplink(desktopHost + path, this.props.navigator);
  }

  renderGridItem = ({ item }: ListRenderItemInfo<SampleMenuGridItem>): JSX.Element => {
    const dimensionStyle = {
      height: this.state.gridItemHeight
    };

    return (
      <TouchableOpacity
        style={[styles.gridItem, dimensionStyle]}
        onPress={this.pushToScreen(item)}
      >
        <View style={styles.gridImageContainer}>
          <Image source={item.image} style={styles.gridImage} />
        </View>
        <Text style={styles.gridText}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        navigator={this.props.navigator}
        hideGlobalBanner={true}
      >
        <Grid
          style={styles.grid}
          columns={2}
          data={GRID_ITEMS}
          renderItem={this.renderGridItem}
          showColumnSeparators={true}
          showRowSeparators={true}
        />
      </PSScreenWrapper>
    );
  }
}
