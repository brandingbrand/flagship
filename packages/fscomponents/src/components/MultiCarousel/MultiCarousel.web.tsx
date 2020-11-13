import React, { Component, MouseEvent, TouchEvent } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { findDOMNode } from 'react-dom';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { MultiCarouselProps } from './MultiCarouselProps';
import { animatedScrollTo } from '../../lib/helpers';
import { PageIndicator } from '../PageIndicator';

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
  scrollView?: React.RefObject<HTMLDivElement>;
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

    this.scrollView = React.createRef();
  }

  componentDidUpdate(
    prevProps: MultiCarouselProps<ItemT>,
    prevState: MultiCarouselState,
    snapshot: any
  ): void {
    const animateItemChange = () => {
      this.state.opacity.setValue(0);
      Animated.timing(this.state.opacity, {
        toValue: 1,
        useNativeDriver: true
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

    if (containerWidth === this.state.containerWidth) {
      return;
    }

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
    const scrollViewElement = findDOMNode(this.scrollView?.current);

    if (scrollViewElement instanceof Element) {
      animatedScrollTo(
        scrollViewElement,
        index * this.getPageWidth(),
        200
      ).catch(e => {
        console.warn('animatedScrollTo error', e);
      });
    }

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

  handleMouseStart = (e: MouseEvent) => {
    this.handleStart(e.pageX);
  }

  handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length) {
      this.handleStart(e.touches[0].pageX);
    }
  }

  handleStart = (pageX: number) => {
    const scrollViewNode = findDOMNode(this.scrollView?.current);
    this.initialScrollX = pageX;
    if (scrollViewNode instanceof Element) {
      this.currentScrollX = scrollViewNode.scrollLeft;
    }
    this.initialScrollXTime = Date.now();
    this.mouseDown = true;
  }

  handleMouseEnd = (e: MouseEvent) => {
    this.handleEnd(e.pageX);
  }

  handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length) {
      this.handleEnd(e.touches[0].pageX);
    } else {
      const pageX = this.initialScrollX + this.currentScrollX -
        (this.scrollView?.current?.scrollLeft || 0);
      this.handleEnd(pageX);
    }
  }

  handleEnd = (pageX: number) => {
    this.mouseDown = false;
    const dx = this.initialScrollX - pageX;
    const vx = dx / (this.initialScrollXTime - Date.now());

    if (dx > 80 || vx < -0.3) {
      this.goToNext();
    } else if (dx < -80 || vx > 0.3) {
      this.goToPrev();
    } else {
      this.goToOrigin();
    }
  }

  handleMouseMove = (e: MouseEvent) => {
    this.handleMove(e.pageX);
  }

  handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length) {
      this.handleMove(e.touches[0].pageX);
    }
  }

  handleMove = (pageX: number) => {
    if (this.mouseDown) {
      const dx = this.initialScrollX - pageX;
      const scrollX = this.currentScrollX + dx;
      this.scrollView?.current?.scrollTo({
        left: scrollX,
        top: 0
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

  // tslint:disable-next-line:cyclomatic-complexity
  render(): React.ReactNode {
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
        onLayout={this.handleContainerSizeChange}
      >
        <div
          ref={this.scrollView}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onTouchMove={this.handleTouchMove}
          style={{
            display: 'flex',
            flexBasis: 'auto',
            flexDirection: 'row',
            overflowY: 'hidden',
            overflowX: 'scroll'
          }}
          onMouseDown={this.handleMouseStart}
          onMouseUp={this.handleMouseEnd}
          onMouseMove={this.handleMouseMove}
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
        </div>

        {this.props.renderPageIndicator ? (
          this.props.renderPageIndicator(
            this.state.currentIndex,
            this.props.items.length
          )
        ) : !this.props.hidePageIndicator && (
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
            <div onBlur={this.props.prevArrowOnBlur}>
              <TouchableOpacity
                accessibilityRole='button'
                accessibilityLabel={FSI18n.string(translationKeys.flagship.multiCarousel.prevBtn)}
                style={[S.goToPrev, this.props.prevArrowContainerStyle]}
                onPress={this.goToPrev}
              >
                <View style={[S.buttonPrevIcon, this.props.prevArrowStyle]} />
              </TouchableOpacity>
            </div>
          )}

        {this.state.currentIndex !== pageNum - 1 &&
          !!this.props.showArrow && (
            <div onBlur={this.props.nextArrowOnBlur}>
              <TouchableOpacity
                accessibilityRole='button'
                accessibilityLabel={FSI18n.string(translationKeys.flagship.multiCarousel.nextBtn)}
                style={[S.goToNext, this.props.nextArrowContainerStyle]}
                onPress={this.goToNext}
              >
                <View style={[S.buttonNextIcon, this.props.nextArrowStyle]} />
              </TouchableOpacity>
            </div>
          )}
      </Animated.View>
    );
  }
}
