/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml";

import type {
  AndroidManifest,
  AndroidManifestAttributes,
  AndroidManifestElements,
  ManifestActivityAttributes,
  ManifestActivityElements,
  ManifestApplicationAttributes,
  ManifestApplicationElements,
} from "../../types/manifest";

const tagNames = [
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
        if (tagNames.indexOf(tagName) !== -1) {
          return true;
        }

        return false;
      },
    },
    callback
  );

const getApplication = (
  androidManifest: AndroidManifest,
  applicationName: string
) =>
  androidManifest.manifest.application?.find(
    (it) => it.$["android:name"] === applicationName
  );

const getActivity = (
  androidManifest: AndroidManifest,
  applicationName: string,
  activityName: string
) =>
  androidManifest.manifest.application
    ?.find((it) => it.$["android:name"] === applicationName)
    ?.activity?.find((it) => it.$["android:name"] === activityName);

export const setManifestAttributes = (
  attributes: Partial<AndroidManifestAttributes>
) =>
  withManifest((xml) => {
    xml.manifest.$ = {
      ...xml.manifest.$,
      ...attributes,
    };
  });

export const setApplicationAttributes = (
  attrbutes: Partial<ManifestApplicationAttributes>,
  applicationName = ".MainApplication"
) =>
  withManifest((xml) => {
    const mainApplication = getApplication(xml, applicationName);

    if (!mainApplication) return;

    mainApplication.$ = {
      ...mainApplication?.$,
      ...attrbutes,
    };
  });

export const setActivityAttributes = (
  attrbutes: Partial<ManifestActivityAttributes>,
  applicationName = ".MainApplication",
  activityName = ".MainActivity"
) =>
  withManifest((xml) => {
    const mainActivity = getActivity(xml, applicationName, activityName);

    if (!mainActivity) return;

    mainActivity.$ = {
      ...mainActivity?.$,
      ...attrbutes,
    };
  });

export const addApplicationEelements = (
  elements: ManifestApplicationElements,
  applicationName = ".MainApplication"
) =>
  withManifest((xml) => {
    const mainApplication = getApplication(xml, applicationName);

    if (!mainApplication) return;

    elements.activity?.forEach((it) => {
      mainApplication.activity?.push(it);
    });

    elements["meta-data"]?.forEach((it) =>
      mainApplication["meta-data"]?.push(it)
    );

    elements.receiver?.forEach((it) => mainApplication.receiver?.push(it));

    elements.service?.forEach((it) => mainApplication.service?.push(it));

    elements["uses-library"]?.forEach((it) =>
      mainApplication["uses-library"]?.push(it)
    );
  });

export const addActivityElements = (
  elements: ManifestActivityElements,
  applicationName = ".MainApplication",
  activityName = ".MainActivity"
) =>
  withManifest((xml) => {
    const mainActivity = getActivity(xml, applicationName, activityName);

    if (!mainActivity) return;

    elements["intent-filter"]?.forEach((it) =>
      mainActivity["intent-filter"]?.push(it)
    );
  });

export const addManifestElements = (elements: AndroidManifestElements) =>
  withManifest((xml) => {
    elements.application?.forEach((it) => xml.manifest.application?.push(it));

    elements.permission?.forEach((it) => xml.manifest.permission?.push(it));

    elements["uses-feature"]?.forEach((it) =>
      xml.manifest["uses-feature"]?.push(it)
    );

    elements["uses-permission-sdk-23"]?.forEach((it) =>
      xml.manifest["uses-permission-sdk-23"]?.push(it)
    );

    elements["uses-permission"]?.forEach((it) =>
      xml.manifest["uses-permission"]?.push(it)
    );
  });
