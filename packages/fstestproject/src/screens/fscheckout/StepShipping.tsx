/* tslint:disable:jsx-use-translation-function */

import React, { StatelessComponent } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { StepProps } from './CheckoutDemo';

const submitShipping = (stepProps: StepProps) => () => {
  stepProps.checkoutActions.submitShipping()
    .then(() => {
      stepProps.stepManager.continue();
    })
    .catch(stepProps.checkoutActions.handleError);
};

const StepShipping: StatelessComponent<StepProps> = stepProps => {
  return (
    <View>
      <Text>shipping</Text>

      <TextInput
        style={{ borderWidth: 1, padding: 10 }}
        value={stepProps.checkoutState.address}
        ref={stepProps.checkoutActions.getShippingFormRef}
        onChangeText={stepProps.checkoutActions.updateAddress}
        placeholder='enter address'
      />
      <Button title='submit shipping' onPress={submitShipping(stepProps)} />
    </View>
  );
};

export default StepShipping;

