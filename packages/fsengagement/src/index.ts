import { ComponentClass } from 'react';
import { EngagementService, EngagementServiceConfig } from './EngagementService';
import EngagementComp, { EngagementScreenProps } from './EngagementComp';
import { ComponentList, EngagementMessage, InboxBlock, InjectedProps, JSON } from './types';
import layoutComponents from './inboxblocks';

export interface EngagementSettings extends EngagementServiceConfig {
  components?: ComponentList;
}

export interface EngagementUtilities {
  engagementService: EngagementService;
  EngagementComp: ComponentClass<EngagementScreenProps>;
}

export {
  EngagementMessage,
  EngagementScreenProps,
  InboxBlock,
  InjectedProps,
  JSON as EngagementJSON
};
export * from './EngagementCompGhost';

export default function(params: EngagementSettings): EngagementUtilities {
  const api = new EngagementService(params);

  return {
    engagementService: api,
    EngagementComp: EngagementComp(api, {...layoutComponents, ...params.components})
  };
}
