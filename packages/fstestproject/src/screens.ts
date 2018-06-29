import Home from './screens/Home';
import fscommerceScreens from './screens/fscommerce';
import fsproductindexScreen from './screens/fsproductindex';
import fscheckoutScreens from './screens/fscheckout';
import fsproductdetailScreens from './screens/fsproductdetail';
import fscategoryScreens from './screens/fscategory';
import fscartScreens from './screens/fscart';


export interface Screens {
  [key: string]: any;
}

function scope(screens: Screens, scope: string): Screens {
  const scopedScreens: any = {};
  Object.keys(screens).forEach(screenName => {
    scopedScreens[`${scope}.${screenName}`] = screens[screenName];
  });
  return scopedScreens;
}

export default {
  Home,
  ...scope(fscommerceScreens, 'fscommerce'),
  ...scope(fsproductindexScreen, 'fsproductindex'),
  ...scope(fscategoryScreens, 'fscategory'),
  ...scope(fscartScreens, 'fscart'),
  ...scope(fscheckoutScreens, 'fscheckout'),
  ...scope(fsproductdetailScreens, 'fsproductdetail')
};
