import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { Modal } from '@brandingbrand/fscomponents';

import * as variables from '../styles/variables';

const icons = {
  back: require('../../assets/images/arrow.png')
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer: {
    borderBottomWidth: variables.border.width,
    borderBottomColor: variables.border.color,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30
  },
  headerIcon: {
    marginLeft: 15,
    width: 30
  },
  headerTextContainer: {
    flexGrow: 1,
    alignItems: 'center'
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
    marginLeft: -45
  }
});

export interface PSModalProps {
  visible: boolean;
  content: JSX.Element;
  onClose: () => void;
  title?: string;
  style?: any;

  fullscreen?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
  backdropPress?: () => void;
}

export default class PSModal extends Component<PSModalProps> {
  static defaultProps: Partial<PSModalProps> = {
    visible: false,
    fullscreen: true,
    backdropColor: 'black',
    backdropOpacity: 0.7
  };

  backdropPress = () => {
    if (this.props.backdropPress) {
      this.props.backdropPress();
    }
  }

  render(): JSX.Element {
    const {
      backdropColor,
      backdropOpacity,
      content,
      fullscreen,
      visible,
      onClose,
      style,
      title
    } = this.props;

    const { width, height } = Dimensions.get('window');

    const contentStyle = [
      { margin: variables.padding.base },
      !fullscreen ? styles.content : null,
      style
    ];

    return (
      <Modal
        transparent={!fullscreen}
        visible={visible}
        onRequestClose={onClose}
        animationType='fade'
      >
        {!fullscreen && (
          <TouchableWithoutFeedback onPress={this.backdropPress}>
            <View
              style={[
                styles.backdrop,
                {
                  backgroundColor: backdropColor,
                  opacity: backdropOpacity,
                  width,
                  height
                }
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {fullscreen && (
          <View style={styles.headerContainer}>
            <View>
              <TouchableOpacity onPress={onClose} >
                <Image source={icons.back} style={styles.headerIcon} />
              </TouchableOpacity>
            </View>
            {title && (
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>{title}</Text>
              </View>
            )}
          </View>
        )}

        <View
          pointerEvents='box-none'
          style={contentStyle}
        >
          {content}
        </View>
      </Modal>
    );
  }
}
