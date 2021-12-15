import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View
} from 'react-native';

import {
  InboxBlock
} from '../types';

import { TextBlock } from './TextBlock';
import { CTABlock } from './CTABlock';
import { ImageBlock } from './ImageBlock';
import ShareBlock from './ShareBlock';

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: 'row',
    marginLeft: -50
  },
  eventType: {
    flexDirection: 'row',
    marginVertical: 5
  },
  eventText: {
    flex: 1,
    marginLeft: 15
  },
  imageContainer: {
    width: 12,
    alignItems: 'center'
  },
  dateRow: {
    width: 12,
    paddingTop: 2,
    alignItems: 'center',
    marginRight: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  headerInfo: {
    marginLeft: 10
  },
  buttonRow: {
    flexDirection: 'row'
  }
});

export interface ComponentProps {
  containerStyle?: StyleProp<TextStyle>;
  story?: InboxBlock;
  contents: any;
}

export default class SimpleCard extends Component<ComponentProps> {
  render(): JSX.Element {
    const {
      containerStyle,
      contents
    } = this.props;

    return (
      <View style={containerStyle}>
        <View style={styles.header}>
          <ImageBlock
            {...contents.Avatar}
          />
          <View style={styles.headerInfo}>
            <TextBlock
              {...contents.Username}
            />
            <TextBlock
              {...contents.Date}
            />
          </View>
        </View>
        <View>
          <TextBlock
            {...contents.Text}
          />
        </View>
        <View>
          <ImageBlock
            {...contents.Image}
          />
        </View>
        <View style={styles.buttonRow}>
          <ShareBlock {...contents.Share} />
          <CTABlock
            {...contents.CTA}
            story={this.props.story}
          />
        </View>
      </View>
    );
  }
}
