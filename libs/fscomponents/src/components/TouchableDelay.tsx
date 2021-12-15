import { Component } from 'react';
import { GestureResponderEvent, TouchableWithoutFeedbackProperties } from 'react-native';

export abstract class TouchableDelay<
  P extends TouchableWithoutFeedbackProperties
> extends Component<P> {
  handleOnPress = (event: GestureResponderEvent): void => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(event);
    }
  };
}
