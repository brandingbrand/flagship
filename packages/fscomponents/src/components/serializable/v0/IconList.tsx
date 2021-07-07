import React, { useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { defaults } from 'lodash-es';

export interface IconListProps {
  list: string[];
  image?: ImageSourcePropType;
  imageStyle?: ImageStyle;
  rowStyle?: ViewStyle;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const defaultIconListProps: IconListProps = {
  list: [],
  imageStyle: {
    marginRight: 10
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  }
};

export const IconList = React.memo((props: IconListProps) => {
  const { style, list, image, rowStyle, imageStyle, textStyle } = useMemo(
    () => defaults({ ...props }, defaultIconListProps),
    [props]
  );

  return (
    <View style={style}>
      {list.map((text, index) => (
        <View key={index} style={rowStyle}>
          {image && <Image source={image} style={imageStyle} />}
          <Text key={index} {...props} style={textStyle}>
            {text}
          </Text>
        </View>
      ))}
    </View>
  );
});
