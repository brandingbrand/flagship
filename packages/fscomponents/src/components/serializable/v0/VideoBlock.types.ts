import type { ViewStyle } from 'react-native';
import type { VideoProperties } from 'react-native-video';
import type { ReactPlayerProps } from 'react-player';

export interface VideoProgressStateWeb {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

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
