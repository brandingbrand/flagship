import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {env, FlagshipEnv} from '@brandingbrand/code-app-env';
import React from 'react';
import {Button, ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Header, Section, Text} from '../components';
import {createStyleSheet} from '../lib/theme';
import type {RootStackParamList} from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({navigation}: Props): React.JSX.Element {
  const safeArea = useSafeAreaInsets();
  const styles = useStyles();

  return (
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
        <Button
          title="Permissions Example"
          onPress={() => navigation.navigate('Permissions')}
        />
      </View>
    </ScrollView>
  );
}

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

export default HomeScreen;
