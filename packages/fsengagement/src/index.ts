import { ComponentClass } from 'react';
import { EngagementService, EngagementServiceConfig } from './EngagementService';
import EngagementComp, { EngagementScreenProps} from './EngagementComp';
import { ComponentList, InboxBlock, InjectedProps } from './types';
import layoutComponents from './inboxblocks';

export interface EngagementSettings extends EngagementServiceConfig {
  components: ComponentList;
}

export interface EngagementUtilities {
  engagementService: EngagementService;
  engagementComp: ComponentClass<EngagementScreenProps>;
}

export { InboxBlock, InjectedProps };

export default function(params: EngagementSettings): EngagementUtilities {
  const api = new EngagementService(params);

  return {
    engagementService: api,
    engagementComp: EngagementComp(api, {...layoutComponents, ...params.components})
  };
}
