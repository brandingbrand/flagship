import type { FC } from 'react';

import type { ScreenOptions } from './types';

export interface ScreenProps {
  componentId: string;
}

export const makeScreen = (Component: FC<ScreenProps>, options?: ScreenOptions) => {
  const route = (props: ScreenProps) => Component(props);
  route.buttons = options?.buttons;
  return route;
};
