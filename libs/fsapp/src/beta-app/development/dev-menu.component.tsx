// We don't need to worry about translating the element strings
// in this file since it should only be used in development

import React, { useEffect, useMemo, useState } from 'react';

import { DevSettings, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { LayoutComponent } from 'react-native-navigation';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { omit } from 'lodash-es';

import { useApp } from '../app/context';
import type { IApp } from '../app/types';
import { envs } from '../env';
import { EnvSwitcher } from '../lib/env-switcher';
import { NativeConstants } from '../lib/native-constants';
import { makeModal } from '../modal';

import CodePushDevMenu from './code-push.component';
import StorageManager from './storage-manager.component';
import { TouchableRow } from './touchable-row.component';

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
  devViewContainer: {
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
  fullHeight: {
    height: '100%',
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

export const DevMenu = makeModal<'hide' | void>(({ reject, resolve }) => {
  const [devView, setDevView] = useState('menu');
  const [selectedEnv, setSelectedEnv] = useState('');
  const [devKeepPage, setDevKeepPage] = useState(false);
  const app: IApp | undefined = useApp();

  useEffect(() => {
    AsyncStorage.getItem('devKeepPage')
      .then((value) => {
        setDevKeepPage(value === 'true');
      })
      .catch((error) => {
        console.log('cannot get devKeepPage flag from AsyncStorage', error);
      });
  }, []);

  const handleHideDevMenu = () => {
    resolve('hide');
  };

  const restart = () => {
    resolve();
    // Reloading with a modal open causes the app to crash
    // this maybe fixed in a newer version of `react-native-navigation`
    // but for now just wait for it to close.
    setTimeout(() => {
      app?.config.onDestroy?.();
      DevSettings.reload();
    }, 1000);
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
    AsyncStorage.setItem('devKeepPage', `${devKeepPage}`).catch((error) => {
      console.log('cannot set devKeepPage flag in AsyncStorage', error);
    });
  };

  const renderCustomDevScreen = (item: LayoutComponent, i: number) => {
    const { name } = item;
    const title = item.options?.topBar?.title?.text;
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
        {codePushVisible ? (
          <TouchableRow onPress={showDevView('codepush')}>Codepush</TouchableRow>
        ) : null}

        {devMenuScreens.map(renderCustomDevScreen)}
      </View>
    );
  };

  const renderStorageManager = () => (
    <View style={styles.devViewContainer}>
      <StorageManager sInfoOptions={app?.config.sInfoOptions} />
    </View>
  );

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
          <TouchableOpacity onPress={switchToSelectedEnv} style={styles.reloadBtn}>
            <Text style={styles.reloadBtnText}>Switch to [{selectedEnv}] env</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={updateSelectedEnv('')} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.envView}>
          <Text style={styles.envViewText}>{JSON.stringify(env, null, '  ')}</Text>
        </View>
      </View>
    );
  };

  const renderCodePush = () => <CodePushDevMenu />;

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
        <TouchableOpacity onPress={restart} style={styles.reloadBtn}>
          <Text style={styles.reloadBtnText}>Reload JS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={reject} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
