import React, { PureComponent } from 'react';
import { ActivityIndicator, ActivityIndicatorProperties } from 'react-native';

export type LoadingProps = Pick<ActivityIndicatorProperties, 'style'>;

export class Loading extends PureComponent<LoadingProps> {
  render(): JSX.Element {
    return <ActivityIndicator style={this.props.style} />;
  }
}
