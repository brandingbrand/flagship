import type { FunctionComponent } from 'react';
import React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { palette } from '../styles/variables';

export interface SerializableTooltipDisplayProps {
  positionX?: 'center' | 'left' | 'right';
  positionY?: 'bottom' | 'top';
  style?: ViewStyle;
  innerStyle?: ViewStyle;
  tooltipArrowStyle?: ViewStyle;
  show?: boolean;
}

export interface TooltipDisplayProps
  extends Omit<SerializableTooltipDisplayProps, 'innerStyle' | 'style' | 'tooltipArrowStyle'> {
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  tooltipArrowStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  arrowBottom: {
    transform: [
      {
        rotate: '-135deg',
      },
    ],
  },
  arrowCenter: {
    justifyContent: 'center',
  },
  arrowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  arrowContainerBottom: {
    bottom: -7,
  },
  arrowContainerTop: {
    top: -7,
  },
  arrowLeft: {
    justifyContent: 'flex-start',
    left: 14,
  },
  arrowRight: {
    justifyContent: 'flex-end',
    right: 14,
  },
  arrowTop: {
    transform: [
      {
        rotate: '45deg',
      },
    ],
  },
  container: {
    backgroundColor: palette.background,
    borderColor: palette.secondary,
    borderRadius: 12,
    borderWidth: 1,
    position: 'absolute',
    shadowOffset: {
      width: 0,
      height: 19,
    },
    shadowOpacity: 0.1,
    shadowRadius: 38,
    zIndex: 10000,
  },
  innerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tooltipArrow: {
    backgroundColor: palette.background,
    borderLeftColor: palette.secondary,
    borderLeftWidth: 1,
    borderTopColor: palette.secondary,
    borderTopLeftRadius: 4,
    borderTopWidth: 1,
    height: 14,
    width: 14,
    zIndex: 1,
  },
});

export const TooltipDisplay: FunctionComponent<TooltipDisplayProps> = (props) => {
  const renderTooltipArrow = () => {
    const { positionX, positionY, tooltipArrowStyle } = props;

    let mergeTooltipStyle;
    let mergeContainerStyle;

    switch (positionY) {
      case 'top': {
        mergeTooltipStyle = [styles.arrowTop, tooltipArrowStyle];
        mergeContainerStyle = [styles.arrowContainer, styles.arrowContainerTop];
        break;
      }
      case 'bottom': {
        mergeTooltipStyle = [styles.arrowBottom, tooltipArrowStyle];
        mergeContainerStyle = [styles.arrowContainer, styles.arrowContainerBottom];
        break;
      }
      default: {
        mergeTooltipStyle = [styles.arrowTop, tooltipArrowStyle];
        mergeContainerStyle = [styles.arrowContainer, styles.arrowContainerTop];
      }
    }

    switch (positionX) {
      case 'left': {
        mergeContainerStyle = [...mergeContainerStyle, styles.arrowLeft];
        break;
      }
      case 'right': {
        mergeContainerStyle = [...mergeContainerStyle, styles.arrowRight];
        break;
      }
      case 'center': {
        mergeContainerStyle = [...mergeContainerStyle, styles.arrowCenter];
        break;
      }
      default: {
        mergeContainerStyle = [...mergeContainerStyle, styles.arrowCenter];
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
      <View style={[styles.innerContainer, props.innerStyle]}>{props.children}</View>
    </View>
  );
};
