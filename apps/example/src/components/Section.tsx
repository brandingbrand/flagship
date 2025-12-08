import type {PropsWithChildren, ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';

export interface SectionProps extends PropsWithChildren {
  title: string;
}

export default function Section({children, title}: SectionProps): ReactNode {
  console.log(typeof children, children);
  return (
    <View style={styles.sectionContainer}>
      <Text type="primary" style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={styles.sectionDescription}>
        <Text type="secondary" style={styles.sectionText}>
          {children}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '400',
  },
});
