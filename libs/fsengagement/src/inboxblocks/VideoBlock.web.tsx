import React, { useState } from 'react';

import type { FlexStyle, ViewStyle } from 'react-native';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import ReactPlayer from 'react-player';

import { cloneDeep } from 'lodash-es';

import { CardContext, EngagementContext } from '../lib/contexts';

export interface VideoSource {
  src: string;
  ratio?: number;
}

export interface VideoBlockProps {
  source: VideoSource;
  ratio?: number;
  autoPlay?: boolean;
  repeat?: boolean;
  resizeMode?: 'contain' | 'cover' | 'none' | 'stretch';
  style?: FlexStyle;
  muted?: boolean;
  fullscreen?: boolean;
  containerStyle?: ViewStyle;
  outerContainerStyle?: ViewStyle;
}

const styles = StyleSheet.create({
  VideoButton: {
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  VideoButtonWrapper: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  VideoButtonInner: {
    borderTopWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 18,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
    marginLeft: 3,
  },
});

const DEFAULT_WIDTH = Dimensions.get('window').width;

// eslint-disable-next-line max-statements
export const VideoBlock: React.FC<VideoBlockProps> = React.memo((props) => {
  const [isVideoPaused, setVideoPaused] = useState(false);
  const { isCard } = React.useContext(CardContext);
  const { windowWidth } = React.useContext(EngagementContext);
  const player: any | null = null;

  const { source, style = {}, containerStyle, outerContainerStyle } = props;

  if (!source) {
    return <View />;
  }
  const height = style.height || 200;
  const width = windowWidth || DEFAULT_WIDTH;

  const blockStyle = cloneDeep(style);
  blockStyle.width = width;

  const toggleVideo = () => {
    if (props.fullscreen) {
      player.presentFullscreenPlayer();
    } else {
      setVideoPaused(!isVideoPaused);
    }
  };

  const renderSocial = (src: string, type: string) => {
    const socialID = src.replace(`${type}://`, '');
    const iframeUri =
      type === 'youtube'
        ? `https://www.youtube.com/embed/${socialID}`
        : `https://www.facebook.com/video/embed?video_id=${socialID}`;

    return <WebView style={{ flex: 1 }} source={{ uri: iframeUri }} />;
  };

  const renderHttp = (src: string, { height, width }: any) => {
    const { autoPlay = false, muted = false, repeat = false } = props;

    return (
      <View>
        <ReactPlayer
          url={src}
          playing={autoPlay}
          loop={repeat}
          muted={muted}
          width="100%"
          height="100%"
        />

        {!isCard && (
          <TouchableOpacity onPress={toggleVideo} style={[styles.VideoButton, { width, height }]}>
            {isVideoPaused && (
              <View style={styles.VideoButtonWrapper}>
                <View style={styles.VideoButtonInner} />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderVideo = (src: string, size: any) => {
    if (src.includes('youtube://') || src.includes('facebook://')) {
      const type = src.includes('youtube://') ? 'youtube' : 'facebook';
      return renderSocial(src, type);
    } else if (src.includes('http://') || src.includes('https://')) {
      return renderHttp(src, size);
    }
    return false;
  };

  if (containerStyle) {
    if (containerStyle.paddingLeft !== undefined) {
      blockStyle.width -= Number(containerStyle.paddingLeft);
    }
    if (containerStyle.marginLeft !== undefined) {
      blockStyle.width -= Number(containerStyle.marginLeft);
    }
    if (containerStyle.paddingRight !== undefined) {
      blockStyle.width -= Number(containerStyle.paddingRight);
    }
    if (containerStyle.marginRight !== undefined) {
      blockStyle.width -= Number(containerStyle.marginRight);
    }
  }
  if (outerContainerStyle) {
    if (outerContainerStyle.paddingLeft !== undefined) {
      blockStyle.width -= Number(outerContainerStyle.paddingLeft);
    }
    if (outerContainerStyle.marginLeft !== undefined) {
      blockStyle.width -= Number(outerContainerStyle.marginLeft);
    }
    if (outerContainerStyle.paddingRight !== undefined) {
      blockStyle.width -= Number(outerContainerStyle.paddingRight);
    }
    if (outerContainerStyle.marginRight !== undefined) {
      blockStyle.width -= Number(outerContainerStyle.marginRight);
    }
  }

  blockStyle.height = typeof source.ratio === 'number' ? blockStyle.width / source.ratio : height;

  return (
    <View style={containerStyle}>
      <View style={blockStyle}>
        {height > 0
          ? renderVideo(source.src.replace(/ /g, '%20'), {
              width: blockStyle.width,
              height: blockStyle.height,
            })
          : null}
      </View>
    </View>
  );
});
