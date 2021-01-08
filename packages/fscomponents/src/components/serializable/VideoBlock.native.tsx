import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import WebView from 'react-native-webview';
import VideoPlayer, { VideoProperties } from 'react-native-video';
import { ReactPlayerProps } from 'react-player';
import { VideoProgressStateWeb } from './VideoBlock.web';
import { cloneDeep } from 'lodash-es';

export interface VideoProgressStateNative {
  currentTime: number;
  playableDuration: number;
  seekableDuration: number;
}

export interface VideoSource {
  uri: string;
  ratio?: number;
}

export interface VideoBlockProps extends ReactPlayerProps,
  Omit<VideoProperties, 'style' | 'onBuffer'> {
  source: VideoSource;
  autoPlay?: boolean;
  repeat?: boolean;
  resizeMode?: 'stretch' | 'contain' | 'cover' | 'none';
  style?: ViewStyle | ViewStyle[];
  muted?: boolean;
  fullscreen?: boolean;
  onError?: (error: any, data?: any, hlsInstance?: any, hlsGlobal?: any) => void;
  onSeek?: (data?: any) => void;
  onProgress?: (data: VideoProgressStateNative | VideoProgressStateWeb) =>
    void;
}

export interface StateType {
  videoPaused: boolean;
  facebookSrc: string;
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

export default class VideoBlock extends Component<VideoBlockProps, StateType> {
  player: any | null = null;
  constructor(props: any) {
    super(props);
    this.state = {
      videoPaused: false,
      facebookSrc: ''
    };
  }

  renderVideo = (src: string, size: any) => {
    if (~src.indexOf('youtube://') || ~src.indexOf('facebook://')) {
      const type = ~src.indexOf('youtube://') ? 'youtube' : 'facebook';
      return this.renderSocial(src, size, type);
    } else if (~src.indexOf('http://') || ~src.indexOf('https://')) {
      return this.renderHttp(src, size);
    }
    return false;
  }

  renderSocial = (src: string, { width, height }: any, type: string) => {
    const socialID = src.replace(`${type}://`, '');
    const iframeUri = type === 'youtube' ?
      `https://www.youtube.com/embed/${socialID}` :
      `https://www.facebook.com/video/embed?video_id=${socialID}`;

    return <WebView style={{ flex: 1 }} source={{ uri: iframeUri }} />;
  }

  checkAutoPlay = (autoPlay: boolean) => () => {
    this.setState({ videoPaused: !autoPlay });
  }

  renderHttp = (src: string, { width, height }: any) => {
    const {
      resizeMode = 'cover',
      autoPlay = false,
      repeat = false,
      muted = false
    } = this.props;

    return (
      <View>
        <VideoPlayer
          resizeMode={resizeMode}
          ref={ref => {
            this.player = ref;
          }}
          repeat={repeat}
          muted={muted}
          onLoad={this.checkAutoPlay(autoPlay)}
          onFullscreenPlayerDidPresent={this.fullScreenPlayerDidPresent}
          onFullscreenPlayerWillDismiss={this.onFullscreenPlayerWillDismiss}
          source={{ uri: src }}
          paused={this.state.videoPaused}
          style={{ width, height }}
          onError={this.props.onError}
          onProgress={this.props.onProgress}
          onSeek={this.props.onSeek}
        />
        <TouchableOpacity
          onPress={this.toggleVideo}
          style={[styles.VideoButton, { width, height }]}
        >
          {this.state.videoPaused && (
            <View style={styles.VideoButtonWrapper}>
              <View style={styles.VideoButtonInner} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }
  onFullscreenPlayerWillDismiss = () => {
    if (this.props.fullscreen) {
      this.setState({
        videoPaused: true
      });
    }
  }
  fullScreenPlayerDidPresent = () => {
    if (this.props.fullscreen) {
      this.setState({
        videoPaused: false
      });
    }
  }
  toggleVideo = () => {
    if (this.props.fullscreen) {
      this.player.presentFullscreenPlayer();
    } else {
      this.setState({
        videoPaused: !this.state.videoPaused
      });
    }
  }

  render(): JSX.Element {
    const {
      source,
      ratio,
      style = {}
    } = this.props;

    const flattenedStyle = Array.isArray(style) ? StyleSheet.flatten(style) : style;

    let height = flattenedStyle.height || 200;
    const width = DEFAULT_WIDTH;

    if (ratio) {
      height = width / ratio;
    }

    const blockStyle = cloneDeep(flattenedStyle);
    blockStyle.height = height;
    blockStyle.width = width;

    return (
      <View
        style={blockStyle}
      >
        {height > 0 ? this.renderVideo(source.uri, { width, height }) : null}
      </View>
    );
  }
}
