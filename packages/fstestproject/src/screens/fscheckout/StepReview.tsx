/* tslint:disable:jsx-use-translation-function */

import React, { StatelessComponent } from 'react';
import { Button, Text, View } from 'react-native';
import { StepProps } from './CheckoutDemo';


const placeOrder = (stepProps: StepProps) => () => {
  stepProps.checkoutActions.placeOrder()
    .then(() => stepProps.stepManager.continue())
    .catch(stepProps.checkoutActions.handleError);
};

const goTo = (stepProps: StepProps, stepName: string) => () => {
  stepProps.stepManager.goTo(stepName);
};

const StepReview: StatelessComponent<StepProps> = stepProps => {
  return (
    <View>
      <Text>review</Text>

      <Text>shipping: {stepProps.checkoutState.checkoutData.shippingAddress}</Text>

      <Button
        title='edit shipping'
        onPress={goTo(stepProps, 'shipping')}
      />

      <Text>payment: {stepProps.checkoutState.checkoutData.payment}</Text>
      <Button
        title='edit payment'
        onPress={goTo(stepProps, 'payment')}
      />

      <Button
        title='place order'
        onPress={placeOrder(stepProps)}
      />
    </View>
  );
};


export default StepReview;
