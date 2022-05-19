import React, { Component } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    padding: 10,
    width: 150,
  },
  buttonText: {
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
  },
});

export interface PropType {
  searchArea: () => void;
  style: StyleProp<ViewStyle>;
}

export default class SeachAreaButton extends Component<PropType> {
  public render(): JSX.Element {
    const { searchArea, style } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={searchArea} style={[styles.button, style]}>
          <Text style={styles.buttonText}>
            {FSI18n.string(translationKeys.flagship.storeLocator.actions.searchArea.actionBtn)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
