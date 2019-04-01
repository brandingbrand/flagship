import React, { FunctionComponent } from 'react';
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
  children?: any;
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

const PSHalfModal: FunctionComponent<PSHalfModalProps> = (props): JSX.Element => {
  return (
    <ModalHalfScreen onRequestClose={props.onClose} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{props.title}</Text>
          {props.renderLeftItem && (
            <View style={styles.leftItem}>
              {props.renderLeftItem()}
            </View>
          )}
          {props.renderRightItem && (
            <View style={styles.rightItem}>
              {props.renderRightItem()}
            </View>
          )}
        </View>
        {props.children}
      </View>
    </ModalHalfScreen>
  );
};

export default PSHalfModal;
