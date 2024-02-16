import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {request} from 'react-native-permissions';

type RequestCameraButtonProps = TouchableOpacityProps;

export function RequestCameraButton(props: RequestCameraButtonProps) {
  function onPress() {
    Platform.select({
      ios: request('ios.permission.CAMERA'),
      android: request('android.permission.CAMERA'),
    });
  }

  return (
    <TouchableOpacity {...props} onPress={onPress} style={styles.container}>
      <Text>Request Camera</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
