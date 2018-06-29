import React, { Component } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle
} from 'react-native';
import { color, fontSize, grays } from '../styles/variables';

const arrowImg = require('../../assets/images/arrow.png');

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: color.lightGray
  },
  arrow: {
    width: 15,
    height: 15,
    transform: [{ rotate: '180deg' }]
  },
  title: {
    fontSize: fontSize.base,
    color: color.darkGray
  }
});

export interface PSRowProps {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  showImage?: boolean;
  renderImage?: () => JSX.Element;
}

export default class PSRow extends Component<PSRowProps> {
  renderImage(): JSX.Element {
    if (this.props.renderImage) {
      return this.props.renderImage();
    }

    return (
      <Image source={arrowImg} style={styles.arrow} resizeMode='contain' />
    );
  }

  render(): JSX.Element {
    const { onPress, showImage, style, textStyle, title } = this.props;

    return (
      <TouchableHighlight onPress={onPress} underlayColor={grays.one}>
        <View style={[styles.container, style]}>
          <Text style={[styles.title, textStyle]}>{title}</Text>
          {showImage && this.renderImage()}
        </View>
      </TouchableHighlight>
    );
  }
}
