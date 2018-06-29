/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GenericScreenProp } from './screenWrapper';
import TouchableRow from './TouchableRow';
import { Screen } from 'react-native-navigation';

const styles = StyleSheet.create({
  devViewcontainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  configView: { padding: 10 },
  configViewItem: {
    marginBottom: 10
  },
  configViewTitle: {
    fontSize: 12,
    fontWeight: '600'
  },
  configViewText: {
    fontSize: 12
  },
  bottomBtns: {
    flexDirection: 'row',
    marginLeft: 5,
    marginBottom: 5
  },
  closeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 50,
    flex: 1,
    marginRight: 5
  },
  reloadBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555',
    height: 50,
    flex: 1,
    marginRight: 5
  },
  closeBtnText: {
    color: '#333'
  },
  reloadBtnText: {
    color: 'white'
  }
});

export interface DevMenuState {
  devView: string;
}

export default class DevMenu extends Component<GenericScreenProp, DevMenuState> {
  state: DevMenuState = {
    devView: 'menu'
  };

  render(): JSX.Element {
    let view = this.renderDevMenu();

    if (this.state.devView === 'app-config') {
      view = this.renderAppConfig();
    }

    return (
      <View style={styles.devViewcontainer}>
        <ScrollView>{view}</ScrollView>

        <View style={styles.bottomBtns}>
          <TouchableOpacity style={styles.closeBtn} onPress={this.dismissModal}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderDevMenu = () => {
    const { devMenuScreens = [] } = this.props.appConfig;

    return (
      <View style={styles.devViewcontainer}>
        <TouchableRow text={`View App Config`} onPress={this.showDevView('app-config')} />
        {devMenuScreens.map(this.renderCustomDevScreen)}
      </View>
    );
  }

  renderCustomDevScreen = (item: Screen, i: number) => {
    return (
      <TouchableRow key={i} text={item.title || item.screen} onPress={this.pushToScreen(item)} />
    );
  }

  renderAppConfig = () => {
    const { env } = this.props.appConfig;
    if (!env) {
      return <Text>No Env is defined.</Text>;
    }

    return (
      <View style={styles.configView}>
        {Object.keys(env).map((key, i) => {
          return (
            <View style={styles.configViewItem} key={i}>
              <Text style={styles.configViewTitle}>{key}</Text>
              <Text style={styles.configViewText}>{JSON.stringify(env[key], null, '  ')}</Text>
            </View>
          );
        })}
      </View>
    );
  }

  dismissModal = () => {
    this.props.navigator.dismissModal();
  }

  showDevView = (devView: string) => () => {
    this.setState({ devView });
  }

  pushToScreen = (item: Screen) => () => {
    this.props.navigator.push(item);
  }
}
