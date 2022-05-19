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

import { TouchableRow } from './touchable-row.component';

const styles = StyleSheet.create({
  closeBtn: {
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 50,
    justifyContent: 'center',
    marginRight: 5,
  },
});

export interface CookieManagerProps {
  sInfoOptions?: RNSensitiveInfoOptions;
}

export interface CookieMangerState {
  data: string | null;
}

export default class CookieManger extends Component<CookieManagerProps, CookieMangerState> {
  public state: CookieMangerState = {
    data: null,
  };

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
    SInfo.getAllItems(this.props.sInfoOptions ?? {})
      .then((values: [SensitiveInfoEntry[]]) => {
        if (!values || !values[0]) {
          alert('Nothing to be cleared.');
          return;
        }

        const keys = values[0].map((item: SensitiveInfoEntry) => item.key);

        Promise.all(
          values[0].map(async (entry) =>
            SInfo.deleteItem(
              entry.key,
              this.props.sInfoOptions ?? { keychainService: entry.service }
            )
          )
        )
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

  public readonly viewSensitiveInfo = () => {
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
        <TouchableRow onPress={this.clearCookies}>Cookies - Clear</TouchableRow>
        <TouchableRow onPress={this.viewCookies}>Cookies - View (iOS only)</TouchableRow>
        <TouchableRow onPress={this.clearAsyncStorage}>AsyncStorage - Clear</TouchableRow>
        <TouchableRow onPress={this.viewAsyncStorage}>AsyncStorage - View</TouchableRow>
        <TouchableRow onPress={this.clearSensitiveInfo}>Sensitive Info - Clear</TouchableRow>
        <TouchableRow onPress={this.viewSensitiveInfo}>Sensitive Info - View</TouchableRow>

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
