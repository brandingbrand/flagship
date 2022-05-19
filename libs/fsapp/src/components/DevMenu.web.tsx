// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { LayoutComponent } from 'react-native-navigation';

import { omit } from 'lodash-es';

import { envs } from '../beta-app/env';
import EnvSwitcher from '../lib/env-switcher';
import type Navigator from '../lib/nav-wrapper.web';

import TouchableRow from './TouchableRow';
import type { GenericScreenProp } from './screenWrapper.web';

const activeEnv = envs[`${EnvSwitcher.envName}`] || envs.prod;
const hiddenEnvs: string[] = activeEnv?.hiddenEnvs || [];

const envsToDisplay: Record<string, string> = omit(envs, hiddenEnvs);

const styles = StyleSheet.create({
  bottomBtns: {
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 5,
  },
  closeBtn: {
    alignItems: 'center',
    backgroundColor: '#eee',
    flex: 1,
    height: 50,
    justifyContent: 'center',
    marginRight: 5,
  },
  closeBtnText: {
    color: '#333',
  },
  configView: { padding: 10 },
  configViewItem: {
    marginBottom: 10,
  },
  configViewText: {
    fontSize: 12,
  },
  configViewTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  devViewcontainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  envView: {
    flex: 1,
    padding: 10,
  },
  envViewText: {
    fontSize: 12,
  },
  reloadBtn: {
    alignItems: 'center',
    backgroundColor: '#555',
    flex: 1,
    height: 50,
    justifyContent: 'center',
    marginRight: 5,
  },
  reloadBtnText: {
    color: 'white',
  },
  switchBtns: {
    flexDirection: 'row',
    margin: 10,
  },
});

export interface DevMenuProp extends GenericScreenProp {
  navigator: Navigator;
}

export interface DevMenuState {
  devView: string;
  selectedEnv: string;
}

export default class DevMenu extends Component<DevMenuProp, DevMenuState> {
  public state: DevMenuState = {
    devView: 'menu',
    selectedEnv: 'prod',
  };

  private readonly renderDevMenu = () => {
    const { devMenuScreens = [] } = this.props.appConfig;

    return (
      <View style={styles.devViewcontainer}>
        <TouchableRow onPress={this.showDevView('app-config')} text="View App Config" />
        <TouchableRow onPress={this.showDevView('envSwitcher')} text="Env Switcher" />
        {devMenuScreens.map(this.renderCustomDevScreen)}
      </View>
    );
  };

  private readonly renderCustomDevScreen = (item: LayoutComponent, i: number) => (
    <TouchableRow key={i} onPress={this.pushToScreen(item)} text={item.name} />
  );

  private readonly renderAppConfig = () => {
    const { env } = this.props.appConfig;
    if (!env) {
      return <Text>No Env is defined.</Text>;
    }

    return (
      <View style={styles.configView}>
        {Object.keys(env).map((key, i) => (
          <View key={i} style={styles.configViewItem}>
            <Text style={styles.configViewTitle}>{key}</Text>
            <Text style={styles.configViewText}>{JSON.stringify(env[key], null, '  ')}</Text>
          </View>
        ))}
      </View>
    );
  };

  private readonly renderEnvSwitcher = () => {
    const currentEnv = EnvSwitcher.envName;

    return (
      <View style={styles.configView}>
        {Object.keys(envsToDisplay).map((env, i) => (
          <TouchableRow
            key={env}
            onPress={this.updateSelectedEnv(env)}
            text={`${env} ${currentEnv === env ? '[active]' : ''}`}
          />
        ))}
      </View>
    );
  };

  private readonly renderEnvDetail = () => {
    const env = envs[this.state.selectedEnv];

    return (
      <View style={styles.configViewItem}>
        <View style={styles.switchBtns}>
          <TouchableOpacity onPress={this.switchToSelectedEnv} style={styles.reloadBtn}>
            <Text style={styles.reloadBtnText}>Switch to [{this.state.selectedEnv}] env</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.updateSelectedEnv('')} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.envView}>
          <Text style={styles.envViewText}>{JSON.stringify(env, null, '  ')}</Text>
        </View>
      </View>
    );
  };

  private readonly updateSelectedEnv = (env: string) => () => {
    this.setState({
      devView: 'envDetail',
      selectedEnv: env,
    });
  };

  private readonly switchToSelectedEnv = () => {
    EnvSwitcher.envName = this.state.selectedEnv;
    this.dismissModal();
    if (typeof window !== 'undefined' && window.location && window.location.reload) {
      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  };

  private readonly dismissModal = () => {
    this.props.navigator.pop().catch((error) => {
      console.error(error);
    });
  };

  private readonly showDevView = (devView: string) => () => {
    this.setState({ devView });
  };

  private readonly pushToScreen = (component: LayoutComponent) => () => {
    this.props.navigator
      .push({
        component,
      })
      .catch((error) => {
        console.error('pushToScreen error', error);
      });
  };

  public render(): JSX.Element {
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
          <TouchableOpacity onPress={this.dismissModal} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
