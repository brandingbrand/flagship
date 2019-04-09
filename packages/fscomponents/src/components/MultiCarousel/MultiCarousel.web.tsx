import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { findDOMNode } from 'react-dom';
import { MultiCarouselProps } from './MultiCarouselProps';
import { animatedScrollTo } from '../../lib/helpers';
import { PageIndicator } from '../PageIndicator';


const ScrollViewCopy: any = ScrollView;

export interface MultiCarouselState {
  containerWidth: number;
  currentIndex: number;
  itemWidth: number;
  opacity: Animated.Value;
}

const S = StyleSheet.create({
  goToNext: {
    position: 'absolute',
    top: '50%',
    right: 0,
    zIndex: 100,
    marginTop: -15,
    padding: 10
  },
  goToPrev: {
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: 100,
    marginTop: -15,
    padding: 10
  },
  buttonPrevIcon: {
    width: 25,
    height: 25,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'black',
    borderBottomColor: 'transparent',
    transform: [
      {
        rotate: '-45deg'
      }
    ]
  },
  buttonNextIcon: {
    width: 25,
    height: 25,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'black',
    borderLeftColor: 'transparent',
    transform: [
      {
        rotate: '45deg'
      }
    ]
  }
});

export class MultiCarousel<ItemT> extends Component<MultiCarouselProps<ItemT>, MultiCarouselState> {
  scrollView: any;
  mouseDown: boolean = false;
  currentScrollX: number = 0;
  initialScrollX: number = 0;
  initialScrollXTime: number = Date.now();
  defaultPeekSize: number = 0;
  defaultItemsPerPage: number = 2;

  constructor(props: MultiCarouselProps<ItemT>) {
    super(props);

    this.state = {
      currentIndex: 0,
      containerWidth: 0,
      itemWidth: 0,
      opacity: new Animated.Value(this.props.itemUpdated ? 0 : 1)
    };
  }

  componentDidUpdate(
    prevProps: MultiCarouselProps<ItemT>,
    prevState: MultiCarouselState,
    snapshot: any
  ): void {
    const animateItemChange = () => {
      this.state.opacity.setValue(0);
      Animated.timing(this.state.opacity, {
        toValue: 1
      }).start();
    };
    if (this.props.itemsPerPage !== prevProps.itemsPerPage) {
      this.setState({
        itemWidth: this.getItemWidth(this.state.containerWidth)
      });
    }
    if (this.props.items.length <= this.state.currentIndex) {
      if (this.props.items.length) {
        this.setState({
          currentIndex: this.props.items.length - 1
        });
      } else if (this.state.currentIndex !== 0) {
        this.setState({
          currentIndex: 0
        });
      }
    } else if (prevProps.renderItem !== this.props.renderItem) {
      animateItemChange();
    } else if (this.props.itemUpdated) {
      this.props.itemUpdated(
        prevProps.items[this.state.currentIndex],
        this.props.items[this.state.currentIndex],
        this.state.currentIndex,
        animateItemChange
      );
    }
  }

  handleContainerSizeChange = (e: any) => {
    const containerWidth = e.nativeEvent.layout.width;

    this.setState({
      containerWidth,
      itemWidth: this.getItemWidth(containerWidth)
    });
  }

  goToNext = (options?: any) => {
    options = options || { animated: true };
    const { currentIndex } = this.state;
    const nextIndex =
      currentIndex + 1 > this.getPageNum() - 1
        ? this.getPageNum() - 1
        : currentIndex + 1;

    this.goTo(nextIndex, options);
  }

  goToPrev = (options?: any) => {
    options = options || { animated: true };

    const { currentIndex } = this.state;
    const nextIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
    this.goTo(nextIndex, options);
  }

  goTo = (index: number, options?: any) => {
    animatedScrollTo(
      findDOMNode(this.scrollView),
      index * this.getPageWidth(),
      200
    );

    if (this.props.onSlideChange && this.state.currentIndex !== index) {
      this.props.onSlideChange({
        currentIndex: this.state.currentIndex,
        nextIndex: index
      });
    }

    this.setState({
      currentIndex: index
    });
  }

  goToOrigin = () => {
    const { currentIndex } = this.state;
    this.goTo(currentIndex);
  }

  getPageNum = () => {
    return Math.ceil(
      this.props.items.length /
        Math.floor(this.props.itemsPerPage || this.defaultItemsPerPage)
    );
  }

  getPageWidth = () => {
    return (
      this.state.itemWidth *
      Math.floor(this.props.itemsPerPage || this.defaultItemsPerPage)
    );
  }

  getItemWidth = (containerWidth: number) => {
    const peekSize = this.props.peekSize || this.defaultPeekSize;
    const itemPerPage = this.props.itemsPerPage || this.defaultItemsPerPage;

    return (
      (containerWidth - peekSize * (this.props.centerMode ? 2 : 1)) /
      itemPerPage
    );
  }

