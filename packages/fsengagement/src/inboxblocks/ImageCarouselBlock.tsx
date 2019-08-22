// tslint:disable
import React, { Component } from 'react';
import {
  ImageStyle,
  ImageURISource,
  StyleProp,
  Text,
  View
} from 'react-native';
import styles, { colors } from '../carousel/index.style';
import Carousel, { Pagination } from 'react-native-snap-carousel';
const SLIDER_1_FIRST_ITEM = 1;
import { itemWidth, sliderWidth } from '../carousel/SliderEntry.style';
import SliderEntry from '../carousel/SliderEntry';
import RenderItem from '../carousel/RenderItem';
const jeans = [
  {
    "source": {
      "uri": "https://d3qb1nni77cli0.cloudfront.net/undefined-1566492717981-jeans1.jpg"
    },
    "ratio": "0.75"
  },
  {
    "source": {
      "uri": "https://d3qb1nni77cli0.cloudfront.net/undefined-1566492723000-jeans2.jpg"
    },
    "ratio": "0.75"
  },
  {
    "source": {
      "uri": "https://d3qb1nni77cli0.cloudfront.net/undefined-1566492730234-jeans3.jpg"
    },
    "ratio": "0.75"
  },
  {
    "source": {
      "uri": "https://d3qb1nni77cli0.cloudfront.net/undefined-1566495320074-jeans5.jpg"
    },
    "ratio": "0.75"
  },
  {
    "private_type": "Image",
    "display": "Image",
    "containerStyle": {},
    "key": "6vuMe3ydqjYA2SK",
    "source": {
      "uri": "https://d3qb1nni77cli0.cloudfront.net/undefined-1566498443305-levisquare.jpg"
    },
    "resizeMode": "cover",
    "imageStyle": {
      "height": 275
    },
    "useRatio": true,
    "size": {
      "width": 250,
      "height": 200
    },
    "ratio": "1.25"
  }
]
export const ENTRIES1 = [
  {
    title: 'Beautiful and dramatic Antelope Canyon',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/UYiroysl.jpg'
  },
  {
    title: 'Earlier this morning, NYC',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
  },
  {
    title: 'White Pocket Sunset',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
    illustration: 'https://i.imgur.com/MABUbpDl.jpg'
  },
  {
    title: 'Acrocorinth, Greece',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
  },
  {
    title: 'The lone tree, majestic landscape of New Zealand',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
  },
  {
    title: 'Middle Earth, Germany',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/lceHsT6l.jpg'
  }
];

export const ENTRIES2 = [
  {
    title: 'Favourites landscapes 1',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/SsJmZ9jl.jpg'
  },
  {
    title: 'Favourites landscapes 2',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/5tj6S7Ol.jpg'
  },
  {
    title: 'Favourites landscapes 3',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat',
    illustration: 'https://i.imgur.com/pmSqIFZl.jpg'
  },
  {
    title: 'Favourites landscapes 4',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/cA8zoGel.jpg'
  },
  {
    title: 'Favourites landscapes 5',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/pewusMzl.jpg'
  },
  {
    title: 'Favourites landscapes 6',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat',
    illustration: 'https://i.imgur.com/l49aYS3l.jpg'
  }
];

export interface ImageCarouselBlockProps {
  source: ImageURISource;
  resizeMode?: any;
  resizeMethod?: any;
  ratio?: string;
  useRatio?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: any;
}

export interface ImageCarouselBlockState {
  width?: number;
  height?: number;
  slider1ActiveSlide: number;
}

