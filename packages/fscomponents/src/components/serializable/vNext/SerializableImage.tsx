import React, { FC, useMemo } from 'react';
import { FlexStyle, ImageBackground, ImageProps, ImageStyle, View, ViewStyle } from 'react-native';
import { StandardContainerProps } from '../../../models';

export interface PreStandardizedSerializableImageProps
  extends Pick<
    ImageProps,
    | 'accessibilityLabel'
    | 'accessible'
    | 'blurRadius'
    | 'capInsets'
    | 'defaultSource'
    | 'fadeDuration'
    | 'loadingIndicatorSource'
    | 'progressiveRenderingEnabled'
    | 'resizeMethod'
    | 'resizeMode'
    | 'testID'
  > {
  uri: string;
  imageStyle?: ImageStyle;
  style: ViewStyle;

  /**
   * @TJS-ignore
   */
  containerStyle: FlexStyle;

  /**
   * @TJS-ignore
   */
  children: React.ReactNode;
}

export type SerializableImageProps = StandardContainerProps<PreStandardizedSerializableImageProps>;

export const SerializableImage: FC<SerializableImageProps> =
  ({ children, containerStyle, style = {}, uri, ...props }) => {
    const source = useMemo(() => ({ uri }), [uri]);
    const { alignItems, justifyContent, ...restStyles } = style;

    return (
      <View style={[restStyles, containerStyle]}>
        <ImageBackground
          {...props}
          source={source}
          style={{
            flex: 1,
            alignItems,
            justifyContent
          }}
        >
          {children}
        </ImageBackground>
      </View>
    );
  };
