/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml-fp";

import type {
  AndroidManifest,
  AndroidManifestAttributes,
  ManifestApplicationAttributes,
} from "../../types/manifest";

const arr = [
  "intent-filter",
  "action",
  "data",
  "category",
  "activity",
  "service",
  "receiver",
  "meta-data",
  "uses-library",
  "permission",
  "uses-permission",
  "uses-permission-sdk-23",
  "uses-feature",
  "application",
];

const withManifest = async (callback: (xml: AndroidManifest) => void) =>
  withXml<AndroidManifest>(
    path.android.manifestPath(),
    {
      isArray: (tagName, _jPath, _isLeafNode, _isAttribute) => {
        if (arr.indexOf(tagName) !== -1) {
          return true;
        }

        return false;
      },
    },
    callback
  );

const getMainApplication = (androidManifest: AndroidManifest) =>
  androidManifest.manifest.application?.find(
    (it) => it.$["android:name"] === ".MainApplication"
  );

const getMainActivity = (androidManifest: AndroidManifest) =>
  androidManifest.manifest.application
    ?.find((it) => it.$["android:name"] === ".MainApplication")
    ?.activity?.find((it) => it.$["android:name"] === ".MainActivity");

export const setManifestAttributes = (attributes: AndroidManifestAttributes) =>
  withManifest((xml) => {
    xml.manifest.$ = {
      ...xml.manifest.$,
      ...attributes,
    };
  });

export const setMainApplicationAttributes = (
  attrbutes: ManifestApplicationAttributes
) =>
  withManifest((xml) => {
    const mainApplication = getMainApplication(xml);

    if (!mainApplication) return;

    mainApplication.$ = {
      ...mainApplication?.$,
      ...attrbutes,
    };
  });

export const setMainActivityAttributes = (
  attrbutes: ManifestApplicationAttributes
) =>
  withManifest((xml) => {
    const mainActivity = getMainActivity(xml);

    if (!mainActivity) return;

    mainActivity.$ = {
      ...mainActivity?.$,
      ...attrbutes,
    };
  });
