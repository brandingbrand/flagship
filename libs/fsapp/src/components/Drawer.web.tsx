import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import { StyleSheet, View } from 'react-native';

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
const StyleSheetCreate: (obj: any) => StyleSheet.NamedStyles<any> = StyleSheet.create;

const S = StyleSheetCreate({
  container: {
    height: '100%',
    marginLeft: 0,
    position: 'fixed',
    zIndex: 10000,
    top: 0,
    overflowX: 'hidden',
    transitionDuration: '0.3s',
  },
  containerLeft: {
    left: 0,
    boxShadow: 'inset -7px 0 9px -7px rgba(0,0,0,0.7);',
    paddingRight: 5,
  },
  containerRight: {
    right: 0,
    boxShadow: 'inset 7px 0 9px -7px rgba(0,0,0,0.7);',
    paddingLeft: 5,
  },
});

export default class Drawer extends Component<PropType, DrawerState> {
  constructor(props: PropType) {
    super(props);
    this.state = {
      drawerVisible: props.isOpen,
    };
  }

  private drawView?: Element | Text | null;

  private readonly animationListener = (e: Event): void => {
    if (!this.props.isOpen) {
      this.setState({
        drawerVisible: false,
      });
    }
  };

  private readonly animationRef = (ref: View | null): void => {
    if (ref) {
      if (this.drawView) {
        this.drawView.removeEventListener('transitionend', this.animationListener);
      }
      this.drawView = ReactDOM.findDOMNode(ref);
      if (this.drawView) {
        this.drawView.addEventListener('transitionend', this.animationListener);
      }
    }
  };

  public componentDidUpdate() {
    if (this.props.isOpen && !this.state.drawerVisible) {
      this.setState({
        drawerVisible: true,
      });
    }
  }

  public componentWillUnmount() {
    if (this.drawView) {
      this.drawView.removeEventListener('transitionend', this.animationListener);
    }
  }

  public render(): JSX.Element {
    const { width } = this.props;
    const DrawerComponent = this.props.component;
    const orientationStyle = this.props.orientation === 'left' ? S.containerLeft : S.containerRight;

    const propCss = {
      backgroundColor: this.props.backgroundColor || DEFAULT_BACKGROUND_COLOR,
      transitionDuration: this.props.duration,
      width: this.props.width,
    };

    let closedCss;

    closedCss =
      this.props.orientation === 'left'
        ? {
            marginLeft: `-${width}`,
          }
        : {
            marginRight: `-${width}`,
          };

    return (
      <View
        ref={this.animationRef}
        style={[S.container, propCss, orientationStyle, !this.props.isOpen && closedCss]}
      >
        <DrawerComponent drawerVisible={this.state.drawerVisible} {...this.props} />
      </View>
    );
  }
}
