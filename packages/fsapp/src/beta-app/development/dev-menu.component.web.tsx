/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development

import type { Routes } from '../router';

import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { envs } from '../env';
import { makeModal } from '../modal';
import { EnvSwitcher } from '../lib/env-switcher';

import { TouchableRow } from './touchable-row.component';
import { useApp } from '../app';

const styles = StyleSheet.create({
  devViewContainer: {
    backgroundColor: 'white',
    height: '100vh'
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

const extractDevRoutes = (routes?: Routes, prefix: string= ''): string[] => {
  return (
    routes?.reduce<string[]>(
      (prev, route) => [
        ...prev,
        ...((('component' in route || 'loadComponent' in route) && route.quickDevMenu) ||
        'children' in route
          ? [
            (('component' in route || 'loadComponent' in route) && route.quickDevMenu)
              ? `${prefix}/${route.path ?? ''}`
              : '',
            ...('children' in route
                ? extractDevRoutes(
                    route.children,
                    'initialPath' in route ? '' : `${prefix}/${route.path ?? ''}`
                  )
                : [])
          ]
          : [])
      ],
      []
    ).filter(path => path) ?? []
  );
};

export const DevMenu = makeModal(({ reject }) => {
  const app = useApp();
  const currentEnv = useMemo(() => EnvSwitcher.envName, []);
  const devRoutes = useMemo(() => extractDevRoutes(app?.routes), [app]);
  const [devView, setDevView] = useState('menu');
  const [selectedEnv, setSelectedEnv] = useState(currentEnv);

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
      window?.location?.reload();
    }, 0);
  };

  const pushToScreen = (path: string) => () => {
    app?.openUrl(path);
  };

  const renderCustomDevScreen = (path: string, i: number) => {
    return <TouchableRow key={i} onPress={pushToScreen(path)}>{path}</TouchableRow>;
  };

  const renderDevMenu = () => {
    return (
        <View>
          <TouchableRow onPress={updateDevView('app-config')}>View App Config</TouchableRow>
          <TouchableRow onPress={updateDevView('envSwitcher')}>Env Switcher</TouchableRow>
          {devRoutes.map(renderCustomDevScreen)}
        </View>
    );
  };

  const renderAppConfig = () => {
    const config = envs[currentEnv];

    if (!config) {
      return (
        <View style={styles.configView}>
          <View style={styles.switchBtns}>
            <TouchableOpacity style={styles.closeBtn} onPress={updateDevView('')}>
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
          <TouchableOpacity style={styles.closeBtn} onPress={updateDevView('')}>
            <Text style={styles.closeBtnText}>Back</Text>
          </TouchableOpacity>
        </View>

        {Object.keys(config).map((key, i) => {
          return (
            <View style={styles.configViewItem} key={i}>
              <Text style={styles.configViewTitle}>{key}</Text>
              <Text style={styles.configViewText}>{JSON.stringify(config[key], null, '  ')}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderEnvSwitcher = () => {
    return (
      <View style={styles.configView}>
        <View style={styles.switchBtns}>
          <TouchableOpacity style={styles.closeBtn} onPress={updateDevView('')}>
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
  };

  const renderEnvDetail = () => {
    const env = envs[selectedEnv];

    return (
      <View style={styles.configViewItem}>
        <View style={styles.switchBtns}>
          <TouchableOpacity style={styles.reloadBtn} onPress={switchToSelectedEnv}>
            <Text style={styles.reloadBtnText}>Switch to [{selectedEnv}] env</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={updateDevView('envSwitcher')}>
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
        <TouchableOpacity style={styles.closeBtn} onPress={reject}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
