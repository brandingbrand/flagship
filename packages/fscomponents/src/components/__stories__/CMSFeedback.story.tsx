/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { CMSFeedback } from '../CMSFeedback';

const styles = StyleSheet.create({
  bodyText: {
    marginBottom: 10
  }
});

const renderModalBody = () => {
  return (
    <View>
      <Text style={styles.bodyText}>
        For feedback about the mobile site, please complete the survey below.
      </Text>
      <Text style={styles.bodyText}>
        For customer service requests, please call 800-555-5555 or view the customer service page.
      </Text>
    </View>
  );
};

storiesOf('CMSFeedback', module)
  .add('basic usage', () => (
    <CMSFeedback
      propertyId='443'
      renderModalBody={renderModalBody}
    />
  ));
