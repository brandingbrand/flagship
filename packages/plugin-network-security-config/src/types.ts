import type {
  NetworkSecurityCertificates,
  NetworkSecurityDomainConfig,
  Plugin,
} from '@brandingbrand/code-cli-kit';

export type NetworkSecurityConfigKind = 'debug' | 'release';

export type CodePluginNetworkSecurityConfig = {
  codePluginNetworkSecurityConfig?: Plugin<{
    /**
     * The type of network security config to generate.
     *
     * if `debug`, the generated config will allow cleartext traffic and trust user certificates.
     * if `release`, the generated config will only trust system certificates.
     *
     * @default 'release'
     */
    preset?: NetworkSecurityConfigKind;

    /**
     * Directory containing custom certificates to include in the network security config.
     *
     * **IMPORTANT:** configuring this option will only copy the certificates to the `res/raw` directory.
     * To include the certificate in the network security config, you must also include the certificate through the `certificates`, `debugCertificates`, or `domainConfig` options.
     *
     */
    certificatesDir?: string;

    /**
     * Additional custom certificates to include in the `base-config` section of the network security config.
     *
     * This option will not overwrite the default certificates configuration included by the `preset` option.
     */
    certificates?: (NetworkSecurityCertificates | `@raw/${string}`)[];

    /**
     * Additional custom certificates to include in the `debug-overrides` section of the network security config.
     *
     * This option will not overwrite the default certificates configuration included by the `preset` option.
     *
     * If the value is a string, it is treated as the resource ID of the certificate.
     *
     * @example ```ts
     * debugCertificates: [
     *   '@raw/cert.pem',
     *   { src: '@raw/another-cert.pem' }
     */
    debugCertificates?: (NetworkSecurityCertificates | `@raw/${string}`)[];

    /**
     * Custom domain configuration to include in the network security config.
     *
     * This option allows for full customization of the `domain-config` section of the network security config.
     */
    domainConfig?: NetworkSecurityDomainConfig[];
  }>;
};
