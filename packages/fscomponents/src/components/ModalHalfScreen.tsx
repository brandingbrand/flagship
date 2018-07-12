import React, { PureComponent } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Modal } from './Modal';

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  animatedContent: {
    height: 400,
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    bottom: -400
  }
});

export interface ModalHalfScreenProps {
  visible?: boolean;
  height?: number;
  onRequestClose: () => void;
}

export interface ModalHalfScreenState {
  visible: boolean;
  contentOffset: Animated.Value;
}

export class ModalHalfScreen extends PureComponent<ModalHalfScreenProps, ModalHalfScreenState> {
  constructor(props: ModalHalfScreenProps) {
    super(props);
    this.state = {
      visible: false,
      contentOffset: new Animated.Value(0)
    };
  }

  componentDidMount(): void {
    if (this.props.visible) {
      this.showContent();
    }
  }

  componentDidUpdate(prevProps: ModalHalfScreenProps): void {
    if (prevProps.visible && !this.props.visible) {
      this.hideContent();
    } else if (!prevProps.visible && this.props.visible) {
      this.showContent();
    }
  }

  showContent = () => {
    this.setState({ visible: true }, () => {
      // Open the drawer after we start the modal fade animation
      Animated.spring(this.state.contentOffset, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0
      }).start();
    });
  }

  hideContent = () => {
    // Close the drawer
    Animated.spring(this.state.contentOffset, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0
    }).start();

    // Start the modal fade animation slightly after the drawer starts closing
    setTimeout(() => {
      this.setState({ visible: false });
    }, 100);
  }

  renderBackground = () => {
    return (
      <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}
        />
      </TouchableWithoutFeedback>
    );
  }

  render(): JSX.Element {
    const contentOffsetY = this.state.contentOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.props.height ? 0 - this.props.height : -400]
    });
    const heightFromProps = this.props.height ? {
      height: this.props.height,
      bottom: 0 - this.props.height
    } : {};
    const stylesForAnimation = [
      styles.animatedContent,
      heightFromProps,
      {
        transform: [
          {
            translateY: contentOffsetY
          }
        ]
      }
    ];

    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        animationType={'fade'}
        onRequestClose={this.props.onRequestClose}
      >
        {this.renderBackground()}
        <Animated.View style={[styles.content, stylesForAnimation]}>
          {this.props.children}
        </Animated.View>
      </Modal>
    );
  }
}
