import React, { Component } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

import { Stepper } from '@brandingbrand/fscomponents';
import * as variables from '../styles/variables';

const icons = {
  plus: require('../../assets/images/icon-plus.png'),
  minus: require('../../assets/images/icon-minus.png'),
  delete: require('../../assets/images/delete.png')
};

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: variables.padding.narrow,
    maxWidth: 80
  },
  counter: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export interface PSStepperProps {
  minimumQuantity?: number;
  initialQuantity?: number;
  upperLimit?: number;
  onChange?: (value: number) => void;
  stepperStyle?: StyleProp<ViewStyle>;
}

export interface PSStepperState {
  quantity: number;
}

export default class PSStepper extends Component<PSStepperProps, PSStepperState> {

  constructor(props: PSStepperProps) {
    super(props);

    this.state = {
      quantity: props.initialQuantity || 1
    };
  }

  changeQty = (currentCount: number) => {
    this.setState({ quantity: currentCount });
    if (this.props.onChange) {
      this.props.onChange(currentCount);
    }
  }

  renderIncreaseButton = (count: number, handleIncreasePress: () => void): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={handleIncreasePress}
      >
        <Image
          resizeMode='contain'
          source={icons.plus}
        />
      </TouchableOpacity>
    );
  }

  renderDecreaseButton = (count: number, handleDecreasePress: () => void): JSX.Element => {
    const { minimumQuantity } = this.props;
    const disabled = !!minimumQuantity && (count === minimumQuantity);
    const remove = !minimumQuantity && (count === 1);

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={handleDecreasePress}
      >
        <Image
          resizeMode='contain'
          source={remove ? icons.delete : icons.minus}
          style={{
            opacity: disabled ? 0.7 : 1
          }}
        />
      </TouchableOpacity>
    );
  }

  render(): JSX.Element {
    const { stepperStyle } = this.props;
    const mergeStepperStyle: any = [styles.stepper, stepperStyle];
    return (
      <Stepper
        count={this.state.quantity}
        countUpperLimit={this.props.upperLimit || 10}
        stepperStyle={mergeStepperStyle}
        counterStyle={styles.counter}
        onDecreaseButtonPress={this.changeQty}
        onIncreaseButtonPress={this.changeQty}
        renderIncreaseButton={this.renderIncreaseButton}
        renderDecreaseButton={this.renderDecreaseButton}
      />
    );
  }
}
