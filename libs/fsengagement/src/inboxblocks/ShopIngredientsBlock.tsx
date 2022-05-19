import React, { Component, useContext } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PropTypes from 'prop-types';

import rightArrow from '../../assets/images/rightArrow.png';
import { EngagementContext } from '../lib/contexts';
import type { Action, BlockItem, EmitterProps, Icon, ScreenProps } from '../types';

const images = {
  rightArrow,
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 8,
    height: 13,
    marginLeft: 10,
  },
  buttonContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export interface ShopIngredientsBlockProps extends ScreenProps, EmitterProps {
  action: string;
  text: string;
  icon: Icon;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  actions: Action;
}

class ShopIngredientsBlock extends Component<ShopIngredientsBlockProps & { context: any }> {
  public static contextTypes: any = {
    story: PropTypes.object,
    cardActions: PropTypes.object,
    handleAction: PropTypes.func,
    handleStoryAction: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
  };

  private readonly takeAction = (action: string, actions: Action): void => {
    const { handleAction, story } = this.props.context;
    const { private_blocks } = story;
    const PRIVATE_TYPE = 'private_type';
    const recipeList = (private_blocks || []).find(
      (block: BlockItem) => block[PRIVATE_TYPE] === 'RecipeList'
    );
    const productIDs = recipeList.items.reduce((ret: string, attr: any) => {
      const amp = ret ? '&' : '';
      if (attr.productId) {
        ret += `${amp}id=${attr.productId}`;
      }
      return ret;
    }, '');

    return handleAction({
      type: 'deep-link',
      value: actions.value + productIDs,
      name: this.props.name,
      id: this.props.id,
    });
  };

  private readonly onButtonPress = () => {
    this.takeAction(this.props.action, this.props.actions);
  };

  public shouldComponentUpdate(nextProps: ShopIngredientsBlockProps): boolean {
    return (
      nextProps.buttonStyle !== this.props.buttonStyle ||
      nextProps.textStyle !== this.props.textStyle ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.text !== this.props.text ||
      nextProps.icon !== this.props.icon
    );
  }

  public render(): JSX.Element {
    const { buttonStyle, containerStyle, icon, text, textStyle } = this.props;

    return (
      <View style={[styles.buttonContainer, containerStyle]}>
        <TouchableOpacity style={buttonStyle} onPress={this.onButtonPress} activeOpacity={1}>
          <View style={styles.buttonContents}>
            <Text style={textStyle}>{text}</Text>
            {icon && (
              <Image
                style={[styles.backIcon, icon.iconStyle]}
                source={images[icon.type as keyof typeof images]}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default (props: ShopIngredientsBlockProps) => {
  const context = useContext(EngagementContext);
  return <ShopIngredientsBlock {...props} context={context} />;
};
