import React, { Component } from 'react';

// TODO: Update react-id-swiper to support typing
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';

import 'swiper/swiper-bundle.css';
import { View } from 'react-native';

import { Navigation, Pagination, Swiper } from 'swiper/swiper.esm';

import type { CarouselProps } from './CarouselProps';

let SWIPER_ID = 0;

// TODO: Fix swipe triggering a touch event on the slides

export class Carousel extends Component<CarouselProps> {
  constructor(props: CarouselProps) {
    super(props);
    this.id = SWIPER_ID++;
  }

  private readonly id: number;

  public render(): JSX.Element {
    const {
      children,
      currentPageIndicatorColor,
      height,
      loop,
      pageIndicatorColor,
      showsPagination,
      style,
      webOptions,
      webPaddingBottom,
    } = this.props;

    const _showsPagination = typeof showsPagination === 'undefined' ? true : showsPagination;

    return (
      <View style={style}>
        <div id={`web-swiper-${this.id}`}>
          <ReactIdSwiper
            Swiper={Swiper}
            loop={loop}
            modules={[Navigation, Pagination]}
            pagination={
              _showsPagination
                ? {
                    el: `.swiper-pagination`,
                    clickable: true,
                  }
                : {}
            }
            {...webOptions}
          >
            {React.Children.map(children ?? [], (child, i) => (
              <div key={i} style={{ height }}>
                {child}
              </div>
            ))}
          </ReactIdSwiper>
        </div>
        retu
        {/* swiper library doesn't have style props that let use to
          style inner component like dots and pagination, it's expecting
          to use global css instead... So we came up with the hack that
          creates this style tag that scoped to this component */}
        {currentPageIndicatorColor && (
          <style>
            {`#web-swiper-${this.id}
             .swiper-pagination-bullet.swiper-pagination-bullet-active {
                background-color: ${currentPageIndicatorColor} }`}
          </style>
        )}
        {pageIndicatorColor && (
          <style>
            {`#web-swiper-${this.id}
            .swiper-pagination-bullet {
              background-color: ${pageIndicatorColor}; opacity: 1 }`}
          </style>
        )}
        {webPaddingBottom && (
          <style>
            {`#web-swiper-${this.id}
            .swiper-wrapper {
              padding-bottom: ${webPaddingBottom}px }`}
          </style>
        )}
      </View>
    );
  }
}
