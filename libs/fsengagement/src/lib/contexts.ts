import React from 'react';

import type { Action, DynamicData, JSON } from '../types';

export interface EngContext {
  handleAction?: (actions: Action) => void;
  story?: JSON;
  language?: string;
  cardPosition?: number;
  windowWidth?: number;
  displayName?: string;
  discoverPath?: string;
  dynamicData?: DynamicData;
}
export const EngagementContext = React.createContext<EngContext>({});
export const CardContext = React.createContext<any>({});
