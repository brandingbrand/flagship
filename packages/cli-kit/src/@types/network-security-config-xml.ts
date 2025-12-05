/**
 * Represents the attributes of the certificate transparency configuration.
 */
type CertificateTransparencyAttributes = {
  /**
   * Indicates whether certificate validation through Certificate Transparency logs is enabled.
   */
  enabled: boolean;
};

/**
 * Represents the certificate transparency configuration, which indicates whether validation through Certificate Transparency logs is enabled.
 */
type CertificateTransparency = {
  /**
   * Attributes of the certificate transparency configuration.
   */
  $: CertificateTransparencyAttributes;
};

/**
 * Represents the attributes of a certificate entry.
 */
type CertificatesAttributes = {
  /**
   * Source of the certificate, can be "system," "user," or a raw resource ID.
   */
  src: 'system' | 'user' | `@raw/${string}`;

  /**
   * Optional: Indicates whether to override pins for the certificate.
   */
  overridePins?: boolean;
};

/**
 * Represents a certificate entry in the network security configuration.
 */
type Certificates = {
  /**
   * Attributes of the certificate entry.
   */
  $: CertificatesAttributes;
};

/**
 * Represents the elements within the trust anchors section, which may include certificates.
 */
type TrustAnchorsElements = {
  /**
   * Array of certificate entries.
   */
  certificates?: Certificates[];
};

/**
 * Represents the trust anchors section in the network security configuration.
 */
type TrustAnchors = TrustAnchorsElements;

/**
 * Represents the elements within the base configuration section.
 */
type BaseConfigElements = {
  /**
   * Optional: Certificate transparency validation configuration.
   */
  certificateTransparency?: CertificateTransparency;

  /**
   * Trust anchors section in the base configuration.
   */
  ['trust-anchors']?: TrustAnchors;
};

/**
 * Represents the attributes of the base configuration.
 */
type BaseConfigAttributes = {
  /**
   * Optional: Indicates whether cleartext traffic is permitted.
   */
  cleartextTrafficPermitted?: boolean;
};

/**
 * Represents the base configuration in the network security configuration.
 */
type BaseConfig = BaseConfigElements & {
  /**
   * Attributes of the base configuration.
   */
  $?: BaseConfigAttributes;
};

/**
 * Represents the attributes of a domain entry.
 */
type DomainAttributes = {
  /**
   * Indicates whether subdomains are included.
   */
  includeSubdomains?: boolean;
};

/**
 * Represents a domain entry in the network security configuration.
 */
type Domain = {
  /**
   * Attributes of the domain entry.
   */
  $?: DomainAttributes;

  /**
   * The domain string.
   */
  _: string;
};

/**
 * Represents the attributes of a pin entry.
 */
type PinAttributes = {
  /**
   * Digest algorithm for the pin entry, always "SHA-256."
   */
  digest: 'SHA-256';
};

/**
 * Represents a pin entry in the network security configuration.
 */
type Pin = {
  /**
   * Attributes of the pin entry.
   */
  $: PinAttributes;

  /**
   * The pin value.
   */
  _: string;
};

/**
 * Represents the elements within a pin set, which includes a single pin entry.
 */
type PinSetElements = {
  /**
   * Pin entry.
   */
  pin: Pin[];
};

/**
 * Represents the attributes of a pin set.
 */
type PinSetAttributes = {
  /**
   * Expiration string for the pin set.
   */
  expiration?: string;
};

/**
 * Represents a pin set in the network security configuration.
 */
type PinSet = PinSetElements & {
  /**
   * Attributes of the pin set.
   */
  $?: PinSetAttributes;
};

/**
 * Represents the elements within a domain configuration, which may include domains, trust anchors, and pin sets.
 */
type DomainConfigElements = {
  /**
   * Array of domain entries.
   *
   * Must have at least one domain.
   */
  domain: Domain[];

  /**
   * Optional: Certificate transparency validation configuration.
   */
  certificateTransparency?: CertificateTransparency;

  /**
   * Optional: Trust anchors section in the domain configuration.
   */
  ['trust-anchors']?: TrustAnchors;

  /**
   * Optional: Pin set in the domain configuration.
   */
  ['pin-set']?: PinSet;

  /**
   * Optional: Nested domain configurations.
   */
  ['domain-config']?: DomainConfig[];
};

/**
 * Represents the attributes of a domain configuration.
 */
type DomainConfigAttributes = {
  /**
   * Indicates whether cleartext traffic is permitted for the domain configuration.
   */
  cleartextTrafficPermitted?: boolean;
};

/**
 * Represents a domain configuration in the network security configuration.
 */
type DomainConfig = DomainConfigElements & {
  /**
   * Attributes of the domain configuration.
   */
  $?: DomainConfigAttributes;
};

/**
 * Represents the elements within the debug overrides section, which may include trust anchors.
 */
type DebugOverridesElements = {
  /**
   * Optional: Trust anchors section in the debug overrides.
   */
  ['trust-anchors']?: TrustAnchors;
};

/**
 * Represents the debug overrides section in the network security configuration.
 */
type DebugOverrides = DebugOverridesElements;

/**
 * Represents the elements within the network security configuration, which may include base configuration, domain configurations, and debug overrides.
 */
type NetworkSecurityConfigElements = {
  /**
   * Optional: Base configuration in the network security configuration.
   */
  ['base-config']?: BaseConfig;

  /**
   * Optional: Array of domain configurations in the network security configuration.
   */
  ['domain-config']?: DomainConfig[];

  /**
   * Optional: Debug overrides in the network security configuration.
   */
  ['debug-overrides']?: DebugOverrides;
};

/**
 * Represents the entire network security configuration file.
 */
export type NetworkSecurityConfigXML = {
  /**
   * Root element, containing elements for network security configuration.
   */
  ['network-security-config']: NetworkSecurityConfigElements;
};

export {
  type BaseConfig as NetworkSecurityBaseConfig,
  type DomainConfig as NetworkSecurityDomainConfig,
  type Domain as NetworkSecurityDomain,
  type CertificateTransparency as NetworkSecurityCertificateTransparency,
  type DebugOverrides as NetworkSecurityDebugOverrides,
  type TrustAnchors as NetworkSecurityTrustAnchors,
  type Certificates as NetworkSecurityCertificates,
  type PinSet as NetworkSecurityPinSet,
  type Pin as NetworkSecurityPin,
};
