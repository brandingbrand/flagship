import { color, palette } from './variables';

export const navBarDark = {
  statusBarTextColorScheme: 'light',
  navBarBackgroundColor: palette.primary,
  navBarButtonColor: palette.onPrimary,
  navBarTextColor: palette.onPrimary
};

export const navBarLight = {
  statusBarTextColorScheme: 'dark',
  navBarBackgroundColor: palette.onPrimary,
  navBarButtonColor: palette.primary,
  navBarTextColor: palette.primary
};

export const navBarFullBleed = {
  ...navBarDark,
  navBarHidden: true,
  tabBarHidden: false
};

export const navBarHide = {
  ...navBarDark,
  statusBarTextColorScheme: 'dark',
  navBarHidden: true,
  tabBarHidden: false
};

export const navBarNone = {
  ...navBarDark,
  statusBarTextColorScheme: 'dark',
  navBarHidden: true,
  tabBarHidden: false
};

export const navBarDefault = {
  ...navBarDark,
  largeTitle: false,
  navBarTitleTextCentered: true
};

export const navBarNoTabs = {
  ...navBarDefault,
  tabBarHidden: true
};

export const navBarTabLanding = {
  ...navBarLight,
  navBarHidden: false,
  largeTitle: true,
  navBarNoBorder: true,
  navBarTitleTextCentered: true
};

export const navBarProductDetail = {
  ...navBarLight,
  navBarTransparent: false,
  drawUnderNavBar: false,
  navBarNoBorder: true
};

export const tabBarDefault = {
  bottomTabBadgeBackgroundColor: palette.secondary,
  forceTitlesDisplay: true,
  tabBarBackgroundColor: palette.background,
  tabBarButtonColor: color.gray,
  tabBarHideShadow: false,
  tabBarSelectedButtonColor: palette.onBackground,
  tabBarTranslucent: false
};
