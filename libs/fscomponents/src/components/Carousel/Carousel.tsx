import React, { Component } from 'react';

import Swiper from 'react-native-swiper';

import type { CarouselProps } from './CarouselProps';

export class Carousel extends Component<CarouselProps> {
  private swiper?: Swiper | null;

  private readonly scrollBy = (index: number, animated?: boolean) => {
    this.swiper?.scrollBy(index, animated);
  };

  public render(): JSX.Element {
    const {
      children,
      currentPageIndicatorColor,
      height,
      loop,
      nativeOptions,
      nextButton,
      pageIndicatorColor,
      prevButton,
      showsButtons,
      showsPagination,
      style,
    } = this.props;

    return (
      <Swiper
        activeDotColor={currentPageIndicatorColor}
        bounces
        containerStyle={style}
        dotColor={pageIndicatorColor}
        height={height}
        loop={loop ?? false}
        ref={(swiper) => (this.swiper = swiper)}
        showsPagination={showsPagination}
        {...nativeOptions}
        nextButton={nextButton}
        prevButton={prevButton}
        showsButtons={showsButtons}
      >
        {children}
      </Swiper>
    );
  }
}
