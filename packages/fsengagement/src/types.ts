import { ComponentClass } from 'react';
import { Notification } from 'react-native-fcm';
import {
  ImageStyle,
  StyleProp,
  TextStyle
} from 'react-native';

export interface ComponentList {
  [key: string]: ComponentClass<any>;
}

export interface Icon {
  type: string;
  tintColor?: string;
  iconStyle?: StyleProp<ImageStyle>;
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
