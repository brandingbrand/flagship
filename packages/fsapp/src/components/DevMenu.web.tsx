/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GenericScreenProp } from './screenWrapper';
import TouchableRow from './TouchableRow';
import { Screen } from 'react-native-navigation';
// @ts-ignore project_env_index ignore and will be changed by init
import projectEnvs from '../../project_env_index';
import EnvSwitcher from '../lib/env-switcher';

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
  },
  switchBtns: {
    flexDirection: 'row',
    margin: 10
  },
  envView: {
    padding: 10,
    flex: 1
  },
  envViewText: {
    fontSize: 12
  }
});

export interface DevMenuState {
  devView: string;
  selectedEnv: string;
}

export default class DevMenu extends Component<GenericScreenProp, DevMenuState> {
  state: DevMenuState = {
    devView: 'menu',
    selectedEnv: 'prod'
  };

  render(): JSX.Element {
    let view = this.renderDevMenu();

    if (this.state.devView === 'app-config') {
      view = this.renderAppConfig();
    }

    if (this.state.devView === 'envSwitcher') {
      view = this.renderEnvSwitcher();
    }

    if (this.state.devView === 'envDetail') {
      view = this.renderEnvDetail();
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
        <TouchableRow text={`Env Switcher`} onPress={this.showDevView('envSwitcher')} />
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

  renderEnvSwitcher = () => {
    const currentEnv = EnvSwitcher.envName;

    return (
      <View style={styles.configView}>
        {Object.keys(projectEnvs).map((env, i) => {
          return (
            <TouchableRow
              key={env}
              text={`${env} ${currentEnv === env ? '[active]' : ''}`}
              onPress={this.updateSelectedEnv(env)}
            />
          );
        })}
      </View>
    );
  }

  renderEnvDetail = () => {
    const env = projectEnvs[this.state.selectedEnv];

    return (
      <View style={styles.configViewItem}>
        <View style={styles.switchBtns}>
          <TouchableOpacity style={styles.reloadBtn} onPress={this.switchToSelectedEnv}>
            <Text style={styles.reloadBtnText}>Switch to [{this.state.selectedEnv}] env</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={this.updateSelectedEnv('')}>
            <Text style={styles.closeBtnText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.envView}>
          <Text style={styles.envViewText}>{JSON.stringify(env, null, '  ')}</Text>
        </View>
      </View>
    );
  }

  updateSelectedEnv = (env: string) => () => {
    this.setState({
      devView: 'envDetail',
      selectedEnv: env
    });
  }

  switchToSelectedEnv = () => {
    EnvSwitcher.envName = this.state.selectedEnv;
    if (typeof window !== 'undefined' && window.location && window.location.reload) {
      window.location.reload();
    }
  }

  dismissModal = () => {
    this.props.navigator.pop();
  }

  showDevView = (devView: string) => () => {
    this.setState({ devView });
  }

  pushToScreen = (item: Screen) => () => {
    this.props.navigator.push(item);
  }
}
