import React, { Component } from 'react';
import { View } from 'react-native';
import { EngagementMessage, EngagementScreenProps } from '@brandingbrand/fsengagement';

export class EngagementComp extends Component<EngagementScreenProps> {
  render(): JSX.Element {
    return (
      <View />
    );
  }
}

export const engagementService = undefined;

export interface InboxFetch {
  login?: string;
}

export type DiscoveryMessage = EngagementMessage['message'];

export async function fetchEngagementInbox(
  userInfo: InboxFetch
): Promise<DiscoveryMessage[]> {
  return [];
}
