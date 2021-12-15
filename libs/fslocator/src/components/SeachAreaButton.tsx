import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const S = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    width: 150,
  },
  buttonText: {
    textAlign: 'center',
  },
});

export interface PropType {
  searchArea: () => void;
  style: any;
}

export default class SeachAreaButton extends Component<PropType> {
  render(): JSX.Element {
    const { searchArea, style } = this.props;

    return (
      <View style={S.container}>
        <TouchableOpacity style={[S.button, style]} onPress={searchArea}>
          <Text style={S.buttonText}>
            {FSI18n.string(translationKeys.flagship.storeLocator.actions.searchArea.actionBtn)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
