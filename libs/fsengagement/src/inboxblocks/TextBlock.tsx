import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
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
export interface TextBlockProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
  animateIndex?: number;
  localization?: LocalizationData[];
  subtitle?: TextBlockProps;
  link?: string;
}
export const TextBlock: React.FC<TextBlockProps> = React.memo(
  ({ textStyle, containerStyle, localization, link, subtitle, text, animateIndex }) => {
    let fadeInView: any;
    let displayText = text;
    const handleFadeInRef = (ref: any) => (fadeInView = ref);

    const { handleAction, language } = React.useContext(EngagementContext);

    const filterLocalization =
      (localization &&
        localization.find((item) => {
          return item.language === language;
        })) ||
      null;

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
            <Text style={[styles.default, textStyle]}>{displayText}</Text>
            {!!subtitle && (
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
        <Text style={[styles.default, textStyle]}>{displayText}</Text>
        {!!subtitle && (
          <View style={subtitle.containerStyle}>
            <Text style={[styles.default, subtitle.textStyle]}>{subtitle.text}</Text>
          </View>
        )}
      </View>
    );
  }
);
