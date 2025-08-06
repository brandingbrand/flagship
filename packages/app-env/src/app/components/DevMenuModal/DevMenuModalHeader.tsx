import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {useModal, useScreen} from '../../lib/context';
import {palette} from '../../lib/theme';
import {Text, TextIcon} from '../ui';

export function DevMenuModalHeader() {
  const [_, setVisible] = useModal();
  const [screen, setScreen] = useScreen();

  function onPressBack() {
    setScreen(null);
  }

  function onPressClose() {
    setVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {screen ? (
          <TouchableOpacity onPress={onPressBack}>
            <TextIcon type="arrowLeft" size={28} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text type="title">{screen?.Component.displayName ?? 'Dev Menu'}</Text>
      <View style={styles.right}>
        <TouchableOpacity onPress={onPressClose}>
          <TextIcon type="close" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: palette.neutralBorder,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
  right: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
});
