import {colorsXmlTransformer} from './colors-xml';
import {manifestXmlTransformer} from './manifest-xml';
import {networkSecurityConfigXmlTransformer} from './network-security-config-xml';
import {pbxprojTransformer} from './pbxproj';
import {plistTransformer} from './plist';
import {stringsXmlTransformer} from './strings-xml';
import {stylesXmlTransformer} from './styles-xml';
import {utf8Transformer} from './utf-8';

/**
 * Array of file transformers that process different file types in the project.
 * Each transformer consists of a test pattern and its corresponding transformer function.
 *
 * @example
 * // Matches and transforms .pbxproj files
 * {
 *   test: /\b\.pbxproj$/,
 *   use: pbxprojTransformer
 * }
 *
 * @example
 * // Matches and transforms .plist files
 * {
 *   test: /\b\.plist$/,
 *   use: plistTransformer
 * }
 *
 * @example
 * // Matches and transforms .xml files
 * {
 *   test: /\b\.xml$/,
 *   use: xmlTransformer
 * }
 *
 * @example
 * // Matches and transforms various source files and config files
 * {
 *   test: /(\.(java|mm|swift|properties|entitlements|xcprivacy|gradle)$|^Podfile$|^Gemfile$)/,
 *   use: utf8Transformer
 * }
 */
export const transformers = [
  {
    test: /\b\.pbxproj$/,
    use: pbxprojTransformer,
  },
  {
    test: /\b\.plist$/,
    use: plistTransformer,
  },
  {
    test: /\b\colors.xml$/,
    use: colorsXmlTransformer,
  },
  {
    test: /\b\AndroidManifest.xml$/,
    use: manifestXmlTransformer,
  },
  {
    test: /\b\network_security_config.xml.xml$/,
    use: networkSecurityConfigXmlTransformer,
  },
  {
    test: /\b\strings.xml$/,
    use: stringsXmlTransformer,
  },
  {
    test: /\b\styles.xml$/,
    use: stylesXmlTransformer,
  },
  {
    test: /(\.(java|mm|swift|properties|entitlements|xcprivacy|gradle)$|^Podfile$|^Gemfile$)/,
    use: utf8Transformer,
  },
];
