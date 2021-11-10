import React, { Component } from 'react';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  eventContainer: {
    marginLeft: 50,
    paddingLeft: 100
  },
  flexContainer: {
    flexDirection: 'row'
  },
  imageContainer: {
    position: 'absolute',
    left: 30,
    top: 40
  },
  dateRow: {
    width: 12,
    paddingTop: 2,
    alignItems: 'center',
    marginRight: 5
  }

});

export interface TextWithIconProps {
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
}


export default class TextWithIconBlock extends Component<TextWithIconProps> {
  render(): JSX.Element {
    const {
      containerStyle,
      contents
    } = this.props;
    const imageDimensions: StyleProp<ImageStyle> = {};
    const iconSpacing: StyleProp<ViewStyle> = {
      marginRight: contents.Image.iconSpacing || 0
    };
    const iconWidth = contents.Image.iconWidth || 0;
    imageDimensions.width = iconWidth;
    imageDimensions.height = iconWidth / parseFloat(contents.Image.ratio);
    return (
      <View style={containerStyle}>
        <View style={styles.flexContainer}>
          <View
            style={
              [
                styles.iconContainer,
                {width: contents.Image.iconWidth},
                iconSpacing
              ]
            }
          >
            <ImageBlock
              source={contents.Image.source}
              containerStyle={contents.Image.containerStyle}
              imageStyle={imageDimensions}
            />
          </View>
          <View
            style={{ flex: 1 }}
          >
            <TextBlock
              {...contents.Title}
            />
            <TextBlock
              {...contents.Subtitle}
            />
          </View>
        </View>
      </View>
    );
  }
}
