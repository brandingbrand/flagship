import React, { Component, Fragment } from 'react';
import {
  StyleProp, TextStyle
} from 'react-native';
import { InjectedProps } from '../types';

export interface CardProps extends InjectedProps {
  containerStyle?: StyleProp<TextStyle>;
}

export default class Story extends Component<CardProps> {

  render(): JSX.Element {
    return (
      <Fragment>
        {this.props.children}
      </Fragment>
    );
  }
}
