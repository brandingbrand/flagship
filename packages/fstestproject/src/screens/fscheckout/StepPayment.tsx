/* tslint:disable:jsx-use-translation-function */

import React, { StatelessComponent } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { StepProps } from './CheckoutDemo';

const submitPayment = (stepProps: StepProps) => () => {
  stepProps.checkoutActions.submitPayment()
    .then(() => {
      stepProps.stepManager.continue();
    })
    .catch(stepProps.checkoutActions.handleError);
};

const StepPayment: StatelessComponent<StepProps> = stepProps => {
  return (
    <View>
      <Text>payment</Text>
      <Text>shipping: {stepProps.checkoutState.checkoutData.shippingAddress}</Text>

      <TextInput
        style={{ borderWidth: 1, padding: 10 }}
        value={stepProps.checkoutState.payment}
        onChangeText={stepProps.checkoutActions.updatePayment}
        placeholder='enter credit card'
      />

      <Button
        title='submit payment'
        onPress={submitPayment(stepProps)}
      />
    </View>
  );
};

export default StepPayment;