export default class ImageCarouselBlock
  extends Component<ImageCarouselBlockProps, ImageCarouselBlockState> {
  // readonly state: ImageCarouselBlockState = {};
  _slider1Ref: any | null = null;
  constructor(props: ImageCarouselBlockProps) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM
    };
  }

  componentDidMount(): void {
  //  this.setState(this.findImageRatio());
  }
  _renderItem(data: any): JSX.Element {
    return <RenderItem data={data.item} even={(data.index + 1) % 2 === 0} />;
  }

  _renderItemWithParallax(data: any, parallaxProps: any): JSX.Element {
    return (
      <SliderEntry
        data={data.item}
        even={(data.index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  _renderLightItem(data: any): JSX.Element {

    return <SliderEntry data={data.item} even={false} />;
  }

  _renderDarkItem(data: any): JSX.Element {
    return <SliderEntry data={data.item} even={true} />;
  }
  // shouldComponentUpdate(
  //   nextProps: ImageCarouselBlockProps, nextState: ImageCarouselBlockState
  // ): boolean {
  //   return this.props.containerStyle !== nextProps.containerStyle ||
  //     this.props.imageStyle !== nextProps.imageStyle ||
  //     this.props.ratio !== nextProps.ratio ||
  //     this.props.resizeMethod !== nextProps.resizeMethod ||
  //     this.props.resizeMode !== nextProps.resizeMode ||
  //     this.props.source !== nextProps.source ||
  //     this.props.useRatio !== nextProps.useRatio ||
  //     this.state.height !== nextState.height ||
  //     this.state.width !== nextState.width;
  // }

  // _onLayout = (event: LayoutChangeEvent) => {
  //   const { ratio, useRatio } = this.props;
  //   if (useRatio && ratio) {
  //     this.setState(this.findImageRatio());

  //   }
  // }
  // findImageRatio = (): ImageCarouselBlockState => {
  //   const { containerStyle, ratio, useRatio } = this.props;
  //   if (!useRatio) {
  //     return {};
  //   }
  //   const win = Dimensions.get('window');
  //   const result: ImageCarouselBlockState = { height: undefined, width: undefined };
  //   result.width = win.width;
  //   if (containerStyle.paddingLeft) {
  //     result.width = result.width - containerStyle.paddingLeft;
  //   }
  //   if (containerStyle.marginLeft) {
  //     result.width = result.width - containerStyle.marginLeft;
  //   }
  //   if (containerStyle.paddingRight) {
  //     result.width = result.width - containerStyle.paddingRight;
  //   }
  //   if (containerStyle.marginRight) {
  //     result.width = result.width - containerStyle.marginRight;
  //   }
  //   if (ratio) {
  //     result.height = result.width / parseFloat(ratio);
  //   }
  //   return result;
  // }
  mainExample(num: number, title: string): JSX.Element {
    const { slider1ActiveSlide } = this.state;

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.title}>{`Example ${num}`}</Text>
        <Text style={styles.subtitle}>{title}</Text>
        <Carousel
          ref={(c: any) => this._slider1Ref = c}
          data={ENTRIES1}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={false}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          // inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={false}
          loopClonesPerSide={2}
          autoplay={false}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />
        <Pagination
          dotsLength={ENTRIES1.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'rgba(255, 255, 255, 0.92)'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={colors.black}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._slider1Ref}
          tappableDots={!!this._slider1Ref}
        />
      </View>
    );
  }


  momentumExample(num: number, title: string): JSX.Element {
    return (
      <View style={styles.exampleContainer}>
        <Carousel
          data={jeans}
          renderItem={this._renderItem}
          hasParallaxImages={false}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={0.95}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          activeSlideAlignment={'start'}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          activeAnimationType={'spring'}
        />
      </View>
    );
  }

  layoutExample(num: number, title: string, type: any): JSX.Element {
    const isTinder = type === 'tinder';
    return (
      <View style={[styles.exampleContainer, isTinder ? styles.exampleContainerDark : styles.exampleContainerLight]}>
        <Text style={[styles.title, isTinder ? {} : styles.titleDark]}>{`Example ${num}`}</Text>
        <Text style={[styles.subtitle, isTinder ? {} : styles.titleDark]}>{title}</Text>
        <Carousel
          data={isTinder ? ENTRIES2 : ENTRIES1}
          renderItem={isTinder ? this._renderLightItem : this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          layout={type}
          loop={true}
        />
      </View>
    );
  }

  // customExample(num: number, title: string, refNumber: number, renderItemFunc: any): any {
  //   const isEven = refNumber % 2 === 0;

  //   // Do not render examples on Android; because of the zIndex bug, they won't work as is
  //   return !IS_ANDROID ? (
  //     <View style={[styles.exampleContainer, isEven ? styles.exampleContainerDark : styles.exampleContainerLight]}>
  //       <Text style={[styles.title, isEven ? {} : styles.titleDark]}>{`Example ${num}`}</Text>
  //       <Text style={[styles.subtitle, isEven ? {} : styles.titleDark]}>{title}</Text>
  //       <Carousel
  //         data={isEven ? ENTRIES2 : ENTRIES1}
  //         renderItem={renderItemFunc}
  //         sliderWidth={sliderWidth}
  //         itemWidth={itemWidth}
  //         containerCustomStyle={styles.slider}
  //         contentContainerCustomStyle={styles.sliderContentContainer}
  //         scrollInterpolator={scrollInterpolators[`scrollInterpolator${refNumber}`]}
  //         slideInterpolatedStyle={animatedStyles[`animatedStyles${refNumber}`]}
  //         useScrollView={true}
  //       />
  //     </View>
  //   ) : false;
  // }

  render(): JSX.Element {
    const {
      containerStyle
    } = this.props;
   // const example1 = this.mainExample(1, 'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');
    const example2 = this.momentumExample(2, 'Momentum | Left-aligned | Active animation');
   // const example3 = this.layoutExample(3, '"Stack of cards" layout | Loop', 'stack');
   // const example4 = this.layoutExample(4, '"Tinder-like" layout | Loop', 'tinder');
    // const example5 = this.customExample(5, 'Custom animation 1', 1, this._renderItem);
    // const example6 = this.customExample(6, 'Custom animation 2', 2, this._renderLightItem);
    // const example7 = this.customExample(7, 'Custom animation 3', 3, this._renderDarkItem);
    // const example8 = this.customExample(8, 'Custom animation 4', 4, this._renderLightItem);
  //  const imageRatioStyle: StyleProp<ImageStyle> = {};
    // if (this.state.height) {
    //   imageRatioStyle.height = this.state.height;
    // }
    // if (this.state.width) {
    //   imageRatioStyle.width = this.state.width;
    // }
    return (
      <View style={containerStyle}>

        {example2}
        {/* {example3}
        {example4} */}
      </View>
    );
  }
}
