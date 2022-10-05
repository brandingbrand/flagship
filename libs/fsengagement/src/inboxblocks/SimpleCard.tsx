import React, { Component } from 'react';

import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { InboxBlock } from '../types';

import type { CTABlockProps } from './CTABlock';
import { CTABlock } from './CTABlock';
import type { ImageBlockProps } from './ImageBlock';
import { ImageBlock } from './ImageBlock';
import ShareBlock from './ShareBlock';
import type { TextBlockProps } from './TextBlock';
import { TextBlock } from './TextBlock';

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: 'row',
    marginLeft: -50,
  },
  eventType: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  eventText: {
    flex: 1,
    marginLeft: 15,
  },
  imageContainer: {
    width: 12,
    alignItems: 'center',
  },
  dateRow: {
    width: 12,
    paddingTop: 2,
    alignItems: 'center',
    marginRight: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerInfo: {
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
  },
});

interface Contents {
  Avatar: ImageBlockProps;
  Username: TextBlockProps;
  Date: TextBlockProps;
  Text: TextBlockProps;
  Image: ImageBlockProps;
  Share: any;
  CTA: CTABlockProps;
}

export interface ComponentProps {
  containerStyle?: StyleProp<TextStyle>;
  story?: InboxBlock;
  contents: Contents;
}

export default class SimpleCard extends Component<ComponentProps> {
  public render(): JSX.Element {
    const { containerStyle, contents } = this.props;

    return (
      <View style={containerStyle}>
        <View style={styles.header}>
          <ImageBlock {...contents.Avatar} />
          <View style={styles.headerInfo}>
            <TextBlock {...contents.Username} />
            <TextBlock {...contents.Date} />
          </View>
        </View>
        <View>
          <TextBlock {...contents.Text} />
        </View>
        <View>
          <ImageBlock {...contents.Image} />
        </View>
        <View style={styles.buttonRow}>
          <ShareBlock {...contents.Share} />
          <CTABlock {...contents.CTA} />
        </View>
      </View>
    );
  }
}
