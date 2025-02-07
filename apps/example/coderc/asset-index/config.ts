export type AssetColorRuleset<TokenT extends string> = Record<
  string,
  TokenT | false
>;

export interface AssetIndexConfig<TokenT extends string> {
  /**
   * A map of asset modes to their respective filename suffixes.
   *
   * When a file with a mode suffix is found, the generator will attempt to find all other modes, and combine them into a single asset in the manifest.
   * If any of the mode variants are missing, the generation will fail.
   *
   * @example
   * assetModes: {
   *  'dark': 'Dark',
   *  'light': 'Light',
   * }
   * // will output, for an asset named `iconNameDark.png`/`iconNameLight.png`:
   * iconName: {
   *   source: {
   *     dark: require('./iconNameDark.png'),
   *     light: require('./iconNameLight.png'),
   *   }
   * }
   */
  assetModes?: Record<string, string>;

  /**
   * a function to allow modification of the final asset name.
   *
   * Only affects the property name in the resulting file. Will not affect the require path or color matching rules.
   */
  assetNameTransform?: (name: string) => string;

  /**
   * Set of regex matching strings mapped to color tokens to apply to assets.
   *
   * if an asset should never be tinted, use `false` as the color token.
   *
   */
  colorRules?: AssetColorRuleset<TokenT>;

  /**
   * Default color token to apply to assets.
   */
  defaultColor?: TokenT;

  /**
   * Output mode for the asset manifest.
   *
   * - `AssetManifest`: Outputs a map of asset names to metadata.
   * - `RequireMap`: Outputs a map of asset names to require expressions.
   *     - `colorRules` and `defaultColor` are ignored in this mode.
   *
   */
  outputMode: 'AssetManifest' | 'RequireMap';
}

export function defineAssetIndexConfig<TokenT extends string>(
  config: AssetIndexConfig<TokenT>,
): AssetIndexConfig<TokenT> {
  return {
    //@ts-ignore -- hidden config flag.
    __INDEX_CONFIG: true,
    ...config,
  };
}
