import React, { useCallback, useMemo } from 'react';
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useNavigator } from '@brandingbrand/fsapp';
import { ButtonProps } from '../Button';
import { border, palette as defaultPalette } from '../../styles/variables';
import { style as S, stylesSize, stylesTextSize } from '../../styles/Button';
import { extractHostStyles } from '../../lib/style';

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
  noPadding?: boolean;
}

export const FSSerializableButton = React.memo<
  SerializableButtonProps & {
    onPress?: (href: string) => void;
  }
>(
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
    href,
    onPress,
    ...props
  }) => {
    const [host, self] = extractHostStyles(style);
    const paletteButton = palette || defaultPalette;
    const onColor = useMemo(
      () => `on${color.charAt(0).toUpperCase()}${color.slice(1)}` as keyof typeof paletteButton,
      [color]
    );

    const navigator = useNavigator();

    const handlePress = useCallback(() => {
      if (onPress) {
        onPress(href);
      } else if (href) {
        navigator.open(href);
      }
    }, [href]);

    return (
      <TouchableOpacity {...props} onPress={handlePress} style={host} >
        <View
          style={[
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
      </TouchableOpacity>
    );
  }
);
