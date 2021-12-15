import React, { Component } from 'react';
import { Animated, View } from 'react-native';

export interface StateType {
  scale: Animated.Value;
}

export default class CurrentLocationPin extends Component<any, StateType> {
  constructor(props: any) {
    super(props);
    this.state = {
      scale: new Animated.Value(1),
    };
  }

  componentDidMount(): void {
    this.startAnimation();
  }

  startAnimation(): void {
    Animated.timing(this.state.scale, {
      toValue: 2.5,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      this.state.scale.setValue(1);
      this.startAnimation();
    });
  }

  render(): JSX.Element {
    const { scale } = this.state;
    const opacity = scale.interpolate({
      inputRange: [1, 2.5],
      outputRange: [0.6, 0],
    });

    return (
      <View>
        <Animated.View
          style={{
            backgroundColor: '#08c',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 14,
            height: 14,
            borderRadius: 7,
            opacity,
            transform: [{ scale }],
          }}
        />
        <View
          style={{
            width: 14,
            height: 14,
            backgroundColor: '#08c',
            borderRadius: 7,
            borderWidth: 2,
            borderColor: 'white',
          }}
        />
      </View>
    );
  }
}
