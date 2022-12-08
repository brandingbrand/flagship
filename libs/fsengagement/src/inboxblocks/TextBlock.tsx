import React, { useEffect, useMemo } from 'react';

import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { EngagementContext } from '../lib/contexts';

import type { TextBelowImage } from './ImageWithOverlay';

const styles = StyleSheet.create({
  default: {
    color: '#000',
  },
});

interface LocalizationData {
  value: string;
  language: string;
}
export interface TextBlockProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
  animateIndex?: number;
  textBelowImage?: TextBelowImage;
  localization?: LocalizationData[];
  subtitle?: TextBlockProps;
  link?: string;
}
export const TextBlock: React.FC<TextBlockProps> = React.memo(
  ({ animateIndex, containerStyle, link, localization, subtitle, text, textStyle }) => {
    let fadeInView: any;
    let displayText = text;
    const handleFadeInRef = (ref: any) => (fadeInView = ref);

    const { dynamicData = {}, handleAction, language } = React.useContext(EngagementContext);

    const filterLocalization =
      (localization && localization.find((item) => item.language === language)) || null;

    if (filterLocalization) {
      displayText = filterLocalization.value;
    }

    useEffect(() => {
      if (animateIndex && animateIndex <= 3) {
        fadeInView.transition({ opacity: 0 }, { opacity: 1 }, 400, 'ease-out');
      }
    }, [animateIndex]);

    const onPress = (link: string) => () => {
      if (handleAction) {
        handleAction({
          type: 'deep-link',
          value: link,
        });
      }
    };

    const reBraces = new RegExp(/[{}]/, 'g');

    const dynamicDisplayText: string = useMemo(
      () =>
        displayText.replace(/{{([^}]*)}}/g, (matched) => {
          const matchText = matched.replace(reBraces, '');
          return dynamicData[matchText] !== undefined && typeof dynamicData[matchText] === 'string'
            ? dynamicData[matchText]
            : '';
        }),
      [displayText, dynamicData]
    );

    const dynamicSubtitleText: string = useMemo(() => {
      if (!subtitle) {
        return '';
      }
      return subtitle.text.replace(/{{([^}]*)}}/g, (matched) => {
        const matchText = matched.replace(reBraces, '');
        return dynamicData[matchText] !== undefined && typeof dynamicData[matchText] === 'string'
          ? dynamicData[matchText]
          : '';
      });
    }, [subtitle, dynamicData]);

    if (animateIndex && animateIndex <= 3) {
      return (
        <View style={containerStyle}>
          <Animatable.Text
            style={[styles.default, textStyle]}
            ref={handleFadeInRef}
            useNativeDriver
            delay={250}
          >
            {displayText}
          </Animatable.Text>
        </View>
      );
    }
    if (link) {
      return (
        <TouchableOpacity activeOpacity={1} onPress={onPress(link)}>
          <View style={containerStyle}>
            <Text style={[styles.default, textStyle]}>{dynamicDisplayText}</Text>
            {subtitle !== undefined && (
              <View style={subtitle.containerStyle}>
                <Text style={[styles.default, subtitle.textStyle]}>{dynamicSubtitleText}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View style={[containerStyle, { borderRadius: 22 }]}>
        <Text style={[styles.default, textStyle]}>{dynamicDisplayText}</Text>
        {subtitle !== undefined && (
          <View style={subtitle.containerStyle}>
            <Text style={[styles.default, subtitle.textStyle]}>{dynamicSubtitleText}</Text>
          </View>
        )}
      </View>
    );
  }
);
