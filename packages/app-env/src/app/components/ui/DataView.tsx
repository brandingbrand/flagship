import {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {tryDeepJSONParse} from '../../lib/data-parser';

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
  /**
   * Whether the action button should be disabled.
   *
   * @default false
   */
  disabled?: boolean;
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
   * Whether to attempt to deeply parse any JSON strings found within the content
   * before formatting it for display.
   *
   * @default true
   */
  deepParse?: boolean;
  /**
   * Optional title to display above the content.
   */
  title?: string;
}

export function DataView({
  actions,
  content,
  contentIndent = 2,
  deepParse,
  title,
}: DataViewProps) {
  const contentStr = useMemo(() => {
    // non-object primitives should be returned as-is
    if (typeof content !== 'object') {
      return content;
    }

    // objects should be traversed so that any unparsed JSON strings within them are formatted with consistent indentation.
    return JSON.stringify(
      deepParse ? tryDeepJSONParse(content) : content,
      null,
      contentIndent,
    );
  }, [content, contentIndent, deepParse]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {title ? <Text type="titleSm">{title}</Text> : null}
        <CodeBlock content={contentStr} />
      </View>
      {actions?.length ? (
        <View style={styles.actionRow}>
          {actions.map(({label, onPress, disabled}, index) => (
            <View key={index} style={styles.actionRow__column}>
              <Button type={disabled ? 'primaryDisabled' : 'primary'} disabled={disabled} onPress={onPress}>
                {label}
              </Button>
            </View>
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
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionRow__column: {
    flex: 1,
  }
});
