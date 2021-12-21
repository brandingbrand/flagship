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

import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  closeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 50,
    marginRight: 5,
  },
});

// @ts-ignore no type definition file
import * as CookieManager from 'react-native-cookies';
// @ts-ignore no type definition file
import SInfo, { RNSensitiveInfoOptions, SensitiveInfoEntry } from 'react-native-sensitive-info';

import { TouchableRow } from './touchable-row.component';

export interface CookieManagerProps {
  sInfoOptions?: RNSensitiveInfoOptions;
}

export interface CookieMangerState {
  data: string | null;
}

export default class CookieManger extends Component<CookieManagerProps, CookieMangerState> {
  state: CookieMangerState = {
    data: null,
  };

  showData = (data: string) => {
    this.setState({ data });
  };

  cleanData = () => {
    this.setState({ data: null });
  };

  render(): JSX.Element {
    return (
      <View style={{ flex: 1 }}>
        <TouchableRow onPress={this.clearCookies}>Cookies - Clear</TouchableRow>
        <TouchableRow onPress={this.viewCookies}>Cookies - View (iOS only)</TouchableRow>
        <TouchableRow onPress={this.clearAsyncStorage}>AsyncStorage - Clear</TouchableRow>
        <TouchableRow onPress={this.viewAsyncStorage}>AsyncStorage - View</TouchableRow>
        <TouchableRow onPress={this.clearSensitiveInfo}>Sensitive Info - Clear</TouchableRow>
        <TouchableRow onPress={this.viewSensitiveInfo}>Sensitive Info - View</TouchableRow>

        <Modal visible={!!this.state.data}>
          <ScrollView>
            <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
              <Text>{this.state.data}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={this.cleanData}>
            <Text>OK</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  clearCookies = () => {
    CookieManager.clearAll()
      .then(() => {
        alert('Cookie cleared.');
      })
      .catch((err: object) => {
        return alert(`Cookie clear failed. Error: ${err}`);
      });
  };

  viewCookies = () => {
    if (Platform.OS !== 'ios') {
      return alert('View Cookie is iOS only.');
    }

    CookieManager.getAll()
      .then((res: object) => {
        this.showData(JSON.stringify(res, null, '  '));
      })
      .catch((err: object) => {
        return alert(`Cookie View failed. Error: ${err}`);
      });
  };

  clearAsyncStorage = () => {
    AsyncStorage.clear()
      .then(() => {
        alert('AsyncStorage cleared.');
      })
      .catch((err) => {
        alert(`AsyncStorage clear failed. Error: ${err}`);
      });
  };

  viewAsyncStorage = () => {
    AsyncStorage.getAllKeys()
      .then((keys) => {
        AsyncStorage.multiGet(keys)
          .then((stores) => {
            this.showData(JSON.stringify(stores, null, '  '));
          })
          .catch((e) => console.log('cannot get multi values from AsyncStorage', e));
      })
      .catch((e) => console.log('cannot get all keys from AsyncStorage', e));
  };

  clearSensitiveInfo = () => {
    SInfo.getAllItems(this.props.sInfoOptions ?? {})
      .then((values: [SensitiveInfoEntry[]]) => {
        if (!values || !values[0]) {
          return alert('Nothing to be cleared.');
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
          .catch((e) => console.log('cannot delete item from react-native-sensitive-info', e));
      })
      .catch((e) => console.log('cannot get all items from react-native-sensitive-info', e));
  };

  viewSensitiveInfo = () => {
    SInfo.getAllItems({})
      .then((values: [SensitiveInfoEntry[]]) => {
        this.showData(JSON.stringify(values, null, '  '));
      })
      .catch((e) => console.warn('cannot view sensitive info', e));
  };
}
