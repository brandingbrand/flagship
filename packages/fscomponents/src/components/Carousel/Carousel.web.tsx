import React, { Component } from 'react';

// @ts-ignore TODO: Update react-id-swiper to support typing
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css' // tslint:disable-line
import { View } from 'react-native';
import { CarouselProps } from './CarouselProps';

let SWIPER_ID = 0;

// TODO: Fix swipe triggering a touch event on the slides

export class Carousel extends Component<CarouselProps> {
  id: number;
  constructor(props: CarouselProps) {
    super(props);
    this.id = SWIPER_ID++;
  }

  render(): JSX.Element {
    const {
      height,
      style,
      children,
      webOptions,
      webPaddingBottom,
      showsPagination,
      loop,
      currentPageIndicatorColor,
      pageIndicatorColor
    } = this.props;

    const _showsPagination =
      typeof showsPagination === 'undefined' ? true : showsPagination;
    const _children: any = children;

    return (
      <View style={style}>
        <div id={`web-swiper-${this.id}`}>
          <Swiper
            loop={loop}
            pagination={_showsPagination ? {
              el: `.swiper-pagination`,
              clickable: true
            } : {}}
            {...webOptions}
          >
            {React.Children.map(_children, (child, i) => {
              return (
                <div key={i} style={{ height }}>
                  {child}
                </div>
              );
            })}
          </Swiper>
        </div>
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
