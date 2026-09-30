import {defineDevMenuScreen, DevMenu} from '@brandingbrand/code-app-env';
import {DataView} from '@brandingbrand/code-app-env/ui';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {HomeScreen, PermissionsScreen} from './screens';

export type RootStackParamList = {
  Home: undefined;
  Permissions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const safeArea = useSafeAreaInsets();

  return (
    <DevMenu style={{marginBottom: safeArea.bottom + 48}} screens={screens}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Permissions"
            component={PermissionsScreen}
            options={{title: 'Permissions'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DevMenu>
  );
}

const screens = [
  defineDevMenuScreen('Example Custom Screen', () => {
    return (
      <DataView
        title="Custom Title"
        content={{
          testProp: 'This is some data to display.',
          about: 'Anything could go in this code block!',
        }}
        actions={[{label: 'Test Button', onPress: () => {}}]}
      />
    );
  }),
];

const AppProvider = (props: any) => {
  return (
    <SafeAreaProvider>
      <App {...props} />
    </SafeAreaProvider>
  );
};

export default AppProvider;
