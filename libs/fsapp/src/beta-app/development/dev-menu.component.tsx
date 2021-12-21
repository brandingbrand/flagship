// We don't need to worry about translating the element strings
// in this file since it should only be used in development

import type { LayoutComponent } from 'react-native-navigation';

import React, { useEffect, useMemo, useState } from 'react';
import { DevSettings, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { omit } from 'lodash-es';

import { envs } from '../env';
import { makeModal } from '../modal';
import { EnvSwitcher } from '../lib/env-switcher';
import { NativeConstants } from '../lib/native-constants';
import { useApp } from '../app/context';
import type { IApp } from '../app/types';

import CodePushDevMenu from './code-push.component';
import StorageManager from './storage-manager.component';
import { TouchableRow } from './touchable-row.component';

const activeEnv = envs[`${EnvSwitcher.envName}`] || envs.prod;
const hiddenEnvs: string[] = activeEnv.hiddenEnvs || [];

const envsToDisplay: {
  [key: string]: string;
} = omit(envs, hiddenEnvs);

const styles = StyleSheet.create({
  devViewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullHeight: {
    height: '100%',
  },
  configView: { padding: 10 },
  configViewItem: {
    marginBottom: 10,
  },
  configViewTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  configViewText: {
    fontSize: 12,
  },
  envView: {
    padding: 10,
    flex: 1,
  },
  envViewText: {
    fontSize: 12,
  },
  bottomBtns: {
    flexDirection: 'row',
    marginLeft: 5,
    marginBottom: 5,
  },
  closeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 50,
    flex: 1,
    marginRight: 5,
  },
  reloadBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555',
    height: 50,
    flex: 1,
    marginRight: 5,
  },
  closeBtnText: {
    color: '#333',
  },
  reloadBtnText: {
    color: 'white',
  },
  switchBtns: {
    flexDirection: 'row',
    margin: 10,
  },
});

export const DevMenu = makeModal(({ reject, resolve }) => {
  const [devView, setDevView] = useState('menu');
  const [selectedEnv, setSelectedEnv] = useState('');
  const [devKeepPage, setDevKeepPage] = useState(false);
  const app: IApp | undefined = useApp();

  useEffect(() => {
    AsyncStorage.getItem('devKeepPage')
      .then((value) => {
        setDevKeepPage(value === 'true');
      })
      .catch((e) => console.log('cannot get devKeepPage flag from AsyncStorage', e));
  }, []);

  const handleHideDevMenu = () => {
    resolve();
  };

  const restart = () => {
    resolve();
    DevSettings.reload();
  };

  const updateSelectedEnv = (env: string) => () => {
    setDevView('envDetail');
    setSelectedEnv(env);
  };

  const switchToSelectedEnv = () => {
    EnvSwitcher.setEnv(selectedEnv).then(() => {
      restart();
    });
  };

  const pushToScreen = (item: LayoutComponent) => () => {
    // Push to screen
  };

  const showDevView = (devView: string) => () => {
    setDevView(devView);
  };

  const keepLastPage = () => {
    setDevKeepPage(!devKeepPage);
    AsyncStorage.setItem('devKeepPage', `${devKeepPage}`).catch((e) =>
      console.log('cannot set devKeepPage flag in AsyncStorage', e)
    );
  };

  const renderCustomDevScreen = (item: LayoutComponent, i: number) => {
    const name = item.name;
    const title = item?.options?.topBar?.title?.text;
    return (
      <TouchableRow key={i} onPress={pushToScreen(item)}>
        {title ?? name}
      </TouchableRow>
    );
  };

  const renderDevMenu = () => {
    // TODO: Env and screen
    const { devMenuScreens = [], env = {} } = {} as any;

    const codePushVisible = NativeConstants && NativeConstants.AppCenterToken && env.codepush;

    return (
      <View style={styles.devViewContainer}>
        <TouchableRow onPress={keepLastPage}>{`Keep Last Page ${
          devKeepPage ? '[active]' : ''
        }`}</TouchableRow>

        <TouchableRow onPress={showDevView('cookie-manager')}>
          Cookie / AsyncStorage Manager
        </TouchableRow>
        <TouchableRow onPress={showDevView('envSwitcher')}>Env Switcher</TouchableRow>
        <TouchableRow onPress={handleHideDevMenu}>Hide Dev Menu</TouchableRow>
        {codePushVisible && <TouchableRow onPress={showDevView('codepush')}>Codepush</TouchableRow>}

        {devMenuScreens.map(renderCustomDevScreen)}
      </View>
    );
  };

  const renderStorageManager = () => {
    return (
      <View style={styles.devViewContainer}>
        <StorageManager sInfoOptions={app?.config?.sInfoOptions} />
      </View>
    );
  };

  const renderEnvSwitcher = () => {
    const currentEnv = EnvSwitcher.envName || 'prod';

    return (
      <View style={styles.configView}>
        {Object.keys(envsToDisplay).map((env, i) => (
          <TouchableRow key={env} onPress={updateSelectedEnv(env)}>
            {`${env} ${currentEnv === env ? '[active]' : ''}`}
          </TouchableRow>
        ))}
      </View>
    );
  };

  const renderEnvDetail = () => {
    const env = envs[selectedEnv];

    return (
      <View style={styles.configViewItem}>
        <View style={styles.switchBtns}>
          <TouchableOpacity style={styles.reloadBtn} onPress={switchToSelectedEnv}>
            <Text style={styles.reloadBtnText}>Switch to [{selectedEnv}] env</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={updateSelectedEnv('')}>
            <Text style={styles.closeBtnText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.envView}>
          <Text style={styles.envViewText}>{JSON.stringify(env, null, '  ')}</Text>
        </View>
      </View>
    );
  };

  const renderCodePush = () => {
    return <CodePushDevMenu />;
  };

  const view = useMemo(() => {
    switch (devView) {
      case 'cookie-manager':
        return renderStorageManager();
      case 'codepush':
        return renderCodePush();
      case 'envSwitcher':
        return renderEnvSwitcher();
      case 'envDetail':
        return renderEnvDetail();
      default:
        return renderDevMenu();
    }
  }, [devView]);

  return (
    <View style={styles.devViewContainer}>
      <ScrollView style={styles.fullHeight}>{view}</ScrollView>

      <View style={styles.bottomBtns}>
        <TouchableOpacity style={styles.reloadBtn} onPress={restart}>
          <Text style={styles.reloadBtnText}>Reload JS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn} onPress={reject}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
