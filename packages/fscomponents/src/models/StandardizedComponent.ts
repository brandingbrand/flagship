import type { ReactNode } from 'react';
import type { FlexStyle, ViewStyle } from 'react-native';

interface StandardizedProps {
  style: ViewStyle;

  // Reserved Props
  children?: never;
  containerStyle?: never;
  dataSource?: never;
  commerceDataSource?: never;
  layoutDataSource?: never;
}

interface StandardizedContainerProps
  extends Omit<StandardizedProps, 'children' | 'containerStyle'> {
  containerStyle: FlexStyle;
  children: ReactNode;
}

export type StandardProps<P extends StandardizedProps> = Partial<P>;
export type StandardContainerProps<P extends StandardizedContainerProps> = Partial<P>;
