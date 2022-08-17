import React, { Component } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { Step, StepDetails } from '../types';

const styles = StyleSheet.create({
  check: {
    fontSize: 12,
    marginHorizontal: 2,
  },
  item: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  slider: {
    backgroundColor: 'grey',
    bottom: StyleSheet.hairlineWidth,
    height: 2,
    left: 0,
    position: 'absolute',
  },
  stepsContainer: {
    backgroundColor: 'white',
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    fontSize: 12,
  },
  titleActive: {
    color: '#333',
  },
});

export interface StepTrackerProps {
  steps: Step[];
  style?: StyleProp<ViewStyle>;
  checkStyle?: StyleProp<TextStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  itemActiveStyle?: StyleProp<ViewStyle>;
  itemDoneStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  titleActiveStyle?: StyleProp<TextStyle>;
  titleDoneStyle?: StyleProp<TextStyle>;
  sliderStyle?: StyleProp<ViewStyle>;
  animated?: boolean;
  onStepPress?: (step: Step) => () => void;
}

export interface StepTrackerState {
  itemWidth: number;
}

export default class StepTracker extends Component<StepTrackerProps, StepTrackerState> {
  constructor(props: StepTrackerProps) {
    super(props);
    this.state = {
      itemWidth: 0,
    };
  }

  private readonly sliderPosition = new Animated.Value(0);

  private readonly calculateWidth = ({
    nativeEvent: {
      layout: { width },
    },
  }: any) => {
    const itemWidth = width / this.props.steps.length;
    if (this.state.itemWidth !== itemWidth) {
      this.setState({ itemWidth });
    }
  };

  protected getStepDetails = (step: Step, index: number): StepDetails => {
    const isActive = step.status === 'active';
    const isDone = step.status === 'done';

    const stepName = isDone ? step.displayName : `${index + 1}. ${step.displayName}`;
    const onPress = this.props.onStepPress ? this.props.onStepPress(step) : undefined;

    const isTouchable = onPress && isDone && !isActive;
    const Container = isTouchable ? TouchableOpacity : View;

    return { isActive, isDone, stepName, onPress, Container };
  };

  public componentDidUpdate(prevProps: StepTrackerProps, prevState: StepTrackerState): void {
    const prevActiveStep = prevProps.steps.findIndex((step) => step.status === 'active');
    const currActiveStep = this.props.steps.findIndex((step) => step.status === 'active');

    const prevItemWidth = prevState.itemWidth;
    const currItemWidth = this.state.itemWidth;

    if (prevActiveStep !== currActiveStep || prevItemWidth !== currItemWidth) {
      if (this.props.animated) {
        Animated.timing(this.sliderPosition, {
          useNativeDriver: false,
          duration: 300,
          toValue: currActiveStep * this.state.itemWidth,
        }).start();
      } else {
        this.sliderPosition.setValue(currActiveStep * this.state.itemWidth);
      }
    }
  }

  public render(): JSX.Element {
    const {
      checkStyle,
      itemActiveStyle,
      itemDoneStyle,
      itemStyle,
      steps,
      style,
      titleActiveStyle,
      titleDoneStyle,
      titleStyle,
    } = this.props;

    return (
      <View onLayout={this.calculateWidth} style={[styles.stepsContainer, style]}>
        {steps.map((step, i) => {
          const { Container, isActive, isDone, onPress, stepName } = this.getStepDetails(step, i);

          return (
            <Container
              key={step.name}
              onPress={onPress}
              style={[styles.item, itemStyle, isActive && itemActiveStyle, isDone && itemDoneStyle]}
            >
              {isDone ? <Text style={[styles.check, checkStyle]}>&#10004;</Text> : null}
              <Text
                style={[
                  styles.title,
                  titleStyle,
                  isActive && styles.titleActive,
                  isActive && titleActiveStyle,
                  isDone && titleDoneStyle,
                ]}
              >
                {stepName}
              </Text>
            </Container>
          );
        })}

        {this.state.itemWidth > 0 && (
          <Animated.View
            style={[
              styles.slider,
              this.props.sliderStyle,
              {
                width: this.state.itemWidth,
                transform: [{ translateX: this.sliderPosition }],
              },
            ]}
          />
        )}
      </View>
    );
  }
}
