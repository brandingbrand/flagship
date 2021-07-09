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
  Action,
  EmitterProps,
  Icon,
  JSON
} from '../types';

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

interface LocalizationData {
  value: string;
  language: string;
}

export interface CTABlockProps extends EmitterProps {
  action: string;
  text: string;
  icon?: Icon;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  actions: Action;
  animateIndex?: number;
  onBack?: () => void;
  localization?: LocalizationData[];
}

export default class CTABlock extends Component<CTABlockProps> {
  static contextTypes: any = {
    story: PropTypes.object,
    cardActions: PropTypes.object,
    handleAction: PropTypes.func,
    handleStoryAction: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
    language: PropTypes.string,
    cardPosition: PropTypes.number
  };

  // // tslint:disable-next-line:cyclomatic-complexity
  handleActionWithStory = (action: string, actions: Action, story: JSON) => {
    const { handleAction, handleStoryAction, cardPosition } = this.context;
    if (story.html) {
      return handleAction({
        type: 'blog-url',
        value: story.html.link,
        position: cardPosition
      });
    } else if (action === 'story' || (story && actions &&
      (actions.type === null || actions.type === 'story'))
      && this.context?.handleStoryAction) {
      // go to story card
      return handleStoryAction(story);
    } else if (story && actions && actions.type !== 'story') {
      return this.handleActionNoStory(actions);
    }
    return null;
  }

  handleActionNoStory = (actions: Action) => {
    const { handleAction, cardActions, cardPosition } = this.context;
    if (actions && !actions.value) {
      return;
    }
    if (actions && actions.type) {
      return handleAction({
        ...actions,
        name: this.props.name,
        id: this.props.id,
        position: cardPosition
      });
    }
    // tappable card with no story - CTAs use actions of container card
    return handleAction({
      ...cardActions,
      name: this.props.name,
      id: this.props.id,
      position: cardPosition
    });
  }

  takeAction = (action: string, actions: Action): void => {
    const { story } = this.context;
    if (action === 'story' || story) {
      return this.handleActionWithStory(action, actions, story);
    }
    return this.handleActionNoStory(actions);
  }

  onButtonPress = () => {
    this.takeAction(this.props.action, this.props.actions);
  }

  shouldComponentUpdate(nextProps: CTABlockProps): boolean {
    return nextProps.buttonStyle !== this.props.buttonStyle ||
      nextProps.textStyle !== this.props.textStyle ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.text !== this.props.text ||
      nextProps.icon !== this.props.icon;
  }

  render(): JSX.Element {
    const {
      buttonStyle,
      textStyle,
      containerStyle,
      icon,
      localization
    } = this.props;

    let { text } = this.props;
    const { language } = this.context;
    const filterLocalization = localization && localization.find(item => {
      return item.language === language;
    }) || null;
    if (filterLocalization) {
      text = filterLocalization.value;
    }
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
