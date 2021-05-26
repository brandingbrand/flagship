import type { StandardContainerProps } from '../../../models';

import React from 'react';
import { FlexStyle, View, ViewProps, ViewStyle } from 'react-native';

export interface PreStandardizedViewProps extends ViewProps {
  style: ViewStyle;

  /**
   * @TJS-ignore
   */
  containerStyle: FlexStyle;

  /**
   * @TJS-ignore
   */
  children: React.ReactNode;
}

export type SerializableViewProps = StandardContainerProps<PreStandardizedViewProps>;

export const SerializableView = React.memo<SerializableViewProps>(
  ({ children, style, containerStyle, ...props }) => {
    return (
      <View {...props} style={[style, containerStyle]}>
        {children}
      </View>
    );
  }
);
