// We don't need to worry about translating the element strings
// in this file since it should only be used in development

import React, { Component } from 'react';

import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore no type definition file
import * as CookieManager from 'react-native-cookies';
import type { RNSensitiveInfoOptions, SensitiveInfoEntry } from 'react-native-sensitive-info';
import SInfo from 'react-native-sensitive-info';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TouchableRow from './TouchableRow';

const styles = StyleSheet.create({
  closeBtn: {
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 50,
    justifyContent: 'center',
    marginRight: 5,
  },
});

export interface CookieMangerState {
  data: string | null;
}

export interface CookieMangerProps {
  sInfoKeys?: RNSensitiveInfoOptions;
}

export default class CookieManger extends Component<CookieMangerProps, CookieMangerState> {
  constructor(props: CookieMangerProps) {
    super(props);
    this.state = {
      data: null,
    };
  }

  private readonly showData = (data: string) => {
    this.setState({ data });
  };

  private readonly cleanData = () => {
    this.setState({ data: null });
  };

  private readonly clearCookies = () => {
    CookieManager.clearAll()
      .then(() => {
        alert('Cookie cleared.');
      })
      .catch((error: object) => {
        alert(`Cookie clear failed. Error: ${error}`);
      });
  };

  private readonly viewCookies = () => {
    if (Platform.OS !== 'ios') {
      alert('View Cookie is iOS only.');
      return;
    }

    CookieManager.getAll()
      .then((res: object) => {
        this.showData(JSON.stringify(res, null, '  '));
      })
      .catch((error: object) => {
        alert(`Cookie View failed. Error: ${error}`);
      });
  };

  private readonly clearAsyncStorage = () => {
    AsyncStorage.clear()
      .then(() => {
        alert('AsyncStorage cleared.');
      })
      .catch((error) => {
        alert(`AsyncStorage clear failed. Error: ${error}`);
      });
  };

  private readonly viewAsyncStorage = () => {
    AsyncStorage.getAllKeys()
      .then((keys) => {
        AsyncStorage.multiGet(keys)
          .then((stores) => {
            this.showData(JSON.stringify(stores, null, '  '));
          })
          .catch((error) => {
            console.log('cannot get multi values from AsyncStorage', error);
          });
      })
      .catch((error) => {
        console.log('cannot get all keys from AsyncStorage', error);
      });
  };

  private readonly clearSensitiveInfo = () => {
    SInfo.getAllItems(this.props.sInfoKeys || {})
      .then((values: [SensitiveInfoEntry[]]) => {
        if (!values || !values[0]) {
          alert('Nothing to be cleared.');
          return;
        }

        const keys = values[0].map((item: SensitiveInfoEntry) => item.key);

        Promise.all(keys.map(async (k: string) => SInfo.deleteItem(k, this.props.sInfoKeys || {})))
          .then(() => {
            alert(`Cleared: ${keys}`);
          })
          .catch((error) => {
            console.log('cannot delete item from react-native-sensitive-info', error);
          });
      })
      .catch((error) => {
        console.log('cannot get all items from react-native-sensitive-info', error);
      });
  };

  private readonly viewSensitiveInfo = () => {
    SInfo.getAllItems({})
      .then((values: [SensitiveInfoEntry[]]) => {
        this.showData(JSON.stringify(values, null, '  '));
      })
      .catch((error) => {
        console.warn('cannot view sensitive info', error);
      });
  };

  public render(): JSX.Element {
    return (
      <View style={{ flex: 1 }}>
        <TouchableRow onPress={this.clearCookies} text="Cookies - Clear" />
        <TouchableRow onPress={this.viewCookies} text="Cookies - View (iOS only)" />
        <TouchableRow onPress={this.clearAsyncStorage} text="AsyncStorage - Clear" />
        <TouchableRow onPress={this.viewAsyncStorage} text="AsyncStorage - View" />
        <TouchableRow onPress={this.clearSensitiveInfo} text="Sensitive Info - Clear" />
        <TouchableRow onPress={this.viewSensitiveInfo} text="Sensitive Info - View" />

        <Modal visible={Boolean(this.state.data)}>
          <ScrollView>
            <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
              <Text>{this.state.data}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity onPress={this.cleanData} style={styles.closeBtn}>
            <Text>OK</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
