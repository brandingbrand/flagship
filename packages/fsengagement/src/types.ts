import { ComponentClass } from 'react';
import { Notification } from 'react-native-fcm';
import {
  ImageStyle,
  ImageURISource,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import { Navigator } from '@brandingbrand/fsapp';

export interface ScreenProps {
  componentId: string;
}

export interface Action {
  type: string;
  value: string;
  subject?: string;
  body?: string;
  name?: string;
  id?: string;
  position?: number;
}

export interface EmitterProps {
  id?: string;
  name?: string;
}

export interface ComponentList {
  [key: string]: ComponentClass<any>;
}

export interface Icon {
  type: string;
  tintColor?: string;
  iconStyle?: StyleProp<ImageStyle>;
}

export interface CardProps {
  containerStyle?: StyleProp<TextStyle>;
  private_blocks: BlockItem[];
  story?: JSON;
  api?: any;
  plainCard?: boolean;
  storyGradient?: StoryGradient;
  navigator: Navigator;
  name?: string;
  id?: string;
}

export interface Empty {
  message: string;
  textStyle?: StyleProp<TextStyle>;
}

export interface StoryGradient {
  enabled: boolean;
  startFadePosition?: number;
  endFadePosition?: number;
}

export interface HTML {
  body: string;
  link: string;
  iframe: string;
  image: JSON;
  title: JSON;
}

export interface JSON {
  isBlog?: boolean;
  backArrow?: StyleProp<ImageStyle>;
  private_blocks?: BlockItem[];
  private_type: string;
  empty?: Empty;
  storyGradient?: StoryGradient;
  html?: HTML;
  pageNumberStyle?: StyleProp<TextStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  navBarTitleStyle?: StyleProp<TextStyle>;
  pageCounterStyle?: StyleProp<ViewStyle>;
  id?: string;
  key?: string;
  name?: string;
  storyType?: string;
  tabbedItems?: any[];
  AnimatedPageCounter?: any;
  AnimatedNavTitle?: any;
  setScrollEnabled?: (enabled: boolean) => void;
  onBack?: () => void;
  fullScreenCardImage?: ImageURISource;
}

export interface BlockItem extends ScreenProps, JSON {
  story?: JSON;
  index?: number;
  wrapper?: boolean;
  testing?: string;
  contents?: any;
  fadeIn?: boolean;
  forceBackground?: boolean;
  fullScreenCard?: boolean;
  animateIndex?: number;
  position?: number;
}

export interface InjectedProps {
  messageId: string;
  clickHandler: (id: string, story?: any) => void;
  key?: any;
}

export interface InboxBlock extends InjectedProps {
  private_type: string;
  private_blocks: InboxBlock[];
  containerStyle?: StyleProp<TextStyle>;
  story?: InboxBlock;
}

export interface EngagmentEvent {
  type: string;
  id: string;
  data: any;
  fired: Date;
}

export interface EngagmentDevice {
  id: string;
  identifier: string;
  model: string;
  appName: string;
  appVersion: string;
  osName: string;
  osVersion: string;
  profileId: string;
  appId: string;
  pushToken?: string;
}

export interface EngagementMessage {
  id: string;
  published: Date;
  message: any;
  title: string;
  inbox: string;
  attributes: any;
}

export interface EngagmentNotification extends Notification {
  messageId?: string;
  future?: boolean;
  on?: string;
  body?: string;
  title?: string;
}

export interface EngagementProfile {
  id: string;
  created: Date;
  modified: Date;

  attributes: {
    [key: string]: string;
  };

  devices: {
    [deviceID: string]: EngagmentDevice;
  };
}
