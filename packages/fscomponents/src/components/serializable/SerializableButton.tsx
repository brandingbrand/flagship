import React, { useMemo } from 'react';
import {
  Image, ImageStyle, Text, TextStyle, TouchableOpacity, View, ViewStyle
} from 'react-native';

import { ButtonProps } from '../Button';
import {
  border,
  palette as defaultPalette
} from '../../styles/variables';
import {
  style as S,
  stylesSize,
  stylesTextSize
} from '../../styles/Button';

export const withPropTransformer = <P extends object, InputProps extends object = P>(
  Component: React.ComponentType<P>,
  propTransformer: (props: InputProps) => P
): React.FC<InputProps> => (props: InputProps) => {
  return <Component {...propTransformer(props)} />;
};

export interface SerializableButtonProps
  extends Pick<
    ButtonProps,
    | 'title'
    | 'dynamicTitleStates'
    | 'selectedTitleState'
    | 'accessibilityLabel'
    | 'underlayColor'
    | 'icon'
    | 'palette'
    | 'color'
    | 'size'
    | 'light'
    | 'link'
    | 'disabled'
    | 'loading'
    | 'full'
  > {
  href: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  iconStyle?: ImageStyle;
  viewStyle?: ViewStyle;
}

export const FSSerializableButton = React.memo<SerializableButtonProps & {
  onPress?: () => void;
}>(
  ({
    title,
    style = {},
    full,
    size = 'medium',
    color = 'primary',
    light,
    link,
    viewStyle,
    icon,
    iconStyle,
    titleStyle,
    palette,
    onPress = () => { // default
    },
    ...props
  }) => {
    const paletteButton = palette || defaultPalette;
    const onColor = useMemo(
      () => `on${color.charAt(0).toUpperCase()}${color.slice(1)}` as keyof typeof paletteButton,
      [color]
    );

    return (
      <TouchableOpacity onPress={onPress} {...props}>
        <View
          style={[
            S.container,
            {
              backgroundColor: light || link ? 'transparent' : paletteButton[color],
              borderColor: light ? paletteButton[color] : undefined,
              borderWidth: light ? border.width : 0
            },
            stylesSize[size],
            full && S.full,
            style
          ]}
        >
          <View style={[S.buttonInner, { width: '100%' }]}>
            <View style={[S.buttonView, viewStyle]}>
              {icon && <Image style={[S.icon, iconStyle]} source={icon} />}
              <Text
                style={[
                  S.text,
                  { flex: 1 },
                  { color: light || link ? paletteButton[color] : paletteButton[onColor] },
                  stylesTextSize[size],
                  titleStyle
                ]}
                {...props}
              >
                {title}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);
