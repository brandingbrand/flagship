import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { ModalHalfScreen } from '@brandingbrand/fscomponents';

import { border, fontSize } from '../styles/variables';

export interface PSHalfModalProps {
  title: string;
  onClose: () => void;
  visible: boolean;

  renderLeftItem?: () => JSX.Element;
  renderRightItem?: () => JSX.Element;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    justifyContent: 'center',
    height: 50,
    borderBottomWidth: border.width,
    borderBottomColor: border.color
  },
  leftItem: {
    position: 'absolute',
    height: 50,
    justifyContent: 'center',
    left: 15
  },
  title: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  rightItem: {
    position: 'absolute',
    height: 50,
    justifyContent: 'center',
    right: 15
  }
});

export default class PSHalfModal extends Component<PSHalfModalProps> {
  render(): JSX.Element {
    return (
      <ModalHalfScreen onRequestClose={this.props.onClose} visible={this.props.visible}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{this.props.title}</Text>
            {this.props.renderLeftItem && (
              <View style={styles.leftItem}>
                {this.props.renderLeftItem()}
              </View>
            )}
            {this.props.renderRightItem && (
              <View style={styles.rightItem}>
                {this.props.renderRightItem()}
              </View>
            )}
          </View>
          {this.props.children}
        </View>
      </ModalHalfScreen>
    );
  }
}
