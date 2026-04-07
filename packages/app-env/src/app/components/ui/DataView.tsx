import {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {Button} from './Button';
import {CodeBlock} from './CodeBlock';
import {Text} from './Text';

export interface DataViewAction {
  /**
   * The label for the action button.
   *
   * Must be a unique string, as it is used as a key.
   */
  label: string;
  /**
   * The function to call when the action button is pressed.
   */
  onPress: () => void;
}

export interface DataViewProps {
  /**
   * Optional actions to display as buttons below the content.
   */
  actions?: DataViewAction[];
  /**
   * Any JSON Serializable data to display.
   *
   * If the content is a string, it will be displayed as-is.
   * Otherwise, it will be stringified with indentation.
   */
  content: any;
  /**
   * Number of spaces to indent the JSON content.
   *
   * @default 2
   */
  contentIndent?: number;
  /**
   * Optional title to display above the content.
   */
  title?: string;
}

export function DataView({
  actions,
  content,
  contentIndent = 2,
  title,
}: DataViewProps) {
  const contentStr = useMemo(() => {
    if (typeof content === 'string') {
      return content;
    }
    return JSON.stringify(content, null, contentIndent);
  }, [content, contentIndent]);
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {title ? <Text type="titleSm">{title}</Text> : null}
        <CodeBlock content={contentStr} />
      </View>
      {actions?.length ? (
        <View style={styles.buttonContainer}>
          {actions.map(({label, onPress}) => (
            <Button key={label} onPress={onPress}>
              {label}
            </Button>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  contentContainer: {
    gap: 8,
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
