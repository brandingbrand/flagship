import nodeFS from 'fs';
import fs from 'fs/promises';

import {type X2jOptions, XMLBuilder, XMLParser} from 'fast-xml-parser';

import type {
  AndroidManifestXML,
  ColorsXML,
  NetworkSecurityConfigXML,
  StringsXML,
  StylesXML,
} from '@/@types';
import {path} from '@/lib';

export const OPTS = {
  ignoreAttributes: false,
  attributeNamePrefix: '',
  attributesGroupName: '$',
  textNodeName: '_',
};

export const BUILD_OPTS = {
  ...OPTS,
  format: true,
  indentBy: '    ',
  suppressBooleanAttributes: false,
  suppressEmptyNode: true,
};

/**
 * Parses XML file, performs given callback with parsed data,
 * and writes the updated XML data back to the file.
 * @template T
 * @param {string} path - Path of the XML file to be parsed.
 * @param {X2jOptions} options - Options for XML parser.
 * @param {(xml: T) => void} callback - Callback to be performed with parsed data.
 * @returns {Promise<void>} Promise that resolves after writing updated XML to the file.
 */
export async function withXml<T>(
  path: string,
  options: X2jOptions,
  callback: (xml: T) => void,
): Promise<void> {
  const contents = await fs.readFile(path);

  const xml = new XMLParser({
    ...OPTS,
    ...options,
  }).parse(contents);

  callback(xml);

  await fs.writeFile(path, new XMLBuilder(BUILD_OPTS).build(xml));
}

/**
 * Applies the specified `callback` function to the `Colors` object in `colors.xml` file.
 *
 * @param {(xml: ColorsXML) => void} callback - The function to apply to the `Colors` object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export async function withColors(
  callback: (xml: ColorsXML) => void,
): Promise<void> {
  return withXml<ColorsXML>(
    path.android.colors,
    {
      isArray: tagName => {
        if (['color'].indexOf(tagName) !== -1) {
          return true;
        }

        return false;
      },
    },
    callback,
  );
}

/**
 * Wrapper for parsing and updating the AndroidManifest.xml file.
 *
 * @param {function} callback - A function to be executed with the parsed xml
 * @returns {Promise} A promise which resolves when the xml has been parsed
 */
export async function withManifest(
  callback: (xml: AndroidManifestXML) => void,
): Promise<any> {
  return withXml<AndroidManifestXML>(
    path.android.androidManifest,
    {
      isArray: tagName => {
        if (
          [
            'intent-filter',
            'action',
            'data',
            'category',
            'activity',
            'service',
            'receiver',
            'meta-data',
            'uses-library',
            'permission',
            'uses-permission',
            'uses-permission-sdk-23',
            'uses-feature',
            'application',
          ].indexOf(tagName) !== -1
        ) {
          return true;
        }

        return false;
      },
    },
    callback,
  );
}

/**
 * Wraps the withXml function to provide a strongly typed XML object to the callback.
 *
 * @param {function(xml: NetworkSecurityConfigType.NetworkSecurityConfig): void} callback - The callback function to invoke with the XML object.
 */
export async function withNetworkSecurityConfig(
  callback: (xml: NetworkSecurityConfigXML) => void,
) {
  const networkSecurityConfigPath = path.project.resolve(
    'android',
    'app',
    'src',
    'main',
    'res',
    'xml',
    'network_security_config.xml',
  );

  /**
   * Check if network_security_config.xml exists. If it does not exist, write
   * a new empty network_security_config.xml.
   *
   * This file is not available by default because it can interfere with
   * Metro bundler connection.
   */
  if (!nodeFS.existsSync(networkSecurityConfigPath)) {
    await fs.mkdir(
      path.project.resolve('android', 'app', 'src', 'main', 'res', 'xml'),
      {recursive: true},
    );

    await fs.writeFile(
      networkSecurityConfigPath,
      new XMLBuilder(BUILD_OPTS).build({
        '?xml': {
          $: {
            version: '1.0',
            encoding: 'utf-8',
          },
        },
        'network-security-config': {},
      }),
    );
  }

  /**
   * Function that applies the network security config to the AndroidManifest.xml file.
   * Only apply `android:networkSecurityConfig` to AndroidManifest.xml when this parser
   * is used because it will then affect localhost, 10.0.2.2, etc. connection as the default
   * network security configuration is empty - a domain-config would need to be added for
   * those hosts to connect to.
   *
   * @example
   * ```xml
   * <?xml version="1.0" encoding="utf-8"?>
   * <network-security-config>
   *     <domain-config cleartextTrafficPermitted="true">
   *         <domain includeSubdomains="true">localhost</domain>
   *         <domain includeSubdomains="true">10.0.2.2</domain>
   *     </domain-config>
   * </network-security-config>
   * ```
   */
  await withManifest(xml => {
    const mainApplication = xml.manifest.application?.find(
      it => it.$['android:name'] === '.MainApplication',
    );

    if (!mainApplication) {
      throw new Error(
        '[AndroidManifestTransformer]: cannot set network security configuration because .MainApplication not found',
      );
    }

    mainApplication.$['android:networkSecurityConfig'] =
      '@xml/network_security_config';
  });

  return withXml(
    networkSecurityConfigPath,
    {
      isArray: tagName => {
        if (
          ['certificates', 'domain', 'domain-config'].indexOf(tagName) !== -1
        ) {
          return true;
        }

        return false;
      },
    },
    callback,
  );
}

/**
 * Wraps the XML object with a withXml function call.
 *
 * @param callback - The callback function to call with the XML object.
 */
export async function withStrings(callback: (xml: StringsXML) => void) {
  return withXml<StringsXML>(
    path.android.strings,
    {
      isArray: tagName => {
        if (
          ['string', 'string-array', 'item', 'plurals'].indexOf(tagName) !== -1
        ) {
          return true;
        }

        return false;
      },
    },
    callback,
  );
}

/**
 * Asynchronously reads the Android styles XML file at the specified path and invokes the provided callback function.
 *
 * @async
 * @function
 * @param {function} callback - The callback function to invoke with the parsed XML data.
 * @returns {Promise<void>}
 */
export async function withStyles(
  callback: (xml: StylesXML) => void,
): Promise<void> {
  return withXml<StylesXML>(
    path.android.styles,
    {
      isArray: tagName => {
        if (['style', 'item'].indexOf(tagName) !== -1) {
          return true;
        }

        return false;
      },
    },
    callback,
  );
}
