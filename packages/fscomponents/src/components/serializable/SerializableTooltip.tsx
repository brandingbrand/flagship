// tslint:disable: jsx-use-translation-function
import React from 'react';
import { Tooltip, TooltipProps } from 'react-native-elements';
import { FlexStyle, Platform, Text, TextStyle, ViewStyle } from 'react-native';
import { Modal } from '../Modal';
import { StandardContainerProps } from '../../models';

interface Props
  extends Pick<
    TooltipProps,
    | 'backgroundColor'
    | 'height'
    | 'highlightColor'
    | 'overlayColor'
    | 'pointerColor'
    | 'width'
    | 'withOverlay'
    | 'withPointer'
    | 'skipAndroidStatusBar'
  > {
  popover: string;
  style: ViewStyle;

  textStyle?: TextStyle;

  /**
   * @TJS-ignore this should not appear in the editor
   */
  containerStyle: FlexStyle;

  /**
   * @TJS-ignore this should not appear in the editor
   */
  children: React.ReactNode;
}

export type SerializableTooltipProps = StandardContainerProps<Props>;

export const FSSerializableTooltip = React.memo<SerializableTooltipProps>(
  ({ popover, textStyle, style, children, skipAndroidStatusBar, ...props }) => {
    return (
      <Tooltip
        {...props}
        containerStyle={style}
        popover={<Text style={textStyle}>{popover}</Text>}
        ModalComponent={Modal}
        // When react native elements calculates the vertical placement for the tooltip, it
        // uses the StatusBar height in its calculation. This is always undefined on web, so
        // the resulting value will be NaN.
        //
        // tslint:disable-next-line: ter-max-len
        // Ref: https://github.com/react-native-elements/react-native-elements/blob/v2.0.1/src/tooltip/Tooltip.js#L172
        skipAndroidStatusBar={Platform.OS === 'web' ? true : skipAndroidStatusBar}
      >
        {children}
      </Tooltip>
    );
  }
);
