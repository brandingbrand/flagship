/**
 * @jest-environment-options {"requireTemplate": true}
 */

import fs from 'fs/promises';

import {withNetworkSecurityConfig} from '../src/parsers/xml';
import path from '../src/lib/path';

describe('network security configuration', () => {
  it('AndroidManifest.xml should not contain @xml/network_security_config by default', async () => {
    const androidManifest = await fs.readFile(
      path.android.androidManifest,
      'utf-8',
    );

    expect(androidManifest).not.toContain('@xml/network_security_config');
  });

  it('withNetworkSecurityConfig should add @xml/network_security_config to AndroidManifest.xml', async () => {
    await withNetworkSecurityConfig(xml => {});

    const androidManifest = await fs.readFile(
      path.android.androidManifest,
      'utf-8',
    );

    expect(androidManifest).toContain('@xml/network_security_config');
  });

  it('withNetworkSecurityConfig with a domain configuration should be added to @xml/network_security_config', async () => {
    await withNetworkSecurityConfig(xml => {
      if (!xml['network-security-config']['domain-config']) {
        xml['network-security-config'] = {
          'domain-config': [],
        };
      }

      xml['network-security-config']['domain-config']?.push({
        $: {cleartextTrafficPermitted: true},
        domain: [
          {
            $: {
              includeSubdomains: true,
            },
            _: 'localhost',
          },
        ],
      });
    });

    const networkSecurityConfig = await fs.readFile(
      path.project.resolve(
        'android',
        'app',
        'src',
        'main',
        'res',
        'xml',
        'network_security_config.xml',
      ),
      'utf-8',
    );

    expect(networkSecurityConfig)
      .toContain(`<domain-config cleartextTrafficPermitted=\"true\">
        <domain includeSubdomains=\"true\">localhost</domain>
    </domain-config>`);
  });
});
