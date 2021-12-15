import React, { Component } from 'react';
import { Action } from '../../src/types';
import { View } from 'react-native';
import PropTypes from 'prop-types';

class ActionContext extends Component {
  static childContextTypes: any = {
    handleAction: PropTypes.func,
    story: PropTypes.object
  };

  render(): JSX.Element {
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}

export default function(handleAction: (actions: Action) => void, story?: any): any {
  // tslint:disable-next-line: max-classes-per-file
  return class extends ActionContext {
    getChildContext = () => ({
      handleAction,
      story
    })
  };
}

