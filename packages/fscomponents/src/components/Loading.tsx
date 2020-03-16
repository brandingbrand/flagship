import React from 'react';
import { ActivityIndicator, ActivityIndicatorProperties } from 'react-native';

export type LoadingProps = Pick<ActivityIndicatorProperties, 'style'>;

export const Loading: React.FunctionComponent<LoadingProps> = React.memo(props => {
  return <ActivityIndicator style={props.style} />;
});
