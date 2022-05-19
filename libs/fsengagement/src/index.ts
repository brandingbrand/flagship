import type { ComponentClass } from 'react';

import type { EngagementScreenProps } from './EngagementComp';
import EngagementComp from './EngagementComp';
import type { EngagementServiceConfig } from './EngagementService';
import { EngagementService } from './EngagementService';
import layoutComponents from './inboxblocks';
import type { ComponentList } from './types';

export interface EngagementSettings extends EngagementServiceConfig {
  components?: ComponentList;
}

export interface EngagementUtilities {
  engagementService: EngagementService;
  EngagementComp: ComponentClass<EngagementScreenProps>;
}

export * from './EngagementCompGhost';

/**
 *
 * @param params
 */
export default function (params: EngagementSettings): EngagementUtilities {
  const api = new EngagementService(params);

  return {
    engagementService: api,
    EngagementComp: EngagementComp(api, { ...layoutComponents, ...params.components }),
  };
}

export type { EngagementMessage, InboxBlock, InjectedProps, JSON as EngagementJSON } from './types';
export type { EngagementScreenProps } from './EngagementComp';
