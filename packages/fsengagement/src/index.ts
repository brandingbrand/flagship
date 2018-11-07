import { ComponentClass } from 'react';
import { EngagementService, EngagementServiceConfig } from './EngagementService';
import EngagementComp, { EngagementScreenProps } from './EngagementComp';
import { ComponentList, InboxBlock, InjectedProps } from './types';
import layoutComponents from './inboxblocks';

export interface EngagementSettings extends EngagementServiceConfig {
  components: ComponentList;
}

export interface EngagementUtilities {
  engagementService: EngagementService;
  EngagementComp: ComponentClass<EngagementScreenProps>;
}

export { InboxBlock, InjectedProps };

export default function(params: EngagementSettings): EngagementUtilities {
  const api = new EngagementService(params);

  return {
    engagementService: api,
    EngagementComp: EngagementComp(api, {...layoutComponents, ...params.components})
  };
}
