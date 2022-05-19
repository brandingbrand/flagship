import React from 'react';

import type { ActivityIndicatorProperties } from 'react-native';
import { ActivityIndicator } from 'react-native';

export type LoadingProps = Pick<ActivityIndicatorProperties, 'style'>;

const LoadingInner = (props: LoadingProps) => <ActivityIndicator style={props.style} />;

export const Loading: React.FunctionComponent<LoadingProps> = React.memo(LoadingInner);
