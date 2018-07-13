import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import {
  Icon
} from '../types';

export interface CTAActions {
  type: string;
  value?: string;
  subject?: string;
  body?: string;
}

export interface CTABlockProps {
  actions: CTAActions;
  text: string;
  icon: Icon;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  clickHandler: (id: string, story?: any) => void;
}

const images: any = {
  rightArrow: require('../../assets/images/rightArrow.png')
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    width: 8,
    height: 13,
    marginLeft: 10
  },
  buttonContents: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default class CTABlock extends Component<CTABlockProps> {

  static contextTypes: any = {
    story: PropTypes.object,
    handleAction: PropTypes.func
  };

  onButtonPress = () => {
    switch (this.props.actions.type) {
      case 'story':
        const { story } = this.context;
        return this.props.clickHandler(story.messageId, story);
      default:
    }
  }

  render(): JSX.Element {
    const {
      buttonStyle,
      textStyle,
      containerStyle,
      text,
      icon
    } = this.props;

    return (
      <View style={[styles.buttonContainer, containerStyle]}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={this.onButtonPress}
          activeOpacity={1}
        >
          <View style={styles.buttonContents}>
            <Text style={textStyle}>{text}</Text>
            {icon && <Image style={[styles.backIcon, icon.iconStyle]} source={images[icon.type]} />}
          </View>

        </TouchableOpacity>
      </View>
    );

  }
}
