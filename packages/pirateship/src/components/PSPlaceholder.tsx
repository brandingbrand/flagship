import React, { Component } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { border, palette } from '../styles/variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(0,122,255)',
    marginBottom: 10
  },
  inner: {
    borderWidth: 1,
    borderColor: 'white',
    height: 100,
    padding: 10,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  text: {
    color: palette.onSurface
  },
  containerLight: { backgroundColor: palette.background },
  innerLight: { borderColor: border.color },
  textLight: { color: palette.onBackground },
  containerDark: { backgroundColor: palette.surface },
  innerDark: { borderColor: border.color },
  textDark: { color: palette.onSurface }
});

export interface PSPlaceholderProps {
  style?: StyleProp<ViewStyle>;
  type?: 'light' | 'dark';
}

export default class PSPlaceholder extends Component<PSPlaceholderProps> {
  render(): JSX.Element {
    let containerStyle: any = styles.container;
    let innerStyle: any = styles.inner;
    let textStyle: any = styles.text;

    if (this.props.type === 'light') {
      containerStyle = [styles.container, styles.containerLight];
      innerStyle = [styles.inner, styles.innerLight];
      textStyle = [styles.text, styles.textLight];
    }
    if (this.props.type === 'dark') {
      containerStyle = [styles.container, styles.containerDark];
      innerStyle = [styles.inner, styles.innerDark];
      textStyle = [styles.text, styles.textDark];
    }

    return (
      <View style={[containerStyle, this.props.style]}>
        <View style={innerStyle}>
          <Text style={textStyle}>
            {/* tslint:disable-next-line:jsx-use-translation-function - Only used in dev */}
            {this.props.children || 'Component name'} Placeholder
          </Text>
        </View>
      </View>
    );
  }
}
