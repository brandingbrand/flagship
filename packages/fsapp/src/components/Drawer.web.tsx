import React, { Component } from 'react';

import {
  StyleSheet,
  View
} from 'react-native';

export interface PropType {
  component: typeof React.Component;
  orientation: 'left' | 'right';
  isOpen: boolean;
  width: string;
  duration: string;
  backgroundColor?: string;
}

const DEFAULT_BACKGROUND_COLOR = 'white';

const StyleSheetCreate: any = StyleSheet.create;

const S = StyleSheetCreate({
  container: {
    height: '100%',
    marginLeft: 0,
    position: 'fixed',
    zIndex: 10000,
    top: 0,
    overflowX: 'hidden',
    transitionDuration: '0.3s'
  },
  containerLeft: {
    left: 0,
    boxShadow: 'inset -7px 0 9px -7px rgba(0,0,0,0.7);',
    paddingRight: 5
  },
  containerRight: {
    right: 0,
    boxShadow: 'inset 7px 0 9px -7px rgba(0,0,0,0.7);',
    paddingLeft: 5
  }
});

export default class Drawer extends Component<PropType> {
  render(): JSX.Element {
    const width = this.props.width;
    const DrawerComponent = this.props.component;
    const orientationStyle = this.props.orientation === 'left' ? S.containerLeft : S.containerRight;

    const propCss = {
      backgroundColor: this.props.backgroundColor || DEFAULT_BACKGROUND_COLOR,
      transitionDuration: this.props.duration,
      width: this.props.width
    };

    let closedCss;

    if (this.props.orientation === 'left') {
      closedCss = {
        marginLeft: '-' + width
      };
    } else {
      closedCss = {
        marginRight: '-' + width
      };
    }

    return (
      <View style={[S.container, propCss, orientationStyle, !this.props.isOpen && closedCss]}>
        <DrawerComponent {...this.props} />
      </View>
    );
  }
}
