import React, { PureComponent } from 'react';

import type { AccessibilityRole, ScaledSize } from 'react-native';
import {
  Animated,
  Dimensions,
  NativeModules,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import type { AccessibilityComponentType } from '../types/Store';

import { Modal } from './Modal';

const styles = StyleSheet.create({
  animatedContent: {
    backgroundColor: 'white',
    bottom: -400,
    height: 400,
    position: 'absolute',
    width: '100%',
  },
  content: {
    flex: 1,
  },
});

interface ModalHalfScreenAnimationConfig {
  contentOffsetY: {
    inputRange: number[];
    outputRange: number[];
  };

  heightFromProps:
    | {
        height: number;
        top?: number;
        bottom?: number;
      }
    | {};
}

export enum ModalHalfScreenPosition {
  Top = 'top',
  Center = 'center',
  Bottom = 'bottom',
}

export interface ModalHalfScreenProps {
  visible?: boolean;
  height?: number;
  backgroundAccessibilityTraits?: AccessibilityRole;
  backgroundAccessibilityComponentType?: AccessibilityComponentType;
  backgroundAccessibilityLabel?: string;
  onRequestClose: () => void;
  position?:
    | ModalHalfScreenPosition.Bottom
    | ModalHalfScreenPosition.Center
    | ModalHalfScreenPosition.Top;
}

export interface ModalHalfScreenState {
  visible: boolean;
  contentOffset: Animated.Value;
  height: number;
  statusBarHeight: number;
}

export class ModalHalfScreen extends PureComponent<ModalHalfScreenProps, ModalHalfScreenState> {
  constructor(props: ModalHalfScreenProps) {
    super(props);
    this.state = {
      visible: false,
      contentOffset: new Animated.Value(0),
      height: props.height || 0,
      statusBarHeight: 0,
    };
  }

  private readonly dimensionsListener = (event: { window: ScaledSize; screen: ScaledSize }) => {
    const { height } = event.window;
    const halfWindowHeight = height / 2;

    if (halfWindowHeight !== this.state.height) {
      this.setState({ height: halfWindowHeight });
    }
  };

  private readonly showContent = () => {
    this.setState({ visible: true }, () => {
      // Open the drawer after we start the modal fade animation
      Animated.spring(this.state.contentOffset, {
        toValue: 1,
        useNativeDriver: false,
        bounciness: 0,
      }).start();
    });
  };

  private readonly hideContent = () => {
    // Close the drawer
    Animated.spring(this.state.contentOffset, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 0,
    }).start();

    // Start the modal fade animation slightly after the drawer starts closing
    setTimeout(() => {
      this.setState({ visible: false });
    }, 100);
  };

  private readonly renderBackground = () => (
    <TouchableWithoutFeedback
      accessibilityLabel={this.props.backgroundAccessibilityLabel || 'Close the modal!'}
      accessibilityRole={this.props.backgroundAccessibilityTraits || 'button'}
      onPress={this.props.onRequestClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />
    </TouchableWithoutFeedback>
  );

  private getAnimationConfig(): ModalHalfScreenAnimationConfig {
    const { height } = this.state;
    let outputRange: number[] = [0, 0 - height];
    let props = {};

    switch (this.props.position) {
      case ModalHalfScreenPosition.Top:
        outputRange = [0 - height, 0];
        props = { top: this.state.statusBarHeight };
        break;
      case ModalHalfScreenPosition.Center:
        outputRange = [0 - height, 0];
        props = { top: height / 2 };
        break;
      case ModalHalfScreenPosition.Bottom:
      default:
        outputRange = [0, 0 - height];
        props = { bottom: 0 - height };
        break;
    }

    return {
      contentOffsetY: {
        inputRange: [0, 1],
        outputRange,
      },
      heightFromProps: height
        ? {
            height,
            ...props,
          }
        : {},
    };
  }

  public componentDidMount(): void {
    if (this.props.visible) {
      this.showContent();
    }

    try {
      this.setState({
        height: this.props.height || Dimensions.get('window').height / 2,
      });

      Dimensions.addEventListener('change', this.dimensionsListener);

      const statusBarHeight = NativeModules.StatusBarManager.HEIGHT;
      if (statusBarHeight !== this.state.statusBarHeight) {
        this.setState({ statusBarHeight });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public componentWillUnmount(): void {
    Dimensions.removeEventListener('change', this.dimensionsListener);
  }

  public componentDidUpdate(
    prevProps: ModalHalfScreenProps,
    prevState: ModalHalfScreenState
  ): void {
    if (
      this.props.height &&
      this.props.height !== prevProps.height &&
      this.props.height !== prevState.height
    ) {
      this.setState({ height: this.props.height });
    }
    if (prevProps.visible && !this.props.visible) {
      this.hideContent();
    } else if (!prevProps.visible && this.props.visible) {
      this.showContent();
    }
  }

  public render(): JSX.Element {
    const config: ModalHalfScreenAnimationConfig = this.getAnimationConfig();
    const stylesForAnimation = [
      styles.animatedContent,
      config.heightFromProps,
      {
        transform: [
          {
            translateY: this.state.contentOffset.interpolate(config.contentOffsetY),
          },
        ],
      },
    ];

    return (
      <Modal
        animationType="fade"
        onRequestClose={this.props.onRequestClose}
        transparent
        visible={this.state.visible}
      >
        {this.renderBackground()}
        <Animated.View style={[styles.content, stylesForAnimation]}>
          {this.props.children}
        </Animated.View>
      </Modal>
    );
  }
}
