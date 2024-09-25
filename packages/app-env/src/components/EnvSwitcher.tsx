import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import AppRestart from '@brandingbrand/react-native-app-restart';
import React, {Fragment, PropsWithChildren, useMemo} from 'react';

import {envName, envs, setEnv as setNativeEnv} from '../lib/env';
import {createStateContext} from '../lib/context';
import {useDevMenu} from '../lib/hooks';

export namespace EnvSwitcher {
  export type RootProps = PropsWithChildren;
  export type ListProps = PropsWithChildren;
  export type ListItemProps = PropsWithChildren;
  export type ContentProps = PropsWithChildren;
  export type Context = string;
}

const [useEnvSwitcher, EnvSwitcherProvider] =
  createStateContext<EnvSwitcher.Context>(envName);

function Root({children}: EnvSwitcher.RootProps) {
  return <EnvSwitcherProvider>{children}</EnvSwitcherProvider>;
}

Root.displayName = 'RootEnvSwitcher';

function List({children}: EnvSwitcher.ListProps) {
  return (
    <Fragment>
      <Text style={listStyles.text}>Environments</Text>
      <ScrollView
        horizontal
        style={listStyles.container}
        contentContainerStyle={listStyles.contentContainer}>
        {children}
      </ScrollView>
    </Fragment>
  );
}

const listStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    width: '100%',
    height: 64,
    borderBottomWidth: 1,
    flexGrow: 0,
    borderBottomColor: 'lightgrey',
  },
  contentContainer: {
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    paddingHorizontal: 24,
  },
  text: {
    paddingTop: 12,
    paddingLeft: 12,
    fontWeight: 'bold',
  },
});

List.displayName = 'ListEnvSwitcher';

function ListItem({children}: EnvSwitcher.ListItemProps) {
  const [env, setEnv] = useEnvSwitcher();

  const isSelected = useMemo(() => {
    if (typeof children == 'string' && children === env) {
      return true;
    }

    return false;
  }, [env]);

  function onPress() {
    if (typeof children == 'string') {
      setEnv(children);
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        listItemStyles.container,
        isSelected && listItemStyles.selectedContainer,
      ]}>
      <Text
        style={[
          listItemStyles.text,
          isSelected && listItemStyles.selectedText,
        ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

ListItem.displayName = 'ListItemEnvSwitcher';

const listItemStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 42,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  text: {
    color: 'black',
  },
  selectedContainer: {
    backgroundColor: 'black',
  },
  selectedText: {
    color: 'white',
  },
});

function Content() {
  const [env] = useEnvSwitcher();

  const content = useMemo(() => {
    const data = (envs as any)[env];

    return JSON.stringify(data, null, 2);
  }, [env]);

  return (
    <Fragment>
      <Text style={contentStyles.text}>Environment</Text>
      <ScrollView style={contentStyles.contianer}>
        <Text style={contentStyles.contentText}>{content}</Text>
      </ScrollView>
    </Fragment>
  );
}

const contentStyles = StyleSheet.create({
  contianer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  text: {
    paddingLeft: 12,
    paddingVertical: 12,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 10,
    paddingBottom: 24,
  },
});

Content.displayName = 'ContentEnvSwitcher';

function Trigger() {
  const {onEnvChange} = useDevMenu();
  const [env] = useEnvSwitcher();

  async function onPress() {
    await onEnvChange?.(env);
    setNativeEnv(env);
    AppRestart.restartApplication();
  }

  return (
    <View style={triggerStyles.container}>
      <TouchableOpacity onPress={onPress} style={triggerStyles.button}>
        <Text style={triggerStyles.text}>Set Environment</Text>
      </TouchableOpacity>
    </View>
  );
}

const triggerStyles = StyleSheet.create({
  container: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    height: 72,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 12,
    backgroundColor: 'black',
    height: 48,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
});

Trigger.displayName = 'TriggerEnvSwitcher';

export function EnvSwitcher() {
  return (
    <Root>
      <List>
        {Object.keys(envs as Object).map(it => (
          <ListItem key={it}>{it}</ListItem>
        ))}
      </List>
      <Content />
      <Trigger />
    </Root>
  );
}

EnvSwitcher.displayName = 'EnvSwitcher';
