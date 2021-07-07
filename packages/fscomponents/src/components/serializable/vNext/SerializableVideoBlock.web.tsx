import type {
  SerializableVideoBlockProps,
  VideoProgressStateWeb
} from './SerializableVideoBlock.types';

import React from 'react';
import { View } from 'react-native';
import ReactPlayer from 'react-player';

export const SerializableVideoBlock = React.memo<SerializableVideoBlockProps>(props => {
  const { source, autoPlay, repeat, resizeMode, style, fullscreen, ...restProps } = props;

  const onProgress = (state: VideoProgressStateWeb) => {
    if (props.onProgress) {
      props.onProgress(state);
    }
  };

  return (
    <View style={style}>
      <ReactPlayer
        url={source.uri}
        playing={autoPlay}
        loop={repeat}
        width='100%'
        height='100%'
        onError={props.onError}
        onProgress={onProgress}
        onSeek={props.onSeek}
        {...restProps}
      />
    </View>
  );
});
