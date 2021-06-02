import React, { FC, useMemo } from 'react';
import { ImageBackground, ImageProps, ImageStyle, View, ViewStyle } from 'react-native';

export interface SerializableImageProps
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
  uri?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  children?: React.ReactNode;
}

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
