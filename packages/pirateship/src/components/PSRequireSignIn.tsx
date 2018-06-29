import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@brandingbrand/fscomponents';
import translate, { translationKeys } from '../lib/translations';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export interface PSRequireSignInProps {
  onSignInPress: () => void;
}

export default class PSRequireSignIn extends Component<PSRequireSignInProps> {
  render(): JSX.Element {
    return (
      <View style={styles.container}>
        <Button
          title={translate.string(translationKeys.account.actions.signIn.actionBtn)}
          onPress={this.props.onSignInPress}
        />
      </View>
    );
  }
}
