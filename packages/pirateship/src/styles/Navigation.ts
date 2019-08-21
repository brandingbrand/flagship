import { color, palette } from './variables';
import { Options, OptionsTopBarTitle } from 'react-native-navigation';

export const navBarDark: Options = {
  statusBar: {
    style: 'light'
  },
  topBar: {
    background: {
      color: palette.primary
    },
    leftButtonColor: palette.onPrimary,
    rightButtonColor: palette.onPrimary,
    title: {
      color: palette.onPrimary
    }
  }
};

export const navBarLight: Options = {
  statusBar: {
    style: 'dark'
  },
  topBar: {
    background: {
      color: palette.onPrimary
    },
    leftButtonColor: palette.primary,
    rightButtonColor: palette.primary,
    title: {
      color: palette.primary
    }
  }
};

export const navBarFullBleed: Options = {
  statusBar: {
    style: 'light'
  },
  topBar: {
    visible: false
  },
  bottomTabs: {
    visible: true
  }
};

export const navBarHide: Options = {
  statusBar: {
    style: 'dark'
  },
  topBar: {
    visible: false
  },
  bottomTabs: {
    visible: true
  }
};

export const titleDefault: OptionsTopBarTitle = {
  color: palette.onPrimary,
  alignment: 'center'
};

export const navBarDefault: Options = {
  ...navBarDark,
  topBar: {
    ...navBarDark.topBar,
    largeTitle: {
      visible: false
    },
    title: {
      color: palette.onPrimary,
      alignment: 'center'
    }
  }
};

export const navBarNoTabs: Options = {
  ...navBarDefault,
  bottomTabs: {
    visible: false
  }
};

export const navBarTabLanding: Options = {
  statusBar: {
    style: 'dark'
  },
  topBar: {
    visible: true,
    title: {
      color: palette.primary,
      alignment: 'center'
    },
    largeTitle: {
      visible: true
    },
    noBorder: true,
    background: {
      color: palette.onPrimary
    },
    leftButtonColor: palette.primary,
    rightButtonColor: palette.primary
  }
};

export const navBarProductDetail: Options = {
  statusBar: {
    style: 'dark'
  },
  topBar: {
    background: {
      translucent: false,
      color: palette.onPrimary
    },
    drawBehind: false,
    noBorder: true,
    leftButtonColor: palette.primary,
    rightButtonColor: palette.primary,
    title: {
      color: palette.primary
    }
  }
};


export const tabBarDefault: Options = {
  bottomTab: {
    badgeColor: palette.secondary,
    iconColor: color.gray,
    selectedIconColor: palette.onBackground
  },
  bottomTabs: {
    backgroundColor: palette.background,
    hideShadow: false,
    titleDisplayMode: 'alwaysShow',
    translucent: false
  }
};
