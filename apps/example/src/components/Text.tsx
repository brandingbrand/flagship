import type {ReactNode} from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import {createStyleSheet} from '../lib/theme';

export interface TextProps extends RNTextProps {
  type?: 'primary' | 'secondary';
}

export function Text({
  type = 'primary',
  style,
  ...props
}: TextProps): ReactNode {
  const styles = useStyles();
  return <RNText style={[styles[type], style]} {...props} />;
}

const useStyles = createStyleSheet(palette => {
  return {
    primary: {
      color: palette.fg,
    },
    secondary: {
      color: palette.fgSecondary,
    },
  };
});
