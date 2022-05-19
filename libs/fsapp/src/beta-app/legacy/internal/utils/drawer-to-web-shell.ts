import type { ComponentRoute } from '../../../router';
import type { DrawerOptions, ShellConfig } from '../../../shell.web';
import { makeDrawer } from '../../../shell.web';
import { makeLegacyDrawer } from '../../components/legacy-drawer.component';
import type { LegacyDrawer } from '../../legacy-drawer';

export const drawerToWebShell = (
  legacyRoutes: Map<string, ComponentRoute>,
  { left, right, ...config }: LegacyDrawer = {}
): ShellConfig => {
  const defaultOptions: DrawerOptions = {
    animationDuration: config.webDuration ? `${config.webDuration}s` : undefined,
    overlayOpacity: config.webOverlayOpacity,
    slideShell: config.webSlideContainer ? true : undefined,
    width: config.webWidth,
    style: {
      opacity: config.webOpacity,
    },
  };

  const leftDrawer = left
    ? makeDrawer(makeLegacyDrawer(left.screen, legacyRoutes), {
        ...defaultOptions,
        backgroundColor: config.webLeftBackgroundColor,
      })
    : undefined;

  const rightDrawer = right
    ? makeDrawer(makeLegacyDrawer(right.screen, legacyRoutes), {
        ...defaultOptions,
        backgroundColor: config.webRightBackgroundColor,
      })
    : undefined;

  return { leftDrawer, rightDrawer };
};
