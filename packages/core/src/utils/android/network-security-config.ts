/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml";

import type { NetworkSecurityConfigType } from "../../types/android";

const tagNames = ["certificates", "domain", "domain-config"];

const withNetworkSecurityConfig = async (
  callback: (xml: NetworkSecurityConfigType.NetworkSecurityConfig) => void
) =>
  withXml(
    path.project.resolve(
      path.android.resourcesPath(),
      "xml",
      "network_security_config.xml"
    ),
    {
      isArray: (tagName, _jPath, _isLeafNode, _isAttribute) => {
        if (tagNames.indexOf(tagName) !== -1) {
          return true;
        }

        return false;
      },
    },
    callback
  );

export const setBaseConfig = (config: NetworkSecurityConfigType.BaseConfig) =>
  withNetworkSecurityConfig(async (xml) => {
    if (typeof xml["network-security-config"] === "string") {
      return (xml["network-security-config"] = {
        "base-config": config,
      });
    }

    xml["network-security-config"]["base-config"] = config;
  });

export const setDebugOverrides = (
  config: NetworkSecurityConfigType.DebugOverrides
) =>
  withNetworkSecurityConfig(async (xml) => {
    if (typeof xml["network-security-config"] === "string") {
      return (xml["network-security-config"] = {
        "debug-overrides": config,
      });
    }

    xml["network-security-config"]["debug-overrides"] = config;
  });

export const addDomainConfig = (
  config: NetworkSecurityConfigType.DomainConfig[]
) =>
  withNetworkSecurityConfig(async (xml) => {
    if (typeof xml["network-security-config"] === "string") {
      return (xml["network-security-config"] = {
        "domain-config": config,
      });
    }

    xml["network-security-config"]["domain-config"]
      ? xml["network-security-config"]["domain-config"].concat(config)
      : (xml["network-security-config"]["domain-config"] = config);
  });
