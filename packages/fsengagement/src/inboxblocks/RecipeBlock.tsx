import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import {
  Action,
  ScreenProps
} from '../types';

import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';

export interface RecipeBlockProps extends ScreenProps {
  items: any;
  thumbnail: any;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}
const styles = StyleSheet.create({
  container: {

  },
  recipeContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  linkContainer: {
    width: '100%'
  },
  imageStyle: {
    width: 19,
    height: 23,
    resizeMode: 'cover'
  },
  whenIcon: {
    width: 20,
    height: 20
  },
  imageContainer: {
    width: 20,
    alignItems: 'center',
    paddingTop: 2,
    marginRight: 7
  },
  recipeTitle: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'normal'
  },
  eventText: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default class RecipeBlock extends Component<RecipeBlockProps> {
  static contextTypes: any = {
    handleAction: PropTypes.func
  };

  onButtonPress = (actions: Action) => (): void => {
    const { handleAction } = this.context;
    if (actions && actions.type) {
      return handleAction({
        ...actions
      });
    }
  }
  render(): JSX.Element {
    const {
      items,
      containerStyle,
      textStyle
    } = this.props;
    const recipeItems = (items || []).map((item: any, index: number) => {
      return (

        <View key={index}>
          {item.link ? (<TouchableOpacity
            onPress={this.onButtonPress(item.link.actions)}
            activeOpacity={0.8}
            style={[styles.linkContainer, styles.recipeContainer]}
          >
            {(item.thumbnail && item.thumbnail.source) && <ImageBlock
              source={item.thumbnail.source}
              containerStyle={styles.imageContainer}
              imageStyle={[styles.whenIcon, item.thumbnail.customSize]}
            />}
            <View style={styles.eventText}>
              <TextBlock
                text={item.text}
                textStyle={[styles.recipeTitle, textStyle, { textDecorationLine: 'underline' }]}
              />
            </View>
          </TouchableOpacity>) : (
              <View style={styles.recipeContainer}>
                {(item.thumbnail && item.thumbnail.source) && <ImageBlock
                  source={item.thumbnail.source}
                  containerStyle={styles.imageContainer}
                  imageStyle={[styles.whenIcon, item.thumbnail.customSize]}
                />}
                <View
                  style={[
                    styles.eventText,
                    !(item.thumbnail && item.thumbnail.source) && { marginLeft: 27 }
                  ]}
                >
                  <TextBlock
                    text={item.text}
                    textStyle={[styles.recipeTitle, textStyle]}
                  />
                </View>
              </View>
            )}
        </View>
      );
    });

    return (
      <View style={[styles.container, containerStyle]}>
        {recipeItems}
      </View>
    );
  }
}
