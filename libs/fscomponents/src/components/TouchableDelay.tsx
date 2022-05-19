import { Component } from 'react';

import type { GestureResponderEvent, TouchableWithoutFeedbackProperties } from 'react-native';

export abstract class TouchableDelay<
  P extends TouchableWithoutFeedbackProperties
> extends Component<P> {
  protected readonly handleOnPress = (event: GestureResponderEvent): void => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(event);
    }
  };
}
