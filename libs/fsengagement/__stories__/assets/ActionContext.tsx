/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { Action } from '../../src/types';
import { View } from 'react-native';
import PropTypes from 'prop-types';

class ActionContext extends Component {
  static childContextTypes: any = {
    handleAction: PropTypes.func,
    story: PropTypes.object,
  };

  render(): JSX.Element {
    return <View>{this.props.children}</View>;
  }
}

export default function (handleAction: (actions: Action) => void, story?: any): any {
  return class extends ActionContext {
    getChildContext = () => ({
      handleAction,
      story,
    });
  };
}
