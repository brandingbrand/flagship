import React, { Component } from 'react';

import {
  Dimensions,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Grid } from '@brandingbrand/fscomponents';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSRowHeader from '../components/PSRowHeader';
import PSRow from '../components/PSRow';

import { handleDeeplink } from '../lib/deeplinkHandler';
import { GridItem, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { border, palette } from '../styles/variables';
import { navBarTabLanding } from '../styles/Navigation';

import { env } from '@brandingbrand/fsapp';
const { desktopHost } = env;
import translate, { translationKeys } from '../lib/translations';


const GRID_ITEMS: GridItem[] = [
  {
    title: 'Track Order',
    image: require('../../assets/images/trackOrder.png'),
    path: '/'
  },
  {
    title: 'Contact Us',
    image: require('../../assets/images/contactUs.png'),
    path: '/'
  },
  {
    title: 'Shipping & Returns',
    image: require('../../assets/images/shippingReturns.png'),
    path: '/'
  },
  {
    title: 'Help',
    image: require('../../assets/images/help.png'),
    path: '/'
  }
];

export interface ListItem {
  title: string;
  path: string;
}

export interface ListSection {
  title: string;
  items: ListItem[];
}

const LIST_SECTIONS: ListSection[] = [
  {
    title: 'Section 1',
    items: [
      {
        title: 'Item 1',
        path: '/'
      }
    ]
  }
];

const styles = StyleSheet.create({
  grid: {
    marginBottom: 20
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridImageContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
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

export interface MoreState {
  gridItemWidth?: number;
}

export default class More extends Component<ScreenProps, MoreState> {
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  constructor(props: ScreenProps) {
    super(props);
    props.navigator.setTitle({ title: translate.string(translationKeys.screens.more.title) });

    // The grid items should be equal height and width. The width is dependent on the width
    // of the user's screen, so we'll derive the height from the screen width.
    this.state = {
      gridItemWidth: Math.floor(Dimensions.get('screen').width / 2)
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
      gridItemWidth: Math.floor(event.screen.width / 2)
    });
  }

  goToPassthrough = (path: string) => () => {
    handleDeeplink(desktopHost + path, this.props.navigator);
  }

  renderGridItem = ({ item }: ListRenderItemInfo<GridItem>): JSX.Element => {
    const dimensionStyle = {
      height: this.state.gridItemWidth
    };

    return (
      <TouchableOpacity
        style={[styles.gridItem, dimensionStyle]}
        onPress={this.goToPassthrough(item.path)}
      >
        <View style={styles.gridImageContainer}>
          <Image source={item.image} />
        </View>
        <Text style={styles.gridText}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  renderListItem = (
    item: ListItem,
    isFinalItem: boolean,
    key: string
  ): JSX.Element => {
    return (
      <PSRow
        style={!isFinalItem && styles.listItemBorder}
        title={item.title}
        onPress={this.goToPassthrough(item.path)}
        showImage={true}
        key={key}
      />
    );
  }

  renderListSection = (section: ListSection, index: number): JSX.Element[] => {
    const maxIndex = section.items.length - 1;
    const key = `section-${index}`;

    return [
      <PSRowHeader title={section.title} key={key} />,
      ...section.items.map((item, i) =>
        this.renderListItem(item, i >= maxIndex, `${key}-${i}`)
      )
    ];
  }

  render(): JSX.Element {
    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        navigator={navigator}
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
        {LIST_SECTIONS.map((section, i) => this.renderListSection(section, i))}
      </PSScreenWrapper>
    );
  }
}
