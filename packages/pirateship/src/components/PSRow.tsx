import React, { FunctionComponent } from 'react';
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
import { border, fontSize, palette } from '../styles/variables';

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
    borderBottomWidth: border.width,
    borderBottomColor: border.color
  },
  arrow: {
    width: 15,
    height: 15,
    transform: [{ rotate: '180deg' }]
  },
  title: {
    fontSize: fontSize.base,
    color: palette.onBackground
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

const PSRow: FunctionComponent<PSRowProps> = (props): JSX.Element => {
  const renderImage = (): JSX.Element => {
    if (props.renderImage) {
      return props.renderImage();
    }

    return (
      <Image source={arrowImg} style={styles.arrow} resizeMode='contain' />
    );
  };

  const { onPress, showImage, style, textStyle, title } = props;

  return (
    <TouchableHighlight onPress={onPress} underlayColor={palette.surface}>
      <View style={[styles.container, style]}>
        <Text style={[styles.title, textStyle]}>{title}</Text>
        {showImage && renderImage()}
      </View>
    </TouchableHighlight>
  );
};

export default PSRow;
