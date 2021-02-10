import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import WebView from 'react-native-webview';
import VideoPlayer, { VideoProperties } from 'react-native-video';
import * as _ from 'lodash-es';

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
  static contextTypes: any = {
    isCard: PropTypes.bool
  };
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
    const { isCard } = this.context;

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
        />
        {!isCard && (
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
        )}
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

  // tslint:disable cyclomatic-complexity
  render(): JSX.Element {
    const {
      source,
      style = {},
      containerStyle,
      outerContainerStyle
    } = this.props;

    if (!source) {
      return <View />;
    }
    const height = style.height || 200;
    const width = DEFAULT_WIDTH;

    const blockStyle = _.cloneDeep(style);
    blockStyle.width = width;

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
        {height > 0 ? this.renderVideo(source.src.replace(/ /g, '%20'), {
          width: blockStyle.width,
          height: blockStyle.height
        }) : null}
        </View>
      </View>
    );
  }
}
