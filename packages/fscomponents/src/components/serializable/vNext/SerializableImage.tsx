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
  ({ children, style, uri, ...props }) => {
    const source = useMemo(() => ({ uri }), [uri]);

    return (
      <View style={style}>
        <ImageBackground
          {...props}
          source={source}
          style={[{ flex: 1 }, style]}
        >
          {children}
        </ImageBackground>
      </View>
    );
  };
