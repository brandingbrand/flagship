import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import { CarouselProps } from './CarouselProps';

export class Carousel extends Component<CarouselProps> {
  swiper?: Swiper | null;

  scrollBy = (index: number, animated?: boolean) => {
    this.swiper?.scrollBy(index, animated);
  }

  render(): JSX.Element {
    const {
      height,
      style,
      children,
      showsButtons,
      showsPagination,
      nativeOptions,
      nextButton,
      loop,
      currentPageIndicatorColor,
      pageIndicatorColor,
      prevButton
    } = this.props;

    return (
      <Swiper
        ref={swiper => (this.swiper = swiper)}
        showsPagination={showsPagination}
        activeDotColor={currentPageIndicatorColor}
        dotColor={pageIndicatorColor}
        height={height}
        containerStyle={style}
        bounces={true}
        loop={loop ?? false}
        {...nativeOptions}
        showsButtons={showsButtons}
        nextButton={nextButton}
        prevButton={prevButton}
      >
        {children}
      </Swiper>
    );
  }
}
