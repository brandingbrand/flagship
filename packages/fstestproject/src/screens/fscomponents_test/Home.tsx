import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import { EmailFormFK } from '@brandingbrand/fscomponents';

interface EmailFormFKValue {
  email: string;
}

export default class Home extends Component<any> {
  goTo = (screen: string, title: string, backButtonTitle: string) => () => {
    this.props.navigator.push({ screen: 'fscart.' + screen, title, backButtonTitle });
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <EmailFormFK
          onSubmit={onEmailSubmit}
          onValidate={onEmailValidate}
          placeholder={'Email Form FK'}
        />
      </ScrollView>
    );
  }
}

function onEmailSubmit(value: EmailFormFKValue) {
  alert(`email submit: ${value.email}`);
}

function onEmailValidate(value: EmailFormFKValue) {
  alert(`validate email: ${value.email}`);
}
