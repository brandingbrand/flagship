import type { RefObject } from 'react';
import React, { PureComponent } from 'react';

import type { ViewProps } from 'react-native';
import { Animated, View } from 'react-native';

import type { FadeInImageProps } from './FadeInImageProps';

export interface FadeInImageState {
  opacity: Animated.Value;
}

export class FadeInImage extends PureComponent<FadeInImageProps, FadeInImageState> {
  constructor(props: FadeInImageProps) {
    super(props);

    this.view = React.createRef<View>();

    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  private readonly view: RefObject<View>;

  /**
   * Invoked after the image finishes loading to animate the image from transparent to opaque.
   */
  private readonly onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  // to make this component be able to use with TouchableHighlight
  // TODO: Figure out if this funciton is really needed
  protected setNativeProps = (props: ViewProps) => {
    if (this.view.current) {
      this.view.current.setNativeProps(props);
    }
  };

  public render(): JSX.Element {
    const { resizeMethod = 'resize', resizeMode = 'contain', source, style } = this.props;

    return (
      <View ref={this.view}>
        <Animated.Image
          onLoad={this.onLoad}
          resizeMethod={resizeMethod}
          resizeMode={resizeMode}
          source={source}
          style={[{ opacity: this.state.opacity }, style]}
        />
      </View>
    );
  }
}
