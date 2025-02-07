import {AssetColorRuleset} from '../config';

export function resolveAssetColor<TokenT extends string>(
  assetName: string,
  hasModes?: boolean,
  colorRules?: AssetColorRuleset<TokenT>,
  defaultColor?: TokenT,
): TokenT | undefined {
  if (colorRules) {
    for (const [rule, color] of Object.entries(colorRules)) {
      if (new RegExp(rule).test(assetName)) {
        return color === false ? undefined : color;
      }
    }
  }

  if (hasModes) {
    return undefined;
  }

  return defaultColor;
}
