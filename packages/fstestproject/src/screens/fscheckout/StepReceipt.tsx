/* tslint:disable:jsx-use-translation-function */

import React, { FunctionComponent } from 'react';
import { Button, Text, View } from 'react-native';
import { StepProps } from './CheckoutDemo';

const StepReceipt: FunctionComponent<StepProps> = stepProps => {
  return (
    <View>
      <Text>Receipt</Text>
      <Text>order number: {stepProps.checkoutState.checkoutData.orderId}</Text>

      <Button
        title='Done'
        onPress={stepProps.checkoutActions.exitCheckout}
      />
    </View>
  );
};

export default StepReceipt;
