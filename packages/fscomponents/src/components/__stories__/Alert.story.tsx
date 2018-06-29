/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';

import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { Button } from '../Button';
import { Alert } from '../Alert';

const simpleAlert = () => {
  Alert.alert('simple alert');
};

const titleAlert = () => {
  Alert.alert({ title: 'Test Title', text: 'test text, test text.' });
};

const confirmAlert = () => {
  Alert.alert({
    title: 'Are you sure?',
    text: 'You will not be able to recover this imaginary file!',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Confirm',
    onConfirm: action('Confirm'),
    onCancel: action('Cancel')
  });
};

storiesOf('Alert', module)
  .add('simple', () => (
    <Button onPress={simpleAlert} title='Preview Simple Alert'/>
  ))
  .add('w/ title', () => (
    <Button onPress={titleAlert} title='Preview Title Alert'/>
  ))
  .add('w/ confirm', () => (
    <Button onPress={confirmAlert} title='Preview Confirm Alert'/>
  ));
