import React from 'react';
import {
  Image,
  ImageRequireSource,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { LinkCardGhost } from './LinkCardGhost';

const arrow: ImageRequireSource = require('../../../assets/images/ArrowWithStem.png');
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 41,
    paddingTop: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB'
  },
  image: {
    marginBottom: 10,
    width: 300,
    height: 130,
    resizeMode: 'contain'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 23,
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.5
  }
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

export interface LinkCardProps extends Omit<
  SerializableLinkCardProps,
  'imageStyle' |
  'titleStyle' |
  'subtitleStyle' |
  'style' |
  'arrowImageStyle'
> {
  imageStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  arrowImageStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
}

export const LinkCard: React.FunctionComponent<LinkCardProps> = React.memo(({
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
  onPress
}) => {
  if (loading) {
    return <LinkCardGhost style={styles.container} />;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, style]}
    >
      <Image
        source={image}
        style={[styles.image, imageStyle]}
      />
      <Text style={[styles.title, titleStyle]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, subtitleStyle]}>
        {subtitle}
        <Image
          source={arrowImage}
          style={arrowImageStyle}
        />
      </Text>
    </TouchableOpacity>
  );
});