  handleTouchStart = (e: any) => {
    const scrollViewNode = findDOMNode(this.scrollView);
    this.initialScrollX = e.nativeEvent.pageX;
    if (scrollViewNode instanceof Element) {
      this.currentScrollX = scrollViewNode.scrollLeft;
    }
    this.initialScrollXTime = Date.now();
    this.mouseDown = true;
  }

  handleTouchEnd = (e: any) => {
    this.mouseDown = false;
    const dx = this.initialScrollX - e.nativeEvent.pageX;
    const vx = dx / (this.initialScrollXTime - Date.now());

    if (dx > 80 || vx < -0.3) {
      this.goToNext();
    } else if (dx < -80 || vx > 0.3) {
      this.goToPrev();
    } else {
      this.goToOrigin();
    }
  }

  handleTouchMove = (e: any) => {
    if (this.mouseDown) {
      const dx = this.initialScrollX - e.nativeEvent.pageX;
      const scrollX = this.currentScrollX + dx;
      this.scrollView.scrollTo({
        x: scrollX,
        y: 0
      });
    }
  }

  renderSingle = () => {
    if (!this.props.items || !this.props.items.length) {
      return null;
    }

    return (
      <View
        style={[{ alignItems: 'center' }, this.props.style]}
        onLayout={this.handleContainerSizeChange}
      >
        <View style={[{ width: this.state.itemWidth }, this.props.itemStyle]}>
          {this.props.renderItem(this.props.items[0], 0)}
        </View>
      </View>
    );
  }

  _saveScrollViewRef = (ref: any) => this.scrollView = ref;

  // tslint:disable-next-line:cyclomatic-complexity
  render(): React.ReactNode {
    const snapToInterval =
      this.state.itemWidth *
      Math.floor(this.props.itemsPerPage || this.defaultItemsPerPage);

    const pageNum = this.getPageNum();

    if (this.props.items.length <= 1) {
      return this.renderSingle();
    }

    return (
      <Animated.View
        style={[
          this.props.style,
          { opacity: this.state.opacity, overflow: 'hidden' }
        ]}
      >
        <ScrollViewCopy
          className='carousel-scroll-view'
          onLayout={this.handleContainerSizeChange}
          horizontal={true}
          ref={this._saveScrollViewRef}
          decelerationRate={0}
          snapToAlignment={'start'}
          snapToInterval={snapToInterval}
          showsHorizontalScrollIndicator={false}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onTouchMove={this.handleTouchMove}
          style={{ flexBasis: 'auto' }}
          onMouseDown={this.handleTouchStart}
          onMouseUp={this.handleTouchEnd}
          onMouseMove={this.handleTouchMove}
        >
          <View
            style={{ width: this.props.centerMode ? this.props.peekSize : 0 }}
          />
          {(this.state.itemWidth || (this.props.itemStyle && this.props.itemStyle.width))
            && this.props.items.map((item, i) => {
              return (
                <View
                  key={i}
                  style={[
                    {
                      width: this.state.itemWidth
                    },
                    this.props.itemStyle
                  ]}
                >
                  {this.props.renderItem(item, i)}
                </View>
              );
            })
          }
        </ScrollViewCopy>

        {this.props.renderPageIndicator ? (
          this.props.renderPageIndicator(
            this.state.currentIndex,
            this.props.items.length
          )
        ) : (
          <PageIndicator
            style={this.props.pageIndicatorStyle}
            currentIndex={this.state.currentIndex}
            itemsCount={pageNum}
            dotStyle={this.props.dotStyle}
            dotActiveStyle={this.props.dotActiveStyle}
          />
        )}

        {this.state.currentIndex !== 0 &&
          !!this.props.showArrow && (
            <TouchableOpacity
              accessibilityRole='button'
              accessibilityLabel={'Show previous'}
              style={[S.goToPrev, this.props.prevArrowContainerStyle]}
              onPress={this.goToPrev}
            >
              <View style={[S.buttonPrevIcon, this.props.prevArrowStyle]} />
            </TouchableOpacity>
          )}

        {this.state.currentIndex !== pageNum - 1 &&
          !!this.props.showArrow && (
            <TouchableOpacity
              accessibilityRole='button'
              accessibilityLabel={'Show next'}
              style={[S.goToNext, this.props.nextArrowContainerStyle]}
              onPress={this.goToNext}
            >
              <View style={[S.buttonNextIcon, this.props.nextArrowStyle]} />
            </TouchableOpacity>
          )}

        <style>
          {/* tslint:disable:jsx-use-translation-function */}
          {`.carousel-scroll-view {
          overflow: hidden
        }`}
        </style>
      </Animated.View>
    );
  }
}
