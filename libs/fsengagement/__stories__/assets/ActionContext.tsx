/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';

import { View } from 'react-native';

import PropTypes from 'prop-types';

import type { Action } from '../../src/types';

class ActionContext extends Component {
  public static childContextTypes: unknown = {
    handleAction: PropTypes.func,
    story: PropTypes.object,
  };

  public render(): JSX.Element {
    return <View>{this.props.children}</View>;
  }
}

/**
 *
 * @param handleAction
 * @param story
 */
export default function (handleAction: (actions: Action) => void, story?: unknown): any {
  return class extends ActionContext {
    getChildContext = () => ({
      handleAction,
      story,
    });
  };
}
