import React from 'react';
import ContentLoader, { Rect } from '../../lib/RNContentLoader';
import { StyleProp, View, ViewStyle } from 'react-native';

export interface SerializableLinkCardGhostProps {
  style?: ViewStyle;
  height?: number | string;
  backgroundColor?: string;
  foregroundColor?: string;
}

export interface LinkCardGhostProps extends Omit<
  SerializableLinkCardGhostProps,
  'style'
> {
  style?: StyleProp<ViewStyle>;
}

export const LinkCardGhost: React.FC<LinkCardGhostProps> = React.memo(({
  style,
  height = 192,
  backgroundColor = '#EFEFEF',
  foregroundColor = '#F9F9F9'
}) => {
  const title = {
    width: 335,
    height: 133,
    x: 0,
    y: 0
  };
  const line1 = {
    width: 335,
    height: 23,
    x: 0,
    y: title.y + title.height + 6
  };
  const line2 = {
    width: 142,
    height: 23,
    x: 0,
    y: line1.y + line1.height + 7
  };

  return (
    <View style={style}>
      <ContentLoader
        width={'100%'}
        height={height}
        viewBox={`0 0 335 ${height}`}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
      >
        <Rect rx='4' ry='4' {...title} />
        <Rect rx='4' ry='4' {...line1} />
        <Rect rx='4' ry='4' {...line2} />
      </ContentLoader>
    </View>
  );
});
