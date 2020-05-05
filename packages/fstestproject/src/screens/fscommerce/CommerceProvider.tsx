import React, { Component } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import {withCommerceData} from '@brandingbrand/fscommerce';

interface CommerceViewProps {
  commerceData: string;
}

class CommerceView extends Component<CommerceViewProps> {
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
// TODO: check FetchDataFunction
const Connected = withCommerceData<any, any>(async () => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello World');
    }, 3000);
  }).catch(err => {
    console.warn('This should never happen', err);
  });
})(CommerceView);

// tslint:disable-next-line:max-classes-per-file
class CommerceProvider extends Component<any, any> {
  dataLoader = (data: string) => (): void => {
    return console.log(`data event:${data}`);
  }

  render(): JSX.Element {
    return (
      <Connected
        onDataLoaded={this.dataLoader}
        {...this.props}
      />
    );
  }
}

export default CommerceProvider;
