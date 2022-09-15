import type { ComponentClass, FunctionComponent } from 'react';

export type AppSettings = Record<string, any>;
export interface EngagementSettings extends EngagementServiceConfig {
  components?: ComponentList;
}
export type ComponentList = Record<string, ComponentClass<any> | FunctionComponent<any>>;
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
