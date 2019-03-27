import React, { FunctionComponent } from 'react';
import {
  Image,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';

import PSButton from './PSButton';
import GlobalStyle from '../styles/Global';
import translate, { translationKeys } from '../lib/translations';

const kSpaceBetween = 'space-between';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: kSpaceBetween,
    alignItems: 'center'
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: kSpaceBetween,
    alignItems: 'center'
  },
  profilePic: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 15
  }
});

export interface PSWelcomeProps {
  style?: StyleProp<ViewStyle>;
  isLoggedIn?: boolean;
  logo?: ImageURISource;
  userName?: string;
  onSignInPress: () => void;
  onSignOutPress: () => void;
}

const PSWelcome: FunctionComponent<PSWelcomeProps> = (props): JSX.Element => {

  const message =
    props.isLoggedIn && props.userName
      ? `Hi, ${props.userName}!`
      : 'Welcome!';

  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.profileInfo]}>
        {props.logo && (
          <Image source={props.logo} style={styles.profilePic} />
        )}
        <Text style={GlobalStyle.h1}>{message}</Text>
      </View>

      {props.isLoggedIn ? (
        <PSButton
          link
          title={translate.string(translationKeys.account.actions.signOut.actionBtn)}
          onPress={props.onSignOutPress}
        />
      ) : (
        <PSButton
          link
          title={translate.string(translationKeys.account.actions.signIn.actionBtn)}
          onPress={props.onSignInPress}
        />
      )}
    </View>
  );
};

export default PSWelcome;
