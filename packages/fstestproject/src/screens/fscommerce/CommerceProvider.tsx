import React, { Component } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { withCommerceData } from '@brandingbrand/fscommerce';


class CommerceView extends Component<any, any> {
  render(): JSX.Element {
    let content;
    if (!this.props.commerceData) {
      content = <ActivityIndicator />;
    } else {
      content = <Text>{this.props.commerceData}</Text>;
    }
    return (
      <View>
        {content}
      </View>
    );
  }
}

const Connected = withCommerceData<any, any>(async (datasource: any) => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello World');
    }, 3000);
  }).catch(err => {
    console.warn('This should never happen', err);
  });
})(CommerceView);

// tslint:disable
export default class CommerceProvider extends Component<any, any> {
  render(): JSX.Element {
    return (
      <Connected
        onDataLoaded={(data: any) => console.log(`data event:${data}`)}
        {...this.props}
      />
    );
  }
}
