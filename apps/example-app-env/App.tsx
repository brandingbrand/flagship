import {DevMenu, env, FlagshipEnv} from '@brandingbrand/code-app-env';
import {AsyncStorage} from '@brandingbrand/code-app-env/screens/AsyncStorage';
import React from 'react';
import {
  Text as RNText,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextProps,
  useColorScheme,
  View,
} from 'react-native';

function Text({children, style, ...restProps}: TextProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const colorStyle = {color: isDarkMode ? 'white' : 'black'};

  return (
    <RNText {...restProps} style={[colorStyle, style]}>
      {children}
    </RNText>
  );
}

const DevMenuScreens = [AsyncStorage];

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
  };

  console.log(FlagshipEnv.envs);

  return (
    <SafeAreaView style={backgroundStyle}>
      <DevMenu style={styles.devMenu} screens={DevMenuScreens}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Flagship Environment Demo</Text>
          <View>
            <Text>{`Current Environment: ${FlagshipEnv.envName}`}</Text>
          </View>
          <Text>{`env.id: ${env.id}`}</Text>
          <Text>{`env.domain: ${env.domain}s`}</Text>
        </ScrollView>
      </DevMenu>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  devMenu: {
    marginBottom: 48,
  },
});

export default App;
