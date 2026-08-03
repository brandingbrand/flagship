import React, {useCallback, useEffect, useState} from 'react';
import {Button, Platform, ScrollView, View} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  type PermissionStatus,
} from 'react-native-permissions';

import {Section, Text} from '../components';
import {createStyleSheet} from '../lib/theme';

const CAMERA = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  default: PERMISSIONS.ANDROID.CAMERA,
});

/**
 * Demonstrates the camera permission configured through
 * `@brandingbrand/code-plugin-permissions`: the plugin injects the native
 * declarations at prebuild, and this screen exercises them at runtime.
 */
function PermissionsScreen(): React.JSX.Element {
  const styles = useStyles();
  const [status, setStatus] = useState<PermissionStatus | 'unknown'>('unknown');

  useEffect(() => {
    check(CAMERA).then(setStatus);
  }, []);

  const requestCamera = useCallback(() => {
    request(CAMERA).then(setStatus);
  }, []);

  return (
    <ScrollView style={styles.background}>
      <View style={styles.content}>
        <Section title="Camera Permission">
          {`The camera permission below is declared natively by the permissions plugin during prebuild.\n\nCurrent status: `}
          <Text style={styles.highlight}>{status}</Text>
        </Section>
        <Button title="Request Camera Permission" onPress={requestCamera} />
      </View>
    </ScrollView>
  );
}

const useStyles = createStyleSheet(palette => ({
  background: {
    backgroundColor: palette.bgSecondary,
    flex: 1,
  },
  content: {
    paddingVertical: 24,
    gap: 24,
  },
  highlight: {
    fontWeight: '700',
  },
}));

export default PermissionsScreen;
