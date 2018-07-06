import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import PSButton from '../components/PSButton';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarNone } from '../styles/Navigation';
import PushNotifications from '../lib/PushNotifications';
import { fontSize, palette } from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

export interface PushOptInProps extends ScreenProps {
  onPushEnabled: () => void;
  onDismiss: () => void;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
    backgroundColor: palette.surface
  },
  image: {
    marginBottom: 26
  },
  header: {
    fontSize: 35,
    marginBottom: 6
  },
  description: {
    fontSize: fontSize.base,
    textAlign: 'center',
    marginBottom: 26,
    lineHeight: 20
  },
  primaryButton: {
    borderRadius: 3,
    width: '90%',
    marginBottom: 15
  },
  primaryButtonTitle: {
    fontWeight: 'bold'
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    borderRadius: 3,
    width: '90%'
  },
  secondaryButtonText: {
    color: 'black',
    fontWeight: 'bold'
  },
  continueText: {
    color: palette.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 26
  },
  pageDots: {
    position: 'absolute',
    bottom: 20
  }
});

export default class PushOptIn extends Component<PushOptInProps> {
  static navigatorStyle: NavigatorStyle = navBarNone;

  enableNotifications = () => {
    PushNotifications.init(this.onPushEnabled);
  }

  onPushEnabled = () => {
    this.props.onPushEnabled();
  }

  onDismiss = () => {
    this.props.onDismiss();
  }

  render(): JSX.Element {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          {translate.string(translationKeys.screens.pushOptIn.header)}
        </Text>
        <Text style={styles.description}>
          {translate.string(translationKeys.screens.pushOptIn.description)}
        </Text>
        <PSButton
          title={translate.string(translationKeys.screens.pushOptIn.actions.optIn.confirmBtn)}
          onPress={this.enableNotifications}
          style={styles.primaryButton}
          titleStyle={styles.primaryButtonTitle}
        />
        <TouchableOpacity onPress={this.onDismiss}>
          <Text style={styles.continueText}>
            {translate.string(translationKeys.screens.pushOptIn.actions.optIn.cancelBtn)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
