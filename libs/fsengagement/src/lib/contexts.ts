import React from 'react';
import { Action, JSON } from '../types';

export interface EngContext {
  handleAction?: (actions: Action) => void;
  story?: JSON;
  language?: string;
  cardPosition?: number;
  windowWidth?: number;
}
export const EngagementContext = React.createContext<EngContext>({});
export const CardContext = React.createContext<any>({});
