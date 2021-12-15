import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Action, BlockItem, EmitterProps, Icon, ScreenProps } from '../types';
import { EngagementContext } from '../lib/contexts';

const images: any = {
  rightArrow: require('../../assets/images/rightArrow.png'),
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
  static contextTypes: any = {
    story: PropTypes.object,
    cardActions: PropTypes.object,
    handleAction: PropTypes.func,
    handleStoryAction: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
  };

  takeAction = (action: string, actions: Action): void => {
    const { handleAction, story } = this.props.context;
    const { private_blocks } = story;
    const PRIVATE_TYPE = 'private_type';
    const recipeList = (private_blocks || []).find((block: BlockItem) => {
      return block[PRIVATE_TYPE] === 'RecipeList';
    });
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

  onButtonPress = () => {
    this.takeAction(this.props.action, this.props.actions);
  };

  shouldComponentUpdate(nextProps: ShopIngredientsBlockProps): boolean {
    return (
      nextProps.buttonStyle !== this.props.buttonStyle ||
      nextProps.textStyle !== this.props.textStyle ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.text !== this.props.text ||
      nextProps.icon !== this.props.icon
    );
  }

  render(): JSX.Element {
    const { buttonStyle, textStyle, containerStyle, text, icon } = this.props;

    return (
      <View style={[styles.buttonContainer, containerStyle]}>
        <TouchableOpacity style={buttonStyle} onPress={this.onButtonPress} activeOpacity={1}>
          <View style={styles.buttonContents}>
            <Text style={textStyle}>{text}</Text>
            {icon && <Image style={[styles.backIcon, icon.iconStyle]} source={images[icon.type]} />}
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
