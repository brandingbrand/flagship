import React, { PureComponent, RefObject } from 'react';
import {Animated, ImageStyle, StyleProp, View, ViewProps} from 'react-native';
import { FadeInImageProps } from './FadeInImageProps';

export interface FadeInImageState {
  opacity: Animated.Value;
}

export interface SerializableFadeInImageProps {
  style?: ImageStyle;
}

export interface FadeInProps extends FadeInImageProps, Omit<SerializableFadeInImageProps, 'style'> {
  style?: StyleProp<ImageStyle>;
}

export class FadeInImage extends PureComponent<FadeInProps, FadeInImageState> {
  private view: RefObject<View>;

  constructor(props: FadeInImageProps) {
    super(props);

    this.view = React.createRef<View>();

    this.state = {
      opacity: new Animated.Value(0)
    };
  }

  render(): JSX.Element {
    const {
      style,
      resizeMode = 'contain',
      resizeMethod = 'resize',
      source
    } = this.props;

    return (
      <View ref={this.view}>
        <Animated.Image
          source={source}
          style={[{ opacity: this.state.opacity }, style]}
          resizeMode={resizeMode}
          resizeMethod={resizeMethod}
          onLoad={this.onLoad}
        />
      </View>
    );
  }

  // to make this component be able to use with TouchableHighlight
  // TODO: Figure out if this funciton is really needed
  protected setNativeProps = (props: ViewProps) => {
    if (this.view.current) {
      this.view.current.setNativeProps(props);
    }
  }

  /**
   * Invoked after the image finishes loading to animate the image from transparent to opaque.
   */
  private onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    }).start();
  }
}
