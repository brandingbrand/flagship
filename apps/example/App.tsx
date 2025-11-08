/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {NewAppScreen} from '@react-native/new-app-screen';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {DevMenu} from '@brandingbrand/code-app-env';

function App() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen templateFileName="App.tsx" />
      <DevMenu style={{marginBottom: safeArea.bottom}} />
    </View>
  );
}

const AppProvider = memo(() => {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppProvider;
