import React from 'react';
import { ActivityIndicator, ActivityIndicatorProperties } from 'react-native';

export type LoadingProps = Pick<ActivityIndicatorProperties, 'style'>;

const LoadingInner = (props: LoadingProps) => {
  return <ActivityIndicator style={props.style} />;
};

export const Loading: React.FunctionComponent<LoadingProps> = React.memo(LoadingInner);
