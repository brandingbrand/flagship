import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import WebView from 'react-native-webview';
import VideoPlayer, { VideoProperties } from 'react-native-video';
import * as _ from 'lodash-es';
import { CardContext } from '../lib/contexts';

export interface VideoSource {
  src: string;
  ratio?: number;
}
export interface VideoBlockProps {
  source: VideoSource;
  autoPlay?: boolean;
  repeat?: VideoProperties['repeat'];
  resizeMode?: VideoProperties['resizeMode'];
  style?: any;
  muted?: VideoProperties['muted'];
  fullscreen?: boolean;
  containerStyle?: any;
  outerContainerStyle?: any;
}

const styles = StyleSheet.create({
  VideoButton: {
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  VideoButtonWrapper: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    justifyContent: 'center',
    alignItems: 'center'
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
    marginLeft: 3
  }
});

const DEFAULT_WIDTH = Dimensions.get('window').width;

export const VideoBlock: React.FC<VideoBlockProps> = React.memo(props => {
  const [videoPaused, setVideoPaused] = useState(false);

  let player: any | null = null;

  const {
    source,
    style = {},
    containerStyle,
    outerContainerStyle
  } = props;

  if (!source) {
    return <View />;
  }
  const height = style.height || 200;
  const width = DEFAULT_WIDTH;

  const blockStyle = _.cloneDeep(style);
  blockStyle.width = width;

  const renderVideo = (src: string, size: any) => {
    if (~src.indexOf('youtube://') || ~src.indexOf('facebook://')) {
      const type = ~src.indexOf('youtube://') ? 'youtube' : 'facebook';
      return renderSocial(src, size, type);
    } else if (~src.indexOf('http://') || ~src.indexOf('https://')) {
      return renderHttp(src, size);
    }
    return false;
  }

  const renderSocial = (src: string, { width, height }: any, type: string) => {
    const socialID = src.replace(`${type}://`, '');
    const iframeUri = type === 'youtube' ?
      `https://www.youtube.com/embed/${socialID}` :
      `https://www.facebook.com/video/embed?video_id=${socialID}`;

    return <WebView style={{ flex: 1 }} source={{ uri: iframeUri }} />;
  }

  const checkAutoPlay = (autoPlay: boolean) => () => {
    setVideoPaused(!autoPlay)
  };

  const renderHttp = (src: string, { width, height }: any) => {
    const {
      resizeMode = 'cover',
      autoPlay = false,
      repeat = false,
      muted = false
    } = props;
    const { isCard } = React.useContext(CardContext);

    return (
      <View>
        <VideoPlayer
          resizeMode={resizeMode}
          ref={ref => {
            player = ref;
          }}
          repeat={repeat}
          muted={muted}
          onLoad={checkAutoPlay(autoPlay)}
          onFullscreenPlayerDidPresent={fullScreenPlayerDidPresent}
          onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
          source={{ uri: src }}
          paused={videoPaused}
          style={{ width, height }}
        />
        {!isCard && (
        <TouchableOpacity
          onPress={toggleVideo}
          style={[styles.VideoButton, { width, height }]}
        >
          {videoPaused && (
            <View style={styles.VideoButtonWrapper}>
              <View style={styles.VideoButtonInner} />
            </View>
          )}
        </TouchableOpacity>
        )}
      </View>
    );
  };

  const onFullscreenPlayerWillDismiss = () => {
    if (props.fullscreen) {
      setVideoPaused(true);
    }
  };
  const fullScreenPlayerDidPresent = () => {
    if (props.fullscreen) {
      setVideoPaused(false);
    }
  };
  const toggleVideo = () => {
    if (props.fullscreen) {
      player.presentFullscreenPlayer();
    } else {
      setVideoPaused(!videoPaused);
    }
  };

  // tslint:disable cyclomatic-complexity
  if (containerStyle) {
    if (containerStyle.paddingLeft) {
      blockStyle.width = blockStyle.width - +containerStyle.paddingLeft;
    }
    if (containerStyle.marginLeft) {
      blockStyle.width = blockStyle.width - +containerStyle.marginLeft;
    }
    if (containerStyle.paddingRight) {
      blockStyle.width = blockStyle.width - +containerStyle.paddingRight;
    }
    if (containerStyle.marginRight) {
      blockStyle.width = blockStyle.width - +containerStyle.marginRight;
    }
  }
  if (outerContainerStyle) {
    if (outerContainerStyle.paddingLeft) {
      blockStyle.width = blockStyle.width - outerContainerStyle.paddingLeft;
    }
    if (outerContainerStyle.marginLeft) {
      blockStyle.width = blockStyle.width - outerContainerStyle.marginLeft;
    }
    if (outerContainerStyle.paddingRight) {
      blockStyle.width = blockStyle.width - outerContainerStyle.paddingRight;
    }
    if (outerContainerStyle.marginRight) {
      blockStyle.width = blockStyle.width - outerContainerStyle.marginRight;
    }
  }

  if (source && source.ratio) {
    blockStyle.height = blockStyle.width / source.ratio;
  } else {
    blockStyle.height = height;
  }

  return (
    <View style={containerStyle}>
      <View style={blockStyle}>
      {height > 0 ? renderVideo(source.src.replace(/ /g, '%20'), {
        width: blockStyle.width,
        height: blockStyle.height
      }) : null}
      </View>
    </View>
  );
});
