import React, { Component, RefObject } from 'react';
import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { MultiCarouselProps } from './MultiCarouselProps';
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
    transform: [
      {
        rotate: '45deg'
      }
    ]
  }
});

export class MultiCarousel<ItemT> extends Component<MultiCarouselProps<ItemT>, MultiCarouselState> {
  currentScrollX: number = 0;
  initialScrollX: number = 0;
  defaultPeekSize: number = 0;
  defaultItemsPerPage: number = 2;

  private scrollView: RefObject<FlatList<ItemT>>;

  constructor(props: MultiCarouselProps<ItemT>) {
    super(props);

    if (props.peekSize && !Number.isInteger(props.peekSize * 2)) {
      console.error(
        `MultiCarousel: (peekSize * 2) must be an integer but got (${props.peekSize} * 2)`
      );
    }

    this.scrollView = React.createRef<FlatList<ItemT>>();

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
        toValue: 1,
        useNativeDriver: true
      }).start();
    };
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
      currentIndex + 1 > this.getPageNum() - 1 ? this.getPageNum() - 1 : currentIndex + 1;

    this.goTo(nextIndex, options);
  }

  goToPrev = (options?: any) => {
    options = options || { animated: true };

    const { currentIndex } = this.state;
    const nextIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
    this.goTo(nextIndex, options);
  }

  goTo = (index: number, options?: any) => {
    options = options || { animated: true };

    // No scrollView when there is only one image
    if (!this.scrollView) {
      return;
    }

    if (this.scrollView.current) {
      this.scrollView.current.scrollToOffset({
        offset: index * this.getPageWidth(),
        animated: options.animated
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

  handleScrollRelease = (e: any) => {
    if (Platform.OS !== 'android') {
      return;
    }

    const diffX = e.nativeEvent.contentOffset.x - this.initialScrollX;

    if (diffX > 80 || e.nativeEvent.velocity.x < -0.5) {
      this.goToNext();
    } else if (diffX < -80 || e.nativeEvent.velocity.x > 0.5) {
      this.goToPrev();
    } else {
      this.goToOrigin();
    }
  }

  handleScrollBegin = (e: any) => {
    if (Platform.OS !== 'android') {
      return;
    }
    this.initialScrollX = e.nativeEvent.contentOffset.x;
  }

  handleMomentumScrollEnd = (e: any) => {
    if (Platform.OS !== 'ios') {
      return;
    }
    const offset = e.nativeEvent.contentOffset.x < 0 ? 0 : e.nativeEvent.contentOffset.x;

    const pageWidth = this.getPageWidth();
    const pageNum = this.getPageNum();

    const nextIndex =
      offset > pageWidth * (pageNum - 2) ? pageNum - 1 : Math.floor(offset / pageWidth);
    this.setState({ currentIndex: nextIndex });

    if (this.props.onSlideChange) {
      this.props.onSlideChange({
        currentIndex: this.state.currentIndex,
        nextIndex
      });
    }
  }

  getPageNum = () => {
    return Math.ceil(
      this.props.items.length / (this.props.itemsPerPage || this.defaultItemsPerPage)
    );
  }

  getPageWidth = () => {
    return this.state.itemWidth * (this.props.itemsPerPage || this.defaultItemsPerPage);
  }

  getItemWidth = (containerWidth: number) => {
    const peekSize = this.props.peekSize || this.defaultPeekSize;
    const itemPerPage = this.props.itemsPerPage || this.defaultItemsPerPage;

    return (containerWidth - peekSize * (this.props.centerMode ? 2 : 1)) / itemPerPage;
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

  renderItem = ({ item, index }: ListRenderItemInfo<ItemT>) => {
    return (
      <View key={index} style={[{ width: this.state.itemWidth }, this.props.itemStyle]}>
        {this.props.renderItem(item, index)}
      </View>
    );
  }

  keyExtractor = (item: ItemT, index: number): string => {
    if (this.props.keyExtractor) {
      return this.props.keyExtractor(item, index);
    }

    const testItem = item as any;

    return testItem.key || testItem.id || '' + index;
  }

  render(): React.ReactNode {
    const snapToInterval =
      this.state.itemWidth * (this.props.itemsPerPage || this.defaultItemsPerPage);

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
        <FlatList
          onLayout={this.handleContainerSizeChange}
          horizontal={true}
          ref={this.scrollView}
          decelerationRate={0}
          snapToAlignment={'start'}
          snapToInterval={snapToInterval}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this.handleMomentumScrollEnd}
          onScrollEndDrag={this.handleScrollRelease}
          onScrollBeginDrag={this.handleScrollBegin}
          data={this.props.items}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />

        {this.props.renderPageIndicator ? (
          this.props.renderPageIndicator(this.state.currentIndex, this.props.items.length)
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
              style={S.goToPrev}
              onPress={this.goToPrev}
            >
              <View style={S.buttonPrevIcon} />
            </TouchableOpacity>
          )}

        {this.state.currentIndex !== pageNum - 1 &&
          !!this.props.showArrow && (
            <TouchableOpacity
              accessibilityRole='button'
              accessibilityLabel={'Show next'}
              style={S.goToNext}
              onPress={this.goToNext}
            >
              <View style={S.buttonNextIcon} />
            </TouchableOpacity>
          )}
      </Animated.View>
    );
  }
}
