import React, { Component } from 'react';
import {
  StyleProp, StyleSheet, TextStyle, View
} from 'react-native';
import { InjectedProps } from '../types';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  }
});

export interface CardProps extends InjectedProps {
  containerStyle?: StyleProp<TextStyle>;
  animateIndex?: number;
  slideBackground?: boolean;
}

export default class InboxWrapper extends Component<CardProps> {
  fadeInView: any;
  handleFadeInRef = (ref: any) => this.fadeInView = ref;

  componentDidMount(): void {
    if (this.props.animateIndex && this.props.animateIndex <= 2 && this.props.animateIndex >= 1) {
      setTimeout(() => {
        this.fadeInView.transition(
          { translateX: 0 },
          { translateX: 24 },
          600, 'ease-out');
      }, 250);
    }
  }
  componentDidUpdate(prevProps: CardProps): void {
    if (this.props.slideBackground !== prevProps.slideBackground &&
      this.props.animateIndex && this.props.animateIndex <= 2 && this.props.animateIndex >= 1) {
      this.fadeInView.transition(
        { translateX: 24 },
        { translateX: 0 },
        700, 'ease-out');
    }
  }

  render(): JSX.Element {
    const { animateIndex } = this.props;
    if (animateIndex && animateIndex <= 2 && animateIndex >= 1) {
      return (
        <View>
          <Animatable.View
            style={[styles.container, {
              position: 'absolute',
              left: 0,
              backgroundColor: '#fff',
              width: 24,
              flex: 1,
              height: '100%'
            }]}
            ref={this.handleFadeInRef}
            useNativeDriver={false}
          >
            {this.props.children}
          </Animatable.View>
          <View>
            {this.props.children}
          </View>
        </View>
      );
    }
    return (
      <View style={(animateIndex && animateIndex > 2) ? styles.container : {}}>
        {this.props.children}
      </View>
    );
  }
}
