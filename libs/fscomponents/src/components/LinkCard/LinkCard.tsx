import React from 'react';

import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import arrow from '../../../assets/images/ArrowWithStem.png';

import { LinkCardGhost } from './LinkCardGhost';

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#DBDBDB',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 41,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  image: {
    height: 130,
    marginBottom: 10,
    resizeMode: 'contain',
    width: 300,
  },
  subtitle: {
    fontSize: 15,
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 23,
  },
});

export interface SerializableLinkCardProps {
  loading?: boolean;
  image: ImageSourcePropType;
  imageStyle?: ImageStyle;
  title: string;
  titleStyle?: TextStyle;
  subtitle?: string;
  subtitleStyle?: TextStyle;
  style?: ViewStyle;
  arrowImage?: ImageSourcePropType;
  arrowImageStyle?: ImageStyle;
}

export interface LinkCardProps
  extends Omit<
    SerializableLinkCardProps,
    'arrowImageStyle' | 'imageStyle' | 'style' | 'subtitleStyle' | 'titleStyle'
  > {
  imageStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  arrowImageStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
}

export const LinkCard: React.FunctionComponent<LinkCardProps> = React.memo(
  ({
    loading,
    image,
    imageStyle,
    title,
    titleStyle,
    subtitle,
    subtitleStyle,
    style,
    arrowImage = arrow,
    arrowImageStyle,
    onPress,
  }) => {
    if (loading) {
      return <LinkCardGhost style={styles.container} />;
    }

    return (
      <TouchableOpacity disabled={!onPress} onPress={onPress} style={[styles.container, style]}>
        <Image source={image} style={[styles.image, imageStyle]} />
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>
          {subtitle}
          <Image source={arrowImage} style={arrowImageStyle} />
        </Text>
      </TouchableOpacity>
    );
  }
);
