import React, { Component, Fragment } from 'react';

import type { StyleProp, TextStyle } from 'react-native';

import type { InjectedProps } from '../types';

export interface CardProps extends InjectedProps {
  containerStyle?: StyleProp<TextStyle>;
}

export default class Story extends Component<CardProps> {
  public render(): JSX.Element {
    return <Fragment>{this.props.children}</Fragment>;
  }
}
