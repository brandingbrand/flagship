import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {palette} from '../../lib/theme';

import {Text} from './Text';

export interface CodeBlockProps {
  content: string | string[];
}

// pre-calculated approximates used to prevent excessive layout shifts.
// These may differ slightly between devices, but should be close enough as a starting point.
const CHAR_DIMS_DEFAULT = Platform.select({
  ios: {
    width: 7.333332,
    height: 13.666672,
  },
  default: {
    width: 7.111111,
    height: 16.444443,
  },
});

export function CodeBlock({content}: CodeBlockProps) {
  const data = useMemo(() => {
    const lines = Array.isArray(content) ? content : content.split('\n');

    // New Arch doesn't handle extremely long lines as well as before,
    // so we truncate lines over 1000 characters to avoid performance issues.
    return lines.map(line => truncateLine(line));
  }, [content]);

  const [charDims, setCharDims] = useState<{
    width: number;
    height: number;
  }>(CHAR_DIMS_DEFAULT);

  const onLineNumberLayout = useCallback((event: any) => {
    // Normally we'd want to div this by the length of the text content, but because we only
    // hook this to the first line, we'll always measure the width of the `1` character.
    const {width, height} = event.nativeEvent.layout;
    setCharDims({width, height});
  }, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: charDims.height,
      offset: charDims.height * index,
      index,
    }),
    [charDims.height],
  );

  const lineGutterStyle = useMemo(
    () => [
      styles.codeBlock__lineGutter,
      {
        width: getLineGutterWidth(data.length, charDims.width),
      },
    ],
    [data.length, charDims.width],
  );

  const renderLine = useCallback(
    ({item, index}: ListRenderItemInfo<string>) => {
      return (
        <View style={styles.codeBlock__line}>
          <View style={lineGutterStyle}>
            <Text
              type="code"
              onLayout={index === 0 ? onLineNumberLayout : undefined}
              numberOfLines={1}>
              {index + 1}
            </Text>
          </View>
          <Text
            type="code"
            style={styles.codeBlock__lineContent}
            numberOfLines={1}>
            {item}
          </Text>
        </View>
      );
    },
    [lineGutterStyle],
  );

  return (
    <ScrollView
      horizontal
      style={styles.codeBlock}
      showsHorizontalScrollIndicator={false}>
      <FlatList
        data={data}
        renderItem={renderLine}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={24}
        contentContainerStyle={styles.codeBlock__contentContainer}></FlatList>
    </ScrollView>
  );
}

const keyExtractor = (_: string, index: number) => String(index);

const getLineGutterWidth = (totalLines: number, charWidth: number) =>
  Math.ceil(String(totalLines).length * charWidth);

const truncateLine = (line: string, maxLength: number = 1000) =>
  line.length <= maxLength ? line : `${line.slice(0, maxLength - 3)}...`;

const styles = StyleSheet.create({
  codeBlock: {
    flex: 1,
    backgroundColor: palette.neutralBgStrong,
    borderColor: palette.neutralBorder,
    borderWidth: 1,
  },
  codeBlock__contentContainer: {
    padding: 8,
  },
  codeBlock__line: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  codeBlock__lineGutter: {
    alignItems: 'flex-end',
    opacity: 0.55,
  },
  codeBlock__lineContent: {
    flex: 1,
    flexDirection: 'row',
  },
});
