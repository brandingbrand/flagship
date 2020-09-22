import React, { Component } from 'react';

import {
  StyleSheet,
  View
} from 'react-native';
import ReactDOM from 'react-dom';

export interface PropType {
  component: typeof React.Component;
  orientation: 'left' | 'right';
  isOpen: boolean;
  width: string;
  duration: string;
  backgroundColor?: string;
}

export interface DrawerState {
  drawerVisible: boolean;
}

const DEFAULT_BACKGROUND_COLOR = 'white';

// hack to avoid ts complaint about certain web-only properties not being valid
const StyleSheetCreate: ((obj: any) => StyleSheet.NamedStyles<any>) = StyleSheet.create;

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

export default class Drawer extends Component<PropType, DrawerState> {
  drawView?: Element | Text | null;

  constructor(props: PropType) {
    super(props);
    this.state = {
      drawerVisible: props.isOpen
    };
  }

  componentDidUpdate = (prevProps: PropType, prevState: DrawerState): void => {
    if (this.props.isOpen && !this.state.drawerVisible) {
      this.setState({
        drawerVisible: true
      });
    }
  }

  componentWillUnmount = (): void => {
    if (this.drawView) {
      this.drawView.removeEventListener('transitionend', this.animationListener);
    }
  }

  animationListener = (e: Event): void => {
    if (!this.props.isOpen) {
      this.setState({
        drawerVisible: false
      });
    }
  }

  animationRef = (ref: View | null): void => {
    if (ref) {
      if (this.drawView) {
        this.drawView.removeEventListener('transitionend', this.animationListener);
      }
      this.drawView = ReactDOM.findDOMNode(ref);
      if (this.drawView) {
        this.drawView.addEventListener('transitionend', this.animationListener);
      }
    }
  }

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
      <View
        style={[S.container, propCss, orientationStyle, !this.props.isOpen && closedCss]}
        ref={this.animationRef}
      >
        <DrawerComponent
          drawerVisible={this.state.drawerVisible}
          {...this.props}
        />
      </View>
    );
  }
}
