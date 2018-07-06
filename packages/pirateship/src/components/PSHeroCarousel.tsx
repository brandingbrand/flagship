import React, { Component } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { get } from 'lodash-es';
import { MultiCarousel } from '@brandingbrand/fscomponents';
import { palette } from '../styles/variables';
import { fetchCMS } from '../lib/cms';

const styles = StyleSheet.create({
  container: {
    height: 175,
    backgroundColor: palette.surface
  },
  containerLoaded: {
    backgroundColor: 'transparent'
  },
  image: {
    width: '100%',
    height: 175,
    borderRadius: 5
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 10
  },
  dotStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.secondary,
    marginHorizontal: 5
  },
  dotActiveStyle: {
    backgroundColor: palette.secondary,
    opacity: 1
  },
  item: {
    paddingHorizontal: 15
  }
});

export interface PSHeroCarouselItem {
  Image: {
    height: number;
    width: number;
    path: string;
  };
  Link: string;
}

export interface PSHeroCarouselProps {
  style?: StyleProp<ViewStyle>;
  cmsGroup: string;
  cmsSlot: string;
  cmsIdentifier?: string;
  onItemPress?: (item: PSHeroCarouselItem) => void;
}

export default class PSHeroCarousel extends Component<PSHeroCarouselProps> {
  state: any = {
    slotData: []
  };

  componentWillMount(): void {
    fetchCMS(this.props.cmsGroup, this.props.cmsSlot, this.props.cmsIdentifier)
      .then(slotData => this.setState({ slotData }))
      .catch(e => console.error('error fetching cms slot ', e));
  }

  render(): JSX.Element {
    return (
      <View
        style={[
          styles.container,
          this.state.slotData.length && styles.containerLoaded,
          this.props.style
        ]}
      >
        <MultiCarousel
          itemsPerPage={1}
          items={this.state.slotData}
          pageIndicatorStyle={styles.pageIndicator}
          dotStyle={styles.dotStyle}
          dotActiveStyle={styles.dotActiveStyle}
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  renderItem = (item: PSHeroCarouselItem) => {
    const imagePath = get(item, 'Retina-Image.path');

    return (
      <TouchableOpacity
        onPress={this.handleItemPress(item)}
        style={styles.item}
      >
        <Image
          source={{ uri: imagePath }}
          style={styles.image}
          resizeMode='contain'
        />
      </TouchableOpacity>
    );
  }

  handleItemPress = (item: PSHeroCarouselItem) => () => {
    if (this.props.onItemPress) {
      this.props.onItemPress(item);
    }
  }
}
