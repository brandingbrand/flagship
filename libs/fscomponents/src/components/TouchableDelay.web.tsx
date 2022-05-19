import { Component } from 'react';

import type { GestureResponderEvent, TouchableWithoutFeedbackProperties } from 'react-native';

const kOnPressDelayMS = 200; // Delay before sending an onPress event to wait for scroll

export abstract class TouchableDelay<
  P extends TouchableWithoutFeedbackProperties
> extends Component<P> {
  private onPressDelayTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly handleScroll = (event: Event) => {
    if (this.onPressDelayTimer) {
      clearTimeout(this.onPressDelayTimer);
      this.onPressDelayTimer = null;

      window.removeEventListener('scroll', this.handleScroll);
    }
  };

  protected readonly handleOnPress = (event: GestureResponderEvent): void => {
    const { onPress } = this.props;

    if (onPress) {
      if (!this.onPressDelayTimer) {
        window.addEventListener('scroll', this.handleScroll);

        this.onPressDelayTimer = setTimeout(() => {
          this.onPressDelayTimer = null;
          window.removeEventListener('scroll', this.handleScroll);

          onPress(event);
        }, kOnPressDelayMS);
      }

      // Prevent the default href from propagating
      event.preventDefault();
    }
  };

  public componentWillUnmount(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
