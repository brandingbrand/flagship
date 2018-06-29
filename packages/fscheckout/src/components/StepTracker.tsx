import React, { Component } from 'react';
import { Animated, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Step } from '../types';

const styles = StyleSheet.create({
  stepsContainer: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
    backgroundColor: 'white'
  },
  item: {
    flex: 1,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  title: {
    color: 'white',
    fontSize: 12
  },
  titleActive: {
    color: '#333'
  },
  check: {
    fontSize: 12,
    marginHorizontal: 2
  },
  slider: {
    position: 'absolute',
    bottom: StyleSheet.hairlineWidth,
    left: 0,
    height: 2,
    backgroundColor: 'grey'
  }
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
}

export interface StepTrackerState {
  itemWidth: number;
}

export default class StepTracker extends Component<StepTrackerProps, StepTrackerState> {
  sliderPosition: Animated.Value;

  constructor(props: StepTrackerProps) {
    super(props);
    this.sliderPosition = new Animated.Value(0);
    this.state = {
      itemWidth: 0
    };
  }

  calculateWidth = ({
    nativeEvent: {
      layout: { width }
    }
  }: any) => {
    const itemWidth = width / this.props.steps.length;
    if (this.state.itemWidth !== itemWidth) {
      this.setState({ itemWidth });
    }
  }

  componentDidUpdate(prevProps: StepTrackerProps): void {
    const prevActiveStep = prevProps.steps.findIndex(step => step.status === 'active');
    const currActiveStep = this.props.steps.findIndex(step => step.status === 'active');

    if (prevActiveStep !== currActiveStep) {
      if (this.props.animated) {
        Animated.timing(this.sliderPosition, {
          useNativeDriver: true,
          duration: 300,
          toValue: currActiveStep * this.state.itemWidth
        }).start();
      } else {
        this.sliderPosition.setValue(currActiveStep * this.state.itemWidth);
      }
    }
  }

  render(): JSX.Element {
    const {
      style,
      checkStyle,
      itemStyle,
      itemActiveStyle,
      itemDoneStyle,
      titleStyle,
      titleActiveStyle,
      titleDoneStyle,
      steps
    } = this.props;

    return (
      <View style={[styles.stepsContainer, style]} onLayout={this.calculateWidth}>
        {steps.map((step, i) => {
          const isActive = step.status === 'active';
          const isDone = step.status === 'done';
          const stepName = isDone ? step.displayName : `${i + 1}. ${step.displayName}`;

          return (
            <View
              style={[
                styles.item,
                itemStyle,
                isActive && itemActiveStyle,
                isDone && itemDoneStyle
              ]}
              key={step.name}
            >
              {isDone && <Text style={[styles.check, checkStyle]}>&#10004;</Text>}
              <Text
                style={[
                  styles.title,
                  titleStyle,
                  isActive && styles.titleActive,
                  isActive && titleActiveStyle,
                  isDone && titleDoneStyle
                ]}
              >
                {stepName}
              </Text>
            </View>
          );
        })}

        {this.state.itemWidth > 0 && (
          <Animated.View
            style={[
              styles.slider,
              this.props.sliderStyle,
              {
                width: this.state.itemWidth,
                transform: [{ translateX: this.sliderPosition }]
              }
            ]}
          />
        )}
      </View>
    );
  }
}
