/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  NetworkSecurityCertificates,
  NetworkSecurityConfigXML,
  definePlugin,
  fs,
  path,
  withNetworkSecurityConfig,
} from '@brandingbrand/code-cli-kit';

import type {
  CodePluginNetworkSecurityConfig,
  NetworkSecurityConfigKind,
} from './types';

const baseConfigs: Record<
  NetworkSecurityConfigKind,
  NetworkSecurityConfigXML['network-security-config']
> = {
  debug: {
    'debug-overrides': {
      'trust-anchors': {
        certificates: [{$: {src: 'user'}}, {$: {src: 'system'}}],
      },
    },
    'base-config': {
      $: {
        cleartextTrafficPermitted: true,
      },
      'trust-anchors': {
        certificates: [{$: {src: 'system'}}, {$: {src: 'user'}}],
      },
    },
  },
  release: {
    'base-config': {
      'trust-anchors': {
        certificates: [{$: {src: 'system'}}],
      },
    },
  },
};

function normalizeCertificates(
  certificates: (NetworkSecurityCertificates | `@raw/${string}`)[],
): NetworkSecurityCertificates[] {
  return certificates.map<NetworkSecurityCertificates>(it => {
    if (typeof it === 'string') {
      return {
        $: {src: it},
      };
    } else {
      return it;
    }
  });
}

export default definePlugin<CodePluginNetworkSecurityConfig>({
  android: async build => {
    const {
      preset = 'release',
      certificates,
      certificatesDir,
      debugCertificates,
      domainConfig,
    } = build?.codePluginNetworkSecurityConfig?.plugin ?? {};

    if (certificatesDir) {
      const resolvedSrc = path.project.resolve(certificatesDir);
      if (!(await fs.doesPathExist(resolvedSrc))) {
        throw new Error(
          `The specified certificatesDir "${certificatesDir}" does not exist at path: ${resolvedSrc}`,
        );
      }

      const destDir = path.project.resolve(
        'android',
        'app',
        'src',
        'main',
        'res',
        'raw',
      );
      await fs.mkdir(destDir, {recursive: true});
      await fs.cp(resolvedSrc, destDir, {recursive: true});
    }

    await withNetworkSecurityConfig(xml => {
      const presetConfig = baseConfigs[preset];
      const config: NetworkSecurityConfigXML['network-security-config'] = {
        ...presetConfig,
      };

      if (certificates && certificates.length > 0) {
        config['base-config'] = {
          ...config['base-config'],
          'trust-anchors': {
            certificates: [
              ...(presetConfig['base-config']?.['trust-anchors']
                ?.certificates ?? []),
              ...normalizeCertificates(certificates),
            ],
          },
        };
      }

      if (debugCertificates && debugCertificates.length > 0) {
        config['debug-overrides'] = {
          ...config['debug-overrides'],
          'trust-anchors': {
            certificates: [
              ...(presetConfig['debug-overrides']?.['trust-anchors']
                ?.certificates ?? []),
              ...normalizeCertificates(debugCertificates),
            ],
          },
        };
      }

      if (domainConfig) {
        config['domain-config'] = domainConfig;
      }

      xml['network-security-config'] = config;
    });
  },
});

export type {CodePluginNetworkSecurityConfig};
