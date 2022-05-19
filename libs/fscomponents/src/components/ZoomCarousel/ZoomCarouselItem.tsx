import React, { PureComponent } from 'react';

import type { PanResponderInstance, StyleProp, ViewStyle } from 'react-native';
import { Animated, Dimensions, PanResponder, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface ZoomCarouselItemProps {
  onItemMoveOutX: (dx: number) => void;
  onItemMoveOutY: (dy: number) => void;
  onZoomRelease: (didistanceDiffff: number) => void;
  onMoveRelease: (evt: unknown, gestureState: unknown, justMoveX: boolean) => void;
  style?: StyleProp<ViewStyle>;
}
export interface ZoomCarouselItemState {
  zoomImageSize: Animated.Value;
  zoomImagePosition: Animated.ValueXY;
}

export class ZoomCarouselItem extends PureComponent<ZoomCarouselItemProps, ZoomCarouselItemState> {
  constructor(props: ZoomCarouselItemProps) {
    super(props);

    this.initPanResponder();

    this.state = {
      zoomImageSize: new Animated.Value(SCREEN_WIDTH),
      zoomImagePosition: new Animated.ValueXY({ x: 0, y: 0 }),
    };
  }

  private initialZoomDistance?: number;
  private distanceDiff = 0;
  private isZooming = false;
  private justMoveX?: boolean;
  private panResponder: PanResponderInstance | null = null;

  private readonly initPanResponder = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,

      onPanResponderGrant: (evt, gestureState) => {
        this.initialZoomDistance = undefined;
        this.isZooming = false;
        this.justMoveX = undefined;
      },

      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.changedTouches.length > 1) {
          this.isZooming = true;
          const distanceX = Math.abs(
            (evt.nativeEvent.changedTouches[0]?.pageX ?? 0) -
              (evt.nativeEvent.changedTouches[1]?.pageX ?? 0)
          );
          const distanceY = Math.abs(
            (evt.nativeEvent.changedTouches[0]?.pageY ?? 0) -
              (evt.nativeEvent.changedTouches[1]?.pageY ?? 0)
          );
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          if (this.initialZoomDistance === undefined) {
            this.initialZoomDistance = distance;
          } else {
            this.distanceDiff = distance - this.initialZoomDistance;
            this.state.zoomImageSize.setValue(SCREEN_WIDTH + this.distanceDiff);
            this.state.zoomImagePosition.setValue({
              x: gestureState.dx * (SCREEN_WIDTH / (SCREEN_WIDTH + this.distanceDiff)),
              y: gestureState.dy * (SCREEN_WIDTH / (SCREEN_WIDTH + this.distanceDiff)),
            });
          }
        } else if (evt.nativeEvent.changedTouches.length === 1 && !this.isZooming) {
          if (this.justMoveX === undefined) {
            this.justMoveX = Math.abs(gestureState.dx) >= Math.abs(gestureState.dy);
          }

          if (this.justMoveX) {
            if (this.props.onItemMoveOutX) {
              this.props.onItemMoveOutX(gestureState.dx);
            }
          } else if (this.props.onItemMoveOutY) {
            this.props.onItemMoveOutY(gestureState.dy);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.isZooming) {
          Animated.parallel([
            Animated.spring(this.state.zoomImageSize, {
              toValue: SCREEN_WIDTH,
              useNativeDriver: false,
            }),
            Animated.spring(this.state.zoomImagePosition, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }),
          ]).start();
          this.props.onZoomRelease(this.distanceDiff);
        } else {
          this.props.onMoveRelease(evt, gestureState, this.justMoveX || false);
        }
      },
    });
  };

  public render(): JSX.Element {
    const { zoomImagePosition, zoomImageSize } = this.state;
    const zoomStyle = {
      transform: [
        {
          scale: zoomImageSize.interpolate({
            inputRange: [SCREEN_WIDTH, SCREEN_WIDTH * 2],
            outputRange: [1, 2],
          }),
        },
        {
          translateY: zoomImagePosition.y,
        },
        {
          translateX: zoomImagePosition.x,
        },
      ],
    };
    return (
      <View {...this.panResponder?.panHandlers} style={this.props.style}>
        <Animated.View style={zoomStyle}>{this.props.children}</Animated.View>
      </View>
    );
  }
}
