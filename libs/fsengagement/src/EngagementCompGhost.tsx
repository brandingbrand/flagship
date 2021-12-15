import React from 'react';
import ContentLoader, { Rect } from './lib/RNContentLoader';
import { StyleProp, View, ViewStyle } from 'react-native';

export interface SerializableEngagementCompGhostProps {
  style?: ViewStyle;
  height?: number | string;
  backgroundColor?: string;
  foregroundColor?: string;
}


export interface EngagementCompGhostProps extends Omit<
  SerializableEngagementCompGhostProps,
  'style'
> {
  style?: StyleProp<ViewStyle>;
}

export const EngagementCompGhost: React.FC<EngagementCompGhostProps> = React.memo(({
  style,
  height = 839,
  backgroundColor = '#EFEFEF',
  foregroundColor = '#F9F9F9'
}) => {
  const image1 = {
    width: 335,
    height: 366,
    x: 0,
    y: 0
  };
  const line1 = {
    width: 335,
    height: 23,
    x: 0,
    y: image1.y + image1.height + 10
  };
  const line2 = {
    width: 142,
    height: 23,
    x: 0,
    y: line1.y + line1.height + 7
  };
  const image2 = {
    width: 335,
    height: 366,
    x: 0,
    y: line2.y + line2.height + 37
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
        <Rect rx='4' ry='4' {...image1} />
        <Rect rx='4' ry='4' {...line1} />
        <Rect rx='4' ry='4' {...line2} />
        <Rect rx='4' ry='4' {...image2} />
      </ContentLoader>
    </View>
  );
});
