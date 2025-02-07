import {useColorScheme} from 'react-native';

import {type AppTheme} from '../lib/theme';

export function useTheme(): AppTheme {
  return useColorScheme() ?? 'light';
}
