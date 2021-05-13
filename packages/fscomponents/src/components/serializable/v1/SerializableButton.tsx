import React, { useMemo } from 'react';
import { Image, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native';

import { extractHostStyles } from '../../../lib/style';
import { style as S, stylesSize, stylesTextSize } from '../../../styles/Button';
import { border, palette as defaultPalette } from '../../../styles/variables';
import { ButtonProps } from '../../Button';

export interface SerializableButtonProps
  extends Pick<
    ButtonProps,
    | 'accessibilityLabel'
    | 'color'
    | 'disabled'
    | 'dynamicTitleStates'
    | 'full'
    | 'icon'
    | 'light'
    | 'link'
    | 'loading'
    | 'palette'
    | 'selectedTitleState'
    | 'size'
    | 'title'
    | 'underlayColor'
  > {
  style?: ViewStyle;
  titleStyle?: TextStyle;
  iconStyle?: ImageStyle;
  viewStyle?: ViewStyle;
  noPadding?: boolean;
}

export const SerializableButton = React.memo<SerializableButtonProps>(
  // tslint:disable-next-line: cyclomatic-complexity
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
    noPadding,
    palette,
    ...props
  }) => {
    const [host, self] = extractHostStyles(style);
    const paletteButton = palette || defaultPalette;
    const onColor = useMemo(
      () => `on${color.charAt(0).toUpperCase()}${color.slice(1)}` as keyof typeof paletteButton,
      [color]
    );

    return (
      <View
        style={[
          host,
          S.container,
          noPadding && { paddingLeft: 0, paddingRight: 0 },
          {
            backgroundColor: light || link ? 'transparent' : paletteButton[color],
            borderColor: light ? paletteButton[color] : undefined,
            borderWidth: light ? border.width : 0
          },
          stylesSize[size],
          full && S.full,
          self
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
    );
  }
);
