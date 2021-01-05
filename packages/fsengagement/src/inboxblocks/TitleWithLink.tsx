import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import TextBlock from './TextBlock';

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

export default class TitleWithLinkBlock extends Component<TitleWithLinkProps> {
  static contextTypes: any = {
    handleAction: PropTypes.func
  };
  onPress = (link: string) => () => {
    const { handleAction } = this.context;
    handleAction({
      type: 'deep-link',
      value: link
    });
  }

  render(): JSX.Element {
    const {
      containerStyle,
      contents,
      titleContainer
    } = this.props;

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
                onPress={this.onPress(contents.TextLink.link)}
              >
                <TextBlock {...contents.TextLink} />
              </TouchableOpacity>

            </View>
          )}
        </View>
      </View>
    );
  }
}
