import type React from 'react';

export type StepStatus = 'active' | 'done' | 'pending';

export interface Step {
  name: string;
  displayName: string;
  status: StepStatus;
}

export interface StepDetails {
  isActive: boolean;
  isDone: boolean;
  stepName: string;
  onPress?: () => void;
  Container: typeof React.Component;
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
