import React from 'react';
import { NativeModules, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

const styles = StyleSheet.create({
  row: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    padding: 15,
    paddingHorizontal: 10
  },
  configView: { padding: 10 },
})

interface Props {
  restart: () => void;
}

export const EnvironmentSwitcher: React.FC<Props> = (props) => {
  const onPress = (e: string) => {
    env.current = e;
    props.restart();
  }

  // TODO: Pull these from env index once that is available
  const envs = ['dev', 'prod'];

  return (
    <View style={styles.configView}>
      {envs.map((e, i) => (
        <TouchableHighlight
          key={e}
          onPress={() => onPress(e)}
          style={styles.row}
          underlayColor='#eee'
        >
          <Text>{`${e} ${env.current === e ? '[active]' : ''}`}</Text>
        </TouchableHighlight>
      ))}
    </View>
  )
}

export const env = {
  get current(): string {
    return NativeModules.Env.envName;
  },

  set current(value: string) {
    NativeModules.Env.setEnv(value);
  }
}