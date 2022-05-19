// We don't need to worry about translating the element strings
// in this file since it should only be used in development

import React, { useCallback, useMemo, useState } from 'react';

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useApp } from '../app';
import { envs } from '../env';
import { EnvSwitcher } from '../lib/env-switcher';
import { makeModal } from '../modal';
import type { Routes } from '../router';

import { TouchableRow } from './touchable-row.component';

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
    height: '100vh',
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

const extractDevRoutes = (routes?: Routes, prefix = ''): string[] =>
  routes?.reduce<string[]>(
    (prev, route) => [
      ...prev,
      ...((('component' in route || 'loadComponent' in route) && route.quickDevMenu) ||
      'children' in route
        ? [
            ...(('component' in route || 'loadComponent' in route) && route.quickDevMenu
              ? [`${prefix}/${route.path ?? ''}`]
              : []),
            ...('children' in route
              ? extractDevRoutes(
                  route.children,
                  'initialPath' in route ? '' : `${prefix}/${route.path ?? ''}`
                )
              : []),
          ]
        : []),
    ],
    []
  ) ?? [];

export const DevMenu = makeModal<'hide' | void>(({ reject, resolve }) => {
  const app = useApp();
  const currentEnv = useMemo(() => EnvSwitcher.envName, []);
  const devRoutes = useMemo(() => extractDevRoutes(app?.routes), [app]);
  const [devView, setDevView] = useState('menu');
  const [selectedEnv, setSelectedEnv] = useState(currentEnv);

  const hideDevMenu = useCallback(() => {
    resolve('hide');
  }, [resolve]);

  const updateDevView = (view: string) => () => {
    setDevView(view);
  };

  const updateSelectedEnv = (env: string) => () => {
    setDevView('envDetail');
    setSelectedEnv(env);
  };

  const switchToSelectedEnv = () => {
    EnvSwitcher.envName = selectedEnv;
    setTimeout(() => {
      window.location.reload();
    }, 0);
  };

  const pushToScreen = (path: string) => () => {
    app?.openUrl(path);
  };

  const renderCustomDevScreen = (path: string, i: number) => (
    <TouchableRow key={i} onPress={pushToScreen(path)}>
      {path}
    </TouchableRow>
  );

  const renderDevMenu = () => (
    <View>
      <TouchableRow onPress={updateDevView('app-config')}>View App Config</TouchableRow>
      <TouchableRow onPress={updateDevView('envSwitcher')}>Env Switcher</TouchableRow>
      {devRoutes.map(renderCustomDevScreen)}
    </View>
  );

  const renderAppConfig = () => {
    const config = envs[currentEnv];

    if (!config) {
      return (
        <View style={styles.configView}>
          <View style={styles.switchBtns}>
            <TouchableOpacity onPress={updateDevView('')} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text>No Env is defined.</Text>
        </View>
      );
    }

    return (
      <View style={styles.configView}>
        <View style={styles.switchBtns}>
          <TouchableOpacity onPress={updateDevView('')} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Back</Text>
          </TouchableOpacity>
        </View>

        {Object.keys(config).map((key, i) => (
          <View key={i} style={styles.configViewItem}>
            <Text style={styles.configViewTitle}>{key}</Text>
            <Text style={styles.configViewText}>{JSON.stringify(config[key], null, '  ')}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderEnvSwitcher = () => (
    <View style={styles.configView}>
      <View style={styles.switchBtns}>
        <TouchableOpacity onPress={updateDevView('')} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
      {Object.keys(envs).map((env, i) => (
        <TouchableRow key={env} onPress={updateSelectedEnv(env)}>{`${env} ${
          currentEnv === env ? '[active]' : ''
        }`}</TouchableRow>
      ))}
    </View>
  );

  const renderEnvDetail = () => {
    const env = envs[selectedEnv];

    return (
      <View style={styles.configViewItem}>
        <View style={styles.switchBtns}>
          <TouchableOpacity onPress={switchToSelectedEnv} style={styles.reloadBtn}>
            <Text style={styles.reloadBtnText}>Switch to [{selectedEnv}] env</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={updateDevView('envSwitcher')} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.envView}>
          <Text style={styles.envViewText}>{JSON.stringify(env, null, '  ')}</Text>
        </View>
      </View>
    );
  };

  const view = useMemo(() => {
    switch (devView) {
      case 'app-config':
        return renderAppConfig();
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
      <ScrollView>{view}</ScrollView>
      <View style={styles.bottomBtns}>
        <TouchableOpacity onPress={hideDevMenu} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Hide</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={reject} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
