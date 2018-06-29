import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import { CarouselProps } from './CarouselProps';

export class Carousel extends Component<CarouselProps> {
  swiper: any;

  scrollBy = (index: number, animated?: boolean) => {
    this.swiper.scrollBy(index, animated);
  }

  render(): JSX.Element {
    const {
      height,
      style,
      children,
      showsPagination,
      nativeOptions,
      loop,
      currentPageIndicatorColor,
      pageIndicatorColor
    } = this.props;

    const loopCopy = typeof loop === 'undefined' ? false : loop;

    return (
      <Swiper
        ref={swiper => (this.swiper = swiper)}
        showsPagination={showsPagination}
        activeDotColor={currentPageIndicatorColor}
        dotColor={pageIndicatorColor}
        height={height}
        style={style}
        bounces={true}
        loop={loopCopy}
        {...nativeOptions}
      >
        {children}
      </Swiper>
    );
  }
}
