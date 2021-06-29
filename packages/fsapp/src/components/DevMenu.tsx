/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development

import React, { Component } from 'react';
import { DevSettings, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GenericScreenProp } from './screenWrapper';
import CodePushDevMenu from './CodePushDevMenu';
import NativeConstants from '../lib/native-constants';
import EnvSwitcher from '../lib/env-switcher';
import StorageManager from './StorageManager';
import TouchableRow from './TouchableRow';
import { LayoutComponent } from 'react-native-navigation';
// @ts-ignore project_env_index ignore and will be changed by init
import projectEnvs from '../../project_env_index';
import NavWrapper from '../lib/nav-wrapper';

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
  envView: {
    padding: 10,
    flex: 1
  },
  envViewText: {
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
  }
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
  state: DevMenuState = {
    devView: 'menu',
    selectedEnv: '',
    devKeepPage: false
  };

  render(): JSX.Element {
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
          <TouchableOpacity style={styles.reloadBtn} onPress={this.restart}>
            <Text style={styles.reloadBtnText}>Reload JS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={this.dismissModal}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  componentDidMount(): void {
    AsyncStorage.getItem('devKeepPage')
      .then(devKeepPage => {
        this.setState({
          devKeepPage: !!devKeepPage
        });
      })
      .catch(e => console.log('cannot get devKeepPage flag from AsyncStorage', e));
  }

  renderDevMenu = () => {
    const { devMenuScreens = [], env = {} } = this.props.appConfig;
    const codePushVisible = NativeConstants && NativeConstants.AppCenterToken && env.codepush;

    return (
      <View style={styles.devViewcontainer}>
        <TouchableRow
          text={`Keep Last Page ${this.state.devKeepPage ? '[active]' : ''}`}
          onPress={this.keepLastPage}
        />

        <TouchableRow
          text={`Cookie / AsyncStorage Manager`}
          onPress={this.showDevView('cookie-manager')}
        />
        <TouchableRow text={`Env Switcher`} onPress={this.showDevView('envSwitcher')} />
        <TouchableRow text={`Hide Dev Menu`} onPress={this.handleHideDevMenu} />
        {codePushVisible && (
          <TouchableRow text={`Codepush`} onPress={this.showDevView('codepush')} />
        )}

        {devMenuScreens.map(this.renderCustomDevScreen)}
      </View>
    );
  }

  renderCustomDevScreen = (item: LayoutComponent, i: number) => {
    const name = item.name;
    const title = item.options && item.options.topBar &&
      item.options.topBar.title && item.options.topBar.title.text;
    return (
      <TouchableRow key={i} text={title || name} onPress={this.pushToScreen(item)} />
    );
  }

  keepLastPage = () => {
    if (this.state.devKeepPage) {
      this.setState({ devKeepPage: false });
      AsyncStorage.setItem('devKeepPage', '').catch(e =>
        console.log('cannot set devKeepPage flag in AsyncStorage', e)
      );
    } else {
      this.setState({ devKeepPage: true });
      AsyncStorage.setItem('devKeepPage', 'true').catch(e =>
        console.log('cannot set devKeepPage flag in AsyncStorage', e)
      );
    }
  }

  renderStorageManager = () => {
    return (
      <View style={styles.devViewcontainer}>
        <StorageManager />
      </View>
    );
  }

  renderEnvSwitcher = () => {
    const currentEnv = EnvSwitcher.envName || 'prod';

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

  renderCodepush = () => {
    return <CodePushDevMenu appConfig={this.props.appConfig} />;
  }

  handleHideDevMenu = () => {
    this.props.hideDevMenu();
    this.props.navigator.dismissModal()
      .catch(err => console.warn('DevMenu DISMISSMODAL error: ', err));
  }

  restart = () => {
    this.props.hideDevMenu();
    this.props.navigator.dismissModal()
      .then(() => {
        DevSettings.reload();
      })
      .catch(err => console.warn('DevMenu DISMISSMODAL error: ', err));
  }

  dismissModal = () => {
    this.props.navigator.dismissModal()
      .catch(err => console.log('DevMenu DISMISSMODAL error: ', err));
  }

  updateSelectedEnv = (env: string) => () => {
    this.setState({
      devView: 'envDetail',
      selectedEnv: env
    });
  }

  switchToSelectedEnv = () => {
    EnvSwitcher.setEnv(this.state.selectedEnv).then(() => {
      this.restart();
    });
  }

  pushToScreen = (item: LayoutComponent) => () => {
    this.props.navigator.push({ component: item })
      .catch(err => console.log('DevMenu PUSH error: ', err));
  }

  showDevView = (devView: string) => () => {
    this.setState({ devView });
  }
}
