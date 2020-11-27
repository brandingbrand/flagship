import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { palette } from '../styles/variables';

export interface SerializableTooltipDisplayProps {
  positionX?: 'left' | 'right' | 'center';
  positionY?: 'top' | 'bottom';
  style?: ViewStyle;
  innerStyle?: ViewStyle;
  tooltipArrowStyle?: ViewStyle;
  show?: boolean;
}

export interface TooltipDisplayProps extends Omit<
  SerializableTooltipDisplayProps,
  'style' | 'innerStyle' | 'tooltipArrowStyle'
> {
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  tooltipArrowStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: palette.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.secondary,
    shadowRadius: 38,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 19
    }
  },
  innerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%'
  },
  tooltipArrow: {
    width: 14,
    height: 14,
    zIndex: 1,
    backgroundColor: palette.background,
    borderTopColor: palette.secondary,
    borderLeftColor: palette.secondary,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopLeftRadius: 4
  },
  arrowTop: {
    transform: [{
      rotate: '45deg'
    }]
  },
  arrowBottom: {
    transform: [{
      rotate: '-135deg'
    }]
  },
  arrowContainerTop: {
    top: -7
  },
  arrowContainerBottom: {
    bottom: -7
  },
  arrowLeft: {
    justifyContent: 'flex-start',
    left: 14
  },
  arrowCenter: {
    justifyContent: 'center'
  },
  arrowRight: {
    justifyContent: 'flex-end',
    right: 14
  }
});

export const TooltipDisplay: FunctionComponent<TooltipDisplayProps> = props => {
  const renderTooltipArrow = () => {
    const { positionY, positionX, tooltipArrowStyle } = props;

    let mergeTooltipStyle;
    let mergeContainerStyle;

    switch (positionY) {
      case 'top': {
        mergeTooltipStyle = [
          styles.arrowTop,
          tooltipArrowStyle
        ];
        mergeContainerStyle = [
          styles.arrowContainer,
          styles.arrowContainerTop
        ];
        break;
      }
      case 'bottom': {
        mergeTooltipStyle = [
          styles.arrowBottom,
          tooltipArrowStyle
        ];
        mergeContainerStyle = [
          styles.arrowContainer,
          styles.arrowContainerBottom
        ];
        break;
      }
      default: {
        mergeTooltipStyle = [
          styles.arrowTop,
          tooltipArrowStyle
        ];
        mergeContainerStyle = [
          styles.arrowContainer,
          styles.arrowContainerTop
        ];
      }
    }

    switch (positionX) {
      case 'left': {
        mergeContainerStyle = [
          ...mergeContainerStyle,
          styles.arrowLeft
        ];
        break;
      }
      case 'right': {
        mergeContainerStyle = [
          ...mergeContainerStyle,
          styles.arrowRight
        ];
        break;
      }
      case 'center': {
        mergeContainerStyle = [
          ...mergeContainerStyle,
          styles.arrowCenter
        ];
        break;
      }
      default: {
        mergeContainerStyle = [
          ...mergeContainerStyle,
          styles.arrowCenter
        ];
      }
    }

    return (
      <View style={mergeContainerStyle}>
        <View style={[styles.tooltipArrow, mergeTooltipStyle]} />
      </View>
    );
  };

  if (!props.show) {
    return null;
  }

  return (
    <View style={[styles.container, props.style]}>
      {renderTooltipArrow()}
      <View style={[styles.innerContainer, props.innerStyle]}>
        {props.children}
      </View>
    </View>
  );
};
