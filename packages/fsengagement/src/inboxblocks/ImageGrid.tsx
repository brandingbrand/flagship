import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  ImageURISource,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


const { width: viewportWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainerNoCard: {
    flex: 1,
    backgroundColor: 'white'
  },
  image: {
    resizeMode: 'cover',
    ...StyleSheet.absoluteFillObject
  }
});

const sliderWidth = viewportWidth;
let renderItemWidth: number = 0;
const { height: viewportHeight } = Dimensions.get('window');

export interface GridItem {
  link: string;
  ratio: string;
  resizeMode: string;
  size: any;
  source: any;
  text: any;
}


export interface ImageGridProps {
  link: string;
  ratio?: string;
  resizeMode?: any;
  source: ImageURISource;
  size: any;
  text: any;
  textStyle: any;
  items: GridItem[];
  options: any;
  containerStyle?: any;
}

export default class ImageGrid
  extends Component<ImageGridProps> {

  static contextTypes: any = {
    handleAction: PropTypes.func
  };

  constructor(props: ImageGridProps) {
    super(props);
  }

  wp(percentage: any): any {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  }

  _renderItem(item: any, index: number): JSX.Element {
    const { ratio, source, text } = item;
    const { options } = this.props;
    const even = (index + 1) % 2 === 0;

    const itemWidth = renderItemWidth;
    const spaceBetweenHorizontal = options.spaceBetweenHorizontal;
    const spaceBetweenVertical = options.spaceBetweenVertical;

    let itemStyle;

    if (ratio && itemWidth) {
      itemStyle = {
        width: even ? itemWidth - 1 : itemWidth,
        height: (itemWidth / parseFloat(ratio)) + (text && 30 || 0),
        paddingHorizontal: 0,
        marginLeft: even ? spaceBetweenHorizontal : 0,
        marginBottom: spaceBetweenVertical
      };
    } else {
      itemStyle = {
        width: itemWidth,
        height: viewportHeight * 0.36
      };
    }

    return (
      <TouchableOpacity
        key={index}
        style={itemStyle}
        onPress={this.onGridPress(item.link)}
      >
        <View style={styles.imageContainerNoCard}>
          <Image
            style={styles.image}
            source={source}
            resizeMode={'cover'}
          />
        </View>
        {text &&
          <Text style={[{ height: 30, marginTop: 7 }, this.props.textStyle]}>{text.value}</Text>}
      </TouchableOpacity>
    );
  }

  horizontalMarginPadding(): number {
    const {
      containerStyle
    } = this.props;
    const ml = containerStyle.marginLeft || 0;
    const mr = containerStyle.marginRight || 0;
    const pr = containerStyle.paddingRight || 0;
    const pl = containerStyle.paddingLeft || 0;
    return ml + mr + pr + pl;
  }

  calculateSliderWidth(): number {
    return sliderWidth - this.horizontalMarginPadding();
  }

  calculateItemWidth(): number {
    const {
      options
    } = this.props;
    const slideWidth = this.wp(50);
    return slideWidth - (options.spaceBetweenHorizontal / 2) - (this.horizontalMarginPadding() / 2);
  }

  createGrid(): JSX.Element {
    renderItemWidth = this.calculateItemWidth();
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        {(this.props.items || []).map((product: any, index: number) => {
          return this._renderItem(product, index);
        })}
      </View>
    );
  }

  onGridPress = (link: string) => () => {
    const { handleAction } = this.context;
    handleAction({
      type: 'deep-link',
      value: link
    });
  }

  render(): JSX.Element {

    const grid = this.createGrid();
    return (
      <View>
        {grid}
      </View>
    );
  }
}
