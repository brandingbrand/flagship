import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import translate, { translationKeys } from '../lib/translations';

import PSButton from './PSButton';

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

const PSRequireSignIn: FunctionComponent<PSRequireSignInProps> = (props): JSX.Element => {
  return (
    <View style={styles.container}>
      <PSButton
        title={translate.string(translationKeys.account.actions.signIn.actionBtn)}
        onPress={props.onSignInPress}
      />
    </View>
  );
};

export default PSRequireSignIn;
