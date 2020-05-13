import React, { StatelessComponent } from 'react';
import { Button, Text, View } from 'react-native';
import { StepProps } from './CheckoutDemo';

const receiptTitle = 'Receipt';
const orderText = 'order number: ';
const buttonTitle = 'Done';

const StepReceipt: StatelessComponent<StepProps> = stepProps => {
  return (
    <View>
      <Text>{receiptTitle}</Text>
      <Text>{orderText}{stepProps.checkoutState.checkoutData.orderId}</Text>

      <Button
        title={buttonTitle}
        onPress={stepProps.checkoutActions.exitCheckout}
      />
    </View>
  );
};

export default StepReceipt;
