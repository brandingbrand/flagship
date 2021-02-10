import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  ImageURISource,
  View
} from 'react-native';


const { width: viewportWidth } = Dimensions.get('window');
import RenderImageTextItem from '../carousel/RenderImageTextItem';

const sliderWidth = viewportWidth;

export interface GridItem {
  link: string;
  ratio: string;
  resizeMode: string;
  size: any;
  source: any;
  text: any;
}

export interface ImageGridState {
  tallestTextHeight: number;
}
export interface ImageGridProps {
  link: string;
  ratio?: string;
  resizeMode?: any;
  source: ImageURISource;
  size: any;
  text: any;
  headerStyle?: any;
  textStyle?: any;
  eyebrowStyle?: any;
  items: GridItem[];
  options: any;
  containerStyle?: any;
}

export default class ImageGrid
  extends Component<ImageGridProps, ImageGridState> {

  static contextTypes: any = {
    handleAction: PropTypes.func
  };
  constructor(props: ImageGridProps) {
    super(props);
    this.state = {
      tallestTextHeight: 0
    };
  }
  shouldComponentUpdate(nextProps: ImageGridProps, nextState: ImageGridState): boolean {
    return this.props.containerStyle !== nextProps.containerStyle ||
      this.props.items !== nextProps.items ||
      this.props.ratio !== nextProps.ratio ||
      this.props.options !== nextProps.options ||
      this.props.resizeMode !== nextProps.resizeMode ||
      this.props.source !== nextProps.source ||
      this.props.headerStyle !== nextProps.headerStyle ||
      this.props.textStyle !== nextProps.textStyle ||
      this.props.eyebrowStyle !== nextProps.eyebrowStyle ||
      this.state.tallestTextHeight !== nextState.tallestTextHeight;
  }
  wp(percentage: any): any {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  }
  _renderItem(item: any, index: number): JSX.Element {
    const { options, eyebrowStyle, headerStyle, textStyle } = this.props;
    const { numColumns = 2 } = options;
    const totalItemWidth =
      this.calculateGridWidth() - (options.spaceBetweenHorizontal * (numColumns - 1));
    const itemWidth = Math.round(totalItemWidth / numColumns);
    const spaceBetweenHorizontal = options.spaceBetweenHorizontal;
    const spaceBetweenVertical = options.spaceBetweenVertical;

    return (
      <RenderImageTextItem
        data={item}
        key={index}
        itemWidth={itemWidth}
        numColumns={numColumns}
        totalItemWidth={totalItemWidth}
        verticalSpacing={spaceBetweenVertical}
        horizPadding={spaceBetweenHorizontal}
        options={options}
        eyebrowStyle={eyebrowStyle}
        headerStyle={headerStyle}
        textStyle={textStyle}
        grid={true}
        noMargin={(index + 1) % numColumns === 0}
        even={(index + 1) % 2 === 0}
      />
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

  calculateGridWidth(): number {
    return sliderWidth - this.horizontalMarginPadding();
  }

  createGrid(): JSX.Element {
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
    const {
      containerStyle
    } = this.props;
    const grid = this.createGrid();
    return (
      <View style={containerStyle}>
        {grid}
      </View>
    );
  }
}
