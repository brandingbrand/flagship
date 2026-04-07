import {
  defineDevMenuScreen,
  DevMenu,
  env,
  FlagshipEnv,
} from '@brandingbrand/code-app-env';
import {DataView, DataViewAction} from '@brandingbrand/code-app-env/ui';
import React, {useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {Header, Section, Text} from './components';
import {createStyleSheet} from './lib/theme';

function App(): React.JSX.Element {
  const safeArea = useSafeAreaInsets();
  const styles = useStyles();

  return (
    <DevMenu style={{marginBottom: safeArea.bottom + 48}} screens={screens}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        style={styles.background}
        contentContainerStyle={styles.contentContainer}>
        <Header style={{paddingTop: safeArea.top + 64}} />
        <View style={styles.content}>
          <Section title="Next Steps...">
            {`Edit `}
            <Text style={styles.highlight}>src/App.tsx</Text>
            {` to change this screen.\nYour changes will be automatically applied after saving.`}
          </Section>
          <Section title="Env Details">
            {`App Environment: ${FlagshipEnv.envName}\nID: ${env.id}\nDomain: ${env.domain}`}
          </Section>
        </View>
      </ScrollView>
    </DevMenu>
  );
}

const screens = [
  defineDevMenuScreen('Example Custom Screen', () => {
    const [deepParse, setDeepParse] = useState(false);
    const [secondButtonDisabled, setSecondButtonDisabled] = useState(false);

    const actions = useMemo<DataViewAction[]>(
      () => [
        {
          label: deepParse ? 'Disable Deep Parse' : 'Enable Deep Parse',
          onPress: () => {
            setDeepParse(prev => !prev);
          },
        },
        {
          label: 'Test Button\nPlease Ignore',
          onPress: () => {
            console.log('Test Button Pressed');
            setSecondButtonDisabled(true);
          },
          disabled: secondButtonDisabled,
        }
      ],
      [deepParse, secondButtonDisabled],
    );

    return (
      <DataView
        title="Custom Title"
        deepParse={deepParse}
        content={exampleCustomScreenContent}
        actions={actions}
      />
    );
  }),
];

const exampleCustomScreenContent = {
  testProp: 'This is some data to display.',
  about: 'Anything could go in this code block!',
  nestedJSONStr: `{
    "nestedProp": "In code, this property is within a JSON object string. It should appear to be an object when displayed in the data viewer",
    "doubleNestedJSONStr": "{\\"doubleNestedProp\\": \\"This is a double nested JSON object inside the first nested JSON string.\\"}"
  }`,
};

const useStyles = createStyleSheet(palette => ({
  background: {
    backgroundColor: palette.bg,
    flex: 1,
  },
  contentContainer: {
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

const AppProvider = (props: any) => {
  return (
    <SafeAreaProvider>
      <App {...props} />
    </SafeAreaProvider>
  );
};

export default AppProvider;
