import icons from './icons';
import assets from './images';
import tabIcons from './tabIcons';

export type AssetType = keyof typeof assets;
export type IconType = keyof typeof icons;
export type TabIconType = keyof typeof tabIcons;

export {assets, icons, tabIcons};
