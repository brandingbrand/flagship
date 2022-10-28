/* eslint-disable unicorn/filename-case -- Matches our naming scheme for components */
import React from 'react';

import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EngagementContext } from '../lib/contexts';

const styles = StyleSheet.create({
  default: {
    color: '#000',
  },
});

interface LocalizationData {
  value: string;
  language: string;
}
export interface DisplayNameMessageProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
  localization?: LocalizationData[];
  subtitle?: DisplayNameMessageProps;
  link?: string;
}

export const DisplayNameMessage: React.FC<DisplayNameMessageProps> = React.memo(
  ({ containerStyle, link, localization, subtitle, text, textStyle }) => {
    let displayText = text;

    const { displayName = '', handleAction, language } = React.useContext(EngagementContext);

    const filterLocalization = localization?.find((item) => item.language === language) ?? null;

    if (filterLocalization) {
      displayText = filterLocalization.value;
    }

    const displayNameText = displayText
      .replace('{{name}}', displayName)
      .replace('{{ name }}', displayName);

    const onPress = (actionLink: string) => () => {
      if (handleAction) {
        handleAction({
          type: 'deep-link',
          value: actionLink,
        });
      }
    };

    if (link !== undefined) {
      return (
        <TouchableOpacity activeOpacity={1} onPress={onPress(link)}>
          <View style={containerStyle}>
            <Text style={[styles.default, textStyle]}>{displayNameText}</Text>
            {subtitle !== undefined && (
              <View style={subtitle.containerStyle}>
                <Text style={[styles.default, subtitle.textStyle]}>{subtitle.text}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View style={containerStyle}>
        <Text style={[styles.default, textStyle]}>{displayNameText}</Text>
        {subtitle !== undefined && (
          <View style={subtitle.containerStyle}>
            <Text style={[styles.default, subtitle.textStyle]}>{subtitle.text}</Text>
          </View>
        )}
      </View>
    );
  }
);
/* eslint-enable unicorn/filename-case */
