// We don't need to worry about translating the element strings
// in this file since it should only be used in development

import React, { Component } from 'react';

import { DevSettings, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { LayoutComponent } from 'react-native-navigation';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { omit } from 'lodash-es';

import { envs } from '../beta-app/env';
import EnvSwitcher from '../lib/env-switcher';
import NativeConstants from '../lib/native-constants';
import type NavWrapper from '../lib/nav-wrapper';

import CodePushDevMenu from './CodePushDevMenu';
import StorageManager from './StorageManager';
import TouchableRow from './TouchableRow';
import type { GenericScreenProp } from './screenWrapper';

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
  navigator: NavWrapper;
}

export interface DevMenuState {
  devView: string;
  devKeepPage: boolean;
  selectedEnv: string;
}

export default class DevMenu extends Component<DevMenuProp, DevMenuState> {
  public state: DevMenuState = {
    devView: 'menu',
    selectedEnv: '',
    devKeepPage: false,
  };

  private readonly renderDevMenu = () => {
    const { devMenuScreens = [], env = {} } = this.props.appConfig;
    const codePushVisible = NativeConstants && NativeConstants.AppCenterToken && env.codepush;

    return (
      <View style={styles.devViewcontainer}>
        <TouchableRow
          onPress={this.keepLastPage}
          text={`Keep Last Page ${this.state.devKeepPage ? '[active]' : ''}`}
        />

        <TouchableRow
          onPress={this.showDevView('cookie-manager')}
          text="Cookie / AsyncStorage Manager"
        />
        <TouchableRow onPress={this.showDevView('envSwitcher')} text="Env Switcher" />
        <TouchableRow onPress={this.handleHideDevMenu} text="Hide Dev Menu" />
        {codePushVisible ? (
          <TouchableRow onPress={this.showDevView('codepush')} text="Codepush" />
        ) : null}

        {devMenuScreens.map(this.renderCustomDevScreen)}
      </View>
    );
  };

  private readonly renderCustomDevScreen = (item: LayoutComponent, i: number) => {
    const { name } = item;
    const title =
      item.options &&
      item.options.topBar &&
      item.options.topBar.title &&
      item.options.topBar.title.text;
    return <TouchableRow key={i} onPress={this.pushToScreen(item)} text={title || name} />;
  };

  private readonly keepLastPage = () => {
    if (this.state.devKeepPage) {
      this.setState({ devKeepPage: false });
      AsyncStorage.setItem('devKeepPage', '').catch((error) => {
        console.log('cannot set devKeepPage flag in AsyncStorage', error);
      });
    } else {
      this.setState({ devKeepPage: true });
      AsyncStorage.setItem('devKeepPage', 'true').catch((error) => {
        console.log('cannot set devKeepPage flag in AsyncStorage', error);
      });
    }
  };

  private readonly renderStorageManager = () => {
    const sInfoKeys = this.props.appConfig.env?.sInfoKeys || {};
    return (
      <View style={styles.devViewcontainer}>
        <StorageManager sInfoKeys={sInfoKeys} />
      </View>
    );
  };

  private readonly renderEnvSwitcher = () => {
    const currentEnv = EnvSwitcher.envName || 'prod';

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

  private readonly renderCodepush = () => <CodePushDevMenu appConfig={this.props.appConfig} />;

  private readonly handleHideDevMenu = () => {
    this.props.hideDevMenu();
    this.props.navigator.dismissModal().catch((error) => {
      console.warn('DevMenu DISMISSMODAL error:', error);
    });
  };

  private readonly restart = () => {
    this.props.hideDevMenu();
    this.props.navigator
      .dismissModal()
      .then(() => {
        DevSettings.reload();
      })
      .catch((error) => {
        console.warn('DevMenu DISMISSMODAL error:', error);
      });
  };

  private readonly dismissModal = () => {
    this.props.navigator.dismissModal().catch((error) => {
      console.log('DevMenu DISMISSMODAL error:', error);
    });
  };

  private readonly updateSelectedEnv = (env: string) => () => {
    this.setState({
      devView: 'envDetail',
      selectedEnv: env,
    });
  };

  private readonly switchToSelectedEnv = () => {
    EnvSwitcher.setEnv(this.state.selectedEnv).then(() => {
      this.restart();
    });
  };

  private readonly pushToScreen = (item: LayoutComponent) => () => {
    this.props.navigator.push({ component: item }).catch((error) => {
      console.log('DevMenu PUSH error:', error);
    });
  };

  private readonly showDevView = (devView: string) => () => {
    this.setState({ devView });
  };

  public componentDidMount(): void {
    AsyncStorage.getItem('devKeepPage')
      .then((devKeepPage) => {
        this.setState({
          devKeepPage: Boolean(devKeepPage),
        });
      })
      .catch((error) => {
        console.log('cannot get devKeepPage flag from AsyncStorage', error);
      });
  }

  public render(): JSX.Element {
    let view = this.renderDevMenu();

    if (this.state.devView === 'cookie-manager') {
      view = this.renderStorageManager();
    }

    if (this.state.devView === 'codepush') {
      view = this.renderCodepush();
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
          <TouchableOpacity onPress={this.restart} style={styles.reloadBtn}>
            <Text style={styles.reloadBtnText}>Reload JS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.dismissModal} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
