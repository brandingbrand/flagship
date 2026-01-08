/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "fixtures"}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {defineBuild, fs, path} from '@brandingbrand/code-cli-kit';

import plugin, {type CodePluginNetworkSecurityConfig} from '../src';

const resPath = path.project.resolve('android', 'app', 'src', 'main', 'res');

type PluginConfig = NonNullable<
  CodePluginNetworkSecurityConfig['codePluginNetworkSecurityConfig']
>['plugin'];
/**
 * Executes the plugin with the provided configuration and returns the generated network security config XML as a string.
 */
const runPluginTest = async (config?: PluginConfig): Promise<string> => {
  await plugin.android?.(
    defineBuild<CodePluginNetworkSecurityConfig>({
      ...global.__flagship_code_build_config,
      codePluginNetworkSecurityConfig: config
        ? {
            plugin: config,
          }
        : undefined,
    }),
    {} as any,
  );

  return fs.readFile(
    path.resolve(resPath, 'xml', 'network_security_config.xml'),
    'utf-8',
  );
};

describe('plugin-network-security-config', () => {
  afterEach(async () => {
    await global.resetFixture();
  });

  test.each([
    [
      'release',
      `<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </base-config>
</network-security-config>`,
    ],
    [
      'debug',
      `<network-security-config>
    <debug-overrides>
        <trust-anchors>
            <certificates src="user"/>
            <certificates src="system"/>
        </trust-anchors>
    </debug-overrides>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system"/>
            <certificates src="user"/>
        </trust-anchors>
    </base-config>
</network-security-config>`,
    ],
  ] as const)(
    'When `preset` is set to `%p`, generates the appropriate `network_security_config.xml`',
    async (preset, expected) => {
      const nsc = await runPluginTest({preset});
      expect(nsc).toContain(expected);
    },
  );

  test('When `certificatesDir` is defined, copies the contents of the configured directory to android raw resources', async () => {
    await runPluginTest({
      certificatesDir: 'coderc/certificates',
    });
    const certExists = await fs.doesPathExist(
      path.resolve(resPath, 'raw', 'cert'),
    );
    expect(certExists).toBe(true);
  });

  test('When `certificates` is defined, appends the defined elements to the base config trust anchors', async () => {
    const nsc = await runPluginTest({
      certificates: [{$: {src: '@raw/cert'}}],
    });

    expect(nsc).toContain(`<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src="system"/>
            <certificates src="@raw/cert"/>
        </trust-anchors>
    </base-config>
</network-security-config>`);
  });

  test('When `debugCertificates` is defined, appends the defined elements to the debug override trust anchors', async () => {
    const nsc = await runPluginTest({
      preset: 'debug',
      debugCertificates: [{$: {src: '@raw/cert'}}],
    });

    expect(nsc).toContain(`<network-security-config>
    <debug-overrides>
        <trust-anchors>
            <certificates src="user"/>
            <certificates src="system"/>
            <certificates src="@raw/cert"/>
        </trust-anchors>
    </debug-overrides>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system"/>
            <certificates src="user"/>
        </trust-anchors>
    </base-config>
</network-security-config>`);
  });

  test('When `domainConfig` is defined, appends the defined elements to the network security config', async () => {
    const nsc = await runPluginTest({
      domainConfig: [
        {
          $: {cleartextTrafficPermitted: false},
          domain: [{_: 'example.com'}],
          'trust-anchors': {
            certificates: [{$: {src: '@raw/cert'}}],
          },
          'domain-config': [
            {
              $: {cleartextTrafficPermitted: true},
              domain: [{_: 'sub.example.com', $: {includeSubdomains: true}}],
              'trust-anchors': {
                certificates: [{$: {src: '@raw/subcert'}}],
              },
              'pin-set': {
                $: {expiration: '2025-12-31'},
                pin: [{_: 'pin1', $: {digest: 'SHA-256'}}],
              },
            },
          ],
        },
      ],
    });

    expect(nsc).toContain(`<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src=\"system\"/>
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted=\"false\">
        <domain>example.com</domain>
        <trust-anchors>
            <certificates src=\"@raw/cert\"/>
        </trust-anchors>
        <domain-config cleartextTrafficPermitted=\"true\">
            <domain includeSubdomains=\"true\">sub.example.com</domain>
            <trust-anchors>
                <certificates src=\"@raw/subcert\"/>
            </trust-anchors>
            <pin-set expiration=\"2025-12-31\">
                <pin digest=\"SHA-256\">pin1</pin>
            </pin-set>
        </domain-config>
    </domain-config>
</network-security-config>`);
  });
});
