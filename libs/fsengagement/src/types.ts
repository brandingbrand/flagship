import type { ComponentClass, FunctionComponent } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { EngagementService } from '@brandingbrand/engagement-utils';
import type { Navigator } from '@brandingbrand/fsapp/legacy';

export interface ScreenProps {
  componentId?: string;
}

export interface EmitterProps {
  id?: string;
  name?: string;
}

export interface Action extends EmitterProps {
  type: string;
  value: string;
  subject?: string;
  body?: string;
  position?: number;
}

export type ComponentList = Record<string, ComponentClass<any> | FunctionComponent<any>>;
export type AppSettings = Record<string, any>;

export interface Icon {
  type: string;
  tintColor?: string;
  iconStyle?: StyleProp<ImageStyle>;
}

export interface CardProps extends EmitterProps {
  containerStyle?: StyleProp<TextStyle>;
  private_blocks: BlockItem[];
  story?: JSON;
  api?: EngagementService;
  plainCard?: boolean;
  storyGradient?: StoryGradient;
  navigator?: Navigator;
  discoverPath?: string;
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

export interface JSON extends EmitterProps {
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
  containerStyle?: StyleProp<ViewStyle>;
  id?: string;
  key?: string;
  storyType?: string;
  tabbedItems?: unknown[];
  AnimatedPageCounter?: unknown;
  AnimatedNavTitle?: unknown;
  setScrollEnabled?: (enabled: boolean) => void;
  onBack?: () => void;
  fullScreenCardImage?: ImageURISource;
}

export interface BlockItem extends ScreenProps, JSON {
  story?: JSON;
  index?: number;
  wrapper?: boolean;
  testing?: string;
  contents?: unknown;
  fadeIn?: boolean;
  forceBackground?: boolean;
  fullScreenCard?: boolean;
  animateIndex?: number;
  position?: number;
  cardContainerStyle?: StyleProp<ViewStyle>;
  parentHasFixedHeight?: boolean;
}

export interface InjectedProps {
  messageId: string;
  clickHandler: (id: string, story?: unknown) => void;
  key?: unknown;
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
  data: unknown;
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

export interface EngagementProfile {
  id: string;
  created: Date;
  modified: Date;

  attributes: Record<string, string>;

  devices: Record<string, EngagmentDevice>;
}
