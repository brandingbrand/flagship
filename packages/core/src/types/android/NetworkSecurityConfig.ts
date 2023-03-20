export type CertificatesAttributes = {
  src: "system" | "user" | "raw resource";
  overridePins: boolean;
};

export type Certificates = {
  $: CertificatesAttributes;
};

export type TrustAnchorsElements = {
  certificates?: Certificates[];
};

export type TrustAnchors = TrustAnchorsElements;

export type BaseConfigElements = {
  ["trust-anchors"]: TrustAnchors;
};

export type BaseConfigAttributes = {
  cleartextTrafficPermitted: boolean;
};

export type BaseConfig = BaseConfigElements & {
  $: BaseConfigAttributes;
};

export type DomainAttributes = {
  includeSubdomains: boolean;
};

export type Domain = {
  $: DomainAttributes;
  _: string;
};

export type PinAttributes = {
  digest: "SHA-256";
};

export type Pin = {
  $: PinAttributes;
  _: string;
};

export type PinSetElements = {
  pin: Pin;
};

export type PinSetAttributes = {
  expiration: string;
};

export type PinSet = PinSetElements & {
  $: PinSetAttributes;
};

export type DomainConfigElements = {
  domain: Domain[];
  ["trust-anchors"]?: TrustAnchors;
  ["pin-set"]?: PinSet;
  ["domain-config"]?: DomainConfig[];
};

export type DomainConfigAttributes = {
  cleartextTrafficPermitted: boolean;
};

export type DomainConfig = DomainConfigElements & {
  $: DomainConfigAttributes;
};

export type DebugOverridesElements = {
  ["trust-anchors"]?: TrustAnchors;
};

export type DebugOverrides = DebugOverridesElements;

export type NetworkSecurityConfigElements = {
  ["base-config"]?: BaseConfig;
  ["domain-config"]?: DomainConfig[];
  ["debug-overrides"]?: DebugOverrides;
};

export type NetworkSecurityConfig = {
  ["network-security-config"]: NetworkSecurityConfigElements;
};
