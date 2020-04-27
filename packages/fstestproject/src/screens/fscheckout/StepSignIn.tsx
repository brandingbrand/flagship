/* tslint:disable:jsx-use-translation-function */

import React, { FunctionComponent } from 'react';
import { Button, Text, View } from 'react-native';
import { StepProps } from './CheckoutDemo';

const guessContinue = (stepProps: StepProps) => () => {
  stepProps.stepManager.continue();
};

const StepShipping: FunctionComponent<StepProps> = stepProps => {
  return (
    <View>
      <Text>StepSignIn</Text>
      <Button
        title='continue as guest'
        onPress={guessContinue(stepProps)}
      />
    </View>
  );
};

export default StepShipping;
