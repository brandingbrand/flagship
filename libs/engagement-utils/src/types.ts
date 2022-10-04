import type { ComponentClass, FunctionComponent } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { EngagementService } from './service';

type DeeplinkMethod = 'open' | 'push';

export type AppSettings = Record<string, any>;
export interface EngagementSettings extends EngagementServiceConfig {
  components?: ComponentList;
}
export interface ScreenProps {
  componentId?: string;
}
export interface EngagementUtilities {
  engagementService: EngagementService;
  EngagementComp: ComponentClass<EngagementScreenProps>;
}
export type ComponentList = Record<string, ComponentClass<any> | FunctionComponent<any>>;
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
}

export interface StoryGradient {
  enabled: boolean;
  startFadePosition?: number;
  endFadePosition?: number;
}

export interface Empty {
  message: string;
  textStyle?: StyleProp<TextStyle>;
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

export interface EngagementScreenProps extends ScreenProps, EmitterProps {
  json: JSON;
  backButton?: boolean;
  noScrollView?: boolean;
  navBarTitle?: string;
  renderType?: string;
  refreshControl?: () => void;
  isLoading: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  autoplayInterval?: number;
  storyType?: string;
  tabbedItems?: unknown[];
  lastUpdate?: number;
  containerStyle?: StyleProp<ViewStyle>;
  animateScroll?: boolean;
  onBack?: () => void;
  language?: string;
  AnimatedImage?: unknown;
  welcomeHeader?: boolean;
  headerName?: string;
  animate?: boolean;
  cardPosition?: number;
  navigator?: any;
  renderHeader?: () => void;
  discoverPath?: string;
  deepLinkMethod?: DeeplinkMethod;
  renderBackButton?: (navigation?: any) => void;
}

export interface EngagementMessage {
  id: string;
  published: Date;
  message: any;
  title: string;
  inbox: string;
  attributes: any;
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
export interface EngagementProfile {
  id: string;
  created: Date;
  modified: Date;

  attributes: Record<string, string>;

  devices: Record<string, EngagmentDevice>;
}
export interface EngagmentEvent {
  type: string;
  id: string;
  data: unknown;
  fired: Date;
}

export interface Attribute {
  key: string;
  value: string;
  type?: string;
}

export interface EngagementServiceConfig {
  appId: string;
  apiKey?: string;
  baseURL: string;
  cacheTTL?: number; // default = 10 mins
}
export interface Segment {
  id: number;
  name: string;
  attributes?: string[];
}

export interface AttributePayload {
  attributes: string;
}
