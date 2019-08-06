import React, { Component } from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  WebView
} from 'react-native';
import VideoPlayer from 'react-native-video';
import * as _ from 'lodash-es';

export interface VideoSource {
  src: string;
  ratio?: number;
}
export interface VideoBlockProps {
  source: VideoSource;
  autoPlay?: boolean;
  repeat?: boolean;
  resizeMode?: string;
  style?: any;
  muted?: boolean;
  fullscreen?: boolean;
  containerStyle?: StyleProp<TextStyle>;
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
      muted = false,
      fullscreen = false
    } = this.props;

    return (
      <View>
        <VideoPlayer
          resizeMode={resizeMode}
          repeat={repeat}
          muted={muted}
          fullscreen={fullscreen}
          onLoad={this.checkAutoPlay(autoPlay)}
          source={{ uri: src }}
          paused={this.state.videoPaused}
          style={{ width, height }}
        />
        <TouchableOpacity
          onPress={this.toggleVideo}
          style={[styles.VideoButton, { width, height }]}
        >
          {this.state.videoPaused &&
            <View style={styles.VideoButtonWrapper}>
              <View style={styles.VideoButtonInner} />
            </View>}
        </TouchableOpacity>
      </View>
    );
  }

  toggleVideo = () => {
    this.setState({
      videoPaused: !this.state.videoPaused
    });
  }

  render(): JSX.Element {
    const {
      source,
      style = {},
      containerStyle
    } = this.props;

    let height = style.height || 200;
    const width = DEFAULT_WIDTH;

    if (source.ratio) {
      height = width / source.ratio;
    }

    const blockStyle = _.cloneDeep(style);
    blockStyle.height = height;
    blockStyle.width = width;

    return (
      <View style={[containerStyle, blockStyle]}>
        {height > 0 ? this.renderVideo(source.src, { width, height }) : null}
      </View>
    );
  }
}
