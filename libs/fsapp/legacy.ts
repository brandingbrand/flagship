import type { FSLegacyShimConfig, LegacyRoutableComponentClass } from './src/beta-app/legacy';

export type {
  FSLegacyShimConfig as FSAppConfig,
  LegacyNavLayout as NavLayout,
  LegacyNavLayoutComponent as NavLayoutComponent,
  LegacyNavLayoutStack as NavLayoutStack,
  LegacyNavLayoutStackChildren as NavLayoutStackChildren,
  LegacyNavModalOptions as NavModalOptions,
  LegacyNavOptions as NavOptions,
  LegacyRoutableComponentClass as RoutableComponentClass,
  LegacySSRData as SSRData,
  LegacyTab as Tab,
} from './src/beta-app/legacy';
export {
  FSLegacyShim,
  makeLegacyScreen,
  LegacyNavigator as Navigator,
} from './src/beta-app/legacy';

/**
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FSAppTypes {
  /**
   * @deprecated
   */
  export type RoutableComponentClass = LegacyRoutableComponentClass;

  /**
   * @deprecated
   */
  export type AppConfigType = FSLegacyShimConfig;
}
