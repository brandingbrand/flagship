/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml";

import type { NetworkSecurityConfigType } from "../../types/android";

/**
 * The list of tag names that should be handled as arrays.
 *
 * @type {string[]}
 */
const tagNames = ["certificates", "domain", "domain-config"];

/**
 * Wraps the withXml function to provide a strongly typed XML object to the callback.
 *
 * @param {function(xml: NetworkSecurityConfigType.NetworkSecurityConfig): void} callback - The callback function to invoke with the XML object.
 */
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

/**
 * Sets the base config for the network security configuration.
 *
 * @param {NetworkSecurityConfigType.BaseConfig} config - The base configuration to set.
 */
export const setBaseConfig = (config: NetworkSecurityConfigType.BaseConfig) =>
  withNetworkSecurityConfig(async (xml) => {
    if (typeof xml["network-security-config"] === "string") {
      return (xml["network-security-config"] = {
        "base-config": config,
      });
    }

    xml["network-security-config"]["base-config"] = config;
  });

/**
 * Sets the debug overrides for the network security configuration.
 *
 * @param {NetworkSecurityConfigType.DebugOverrides} config - The debug overrides to set.
 */
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

/**
 * Adds domain configurations to the network security configuration.
 *
 * @param {NetworkSecurityConfigType.DomainConfig[]} config - An array of domain configurations to add.
 */
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
