import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { EngagementContext } from '../lib/contexts';
import { TextBlock } from './TextBlock';

const styles = StyleSheet.create({
  titleContainer: {
    flex: 3,
    alignItems: 'flex-start'
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  linkContainer: {
    flex: 1,
    alignItems: 'flex-end'
  }
});

export interface TitleWithLinkProps {
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
  titleContainer?: StyleProp<TextStyle>;
}

export const TitleWithLink: React.FC<TitleWithLinkProps> = React.memo(props => {
  const { containerStyle, contents, titleContainer } = props;
  const { handleAction } = React.useContext(EngagementContext);

  const onPress = (link: string) => () => {
    handleAction({
      type: 'deep-link',
      value: link
    });
  };

  return (
    <View style={containerStyle}>
      <View style={styles.flexContainer}>
        <View style={[styles.titleContainer, titleContainer]}>
          <TextBlock {...contents.Text} />
        </View>
        {!!contents?.TextLink?.enabled && (
          <View style={styles.linkContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={onPress(contents.TextLink.link)}
            >
              <TextBlock {...contents.TextLink} />
            </TouchableOpacity>

          </View>
        )}
      </View>
    </View>
  );
});
