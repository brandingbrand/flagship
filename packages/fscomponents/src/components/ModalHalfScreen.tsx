import React, { PureComponent } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import {
  Animated,
  Dimensions,
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

export enum VerticalPosition {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom'
}
export interface ModalHalfScreenProps {
  visible?: boolean;
  height?: number;
  onRequestClose: () => void;
  verticalPosition?: VerticalPosition;
}

export interface ModalHalfScreenState {
  visible: boolean;
  contentOffset: Animated.Value;
  calculatedPosition: number;
  modalHeight: number;
}

export class ModalHalfScreen extends PureComponent<ModalHalfScreenProps, ModalHalfScreenState> {
  constructor(props: ModalHalfScreenProps) {
    super(props);
    this.state = {
      visible: false,
      contentOffset: new Animated.Value(0),
      calculatedPosition: 0 - Dimensions.get('window').height / 2 , // default bottom
      modalHeight: props.height || Dimensions.get('window').height / 2
    };

  }

  componentDidMount(): void {
    this.setState({
      calculatedPosition: this.calculatePosition(Dimensions.get('window').height)
    });

    Dimensions.addEventListener('change', this.onDimensionsChange);

    if (this.props.visible) {
      this.showContent();
    }
  }

  calculatePosition = (screenHeight: number): number => {
    let calculatedPosition;
    const modalHeight = this.props.height || screenHeight / 2;

    switch (this.props.verticalPosition) {
      case VerticalPosition.Top:
        calculatedPosition = 0 - getStatusBarHeight(true);
        break;
      case VerticalPosition.Middle:
        calculatedPosition = 0 - (screenHeight - modalHeight * 1.5);
        break;
      case VerticalPosition.Bottom:
        calculatedPosition = 0 - modalHeight;
        break;
      default:
        calculatedPosition = 0 - modalHeight;
    }
    return calculatedPosition;
  }

  onDimensionsChange = (dimensions: { window: any; screen: any }): void => {
    const screenHeight = dimensions.window.height;
    this.setState({
      calculatedPosition: this.calculatePosition(screenHeight),
      modalHeight: screenHeight / 2
    });
  }

  componentDidUpdate(prevProps: ModalHalfScreenProps): void {
    if (prevProps.visible && !this.props.visible) {
      this.hideContent();
    } else if (!prevProps.visible && this.props.visible) {
      this.showContent();
    }
  }

  componentWillUnmount(): void {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
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
      outputRange: [0, this.props.height ? 0 - this.props.height : 0 - this.state.modalHeight]
    });
    const heightFromProps = this.props.height ? {
      height: this.props.height,
      bottom: 0 - this.props.height
    } : {};
    const stylesForAnimation = [
      styles.animatedContent,
      {bottom: this.state.calculatedPosition},
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
