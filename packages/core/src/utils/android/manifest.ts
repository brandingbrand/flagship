/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml";

import type { AndroidManifestType } from "../../types/android";

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

const withManifest = async (
  callback: (xml: AndroidManifestType.AndroidManifest) => void
) =>
  withXml<AndroidManifestType.AndroidManifest>(
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
  androidManifest: AndroidManifestType.AndroidManifest,
  applicationName: string
) =>
  androidManifest.manifest.application?.find(
    (it) => it.$["android:name"] === applicationName
  );

const getActivity = (
  androidManifest: AndroidManifestType.AndroidManifest,
  applicationName: string,
  activityName: string
) =>
  androidManifest.manifest.application
    ?.find((it) => it.$["android:name"] === applicationName)
    ?.activity?.find((it) => it.$["android:name"] === activityName);

export const setManifestAttributes = (
  attributes: Partial<AndroidManifestType.AndroidManifestAttributes>
) =>
  withManifest((xml) => {
    xml.manifest.$ = {
      ...xml.manifest.$,
      ...attributes,
    };
  });

export const setApplicationAttributes = (
  attrbutes: Partial<AndroidManifestType.ManifestApplicationAttributes>,
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
  attrbutes: Partial<AndroidManifestType.ManifestActivityAttributes>,
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
  elements: AndroidManifestType.ManifestApplicationElements,
  applicationName = ".MainApplication"
) =>
  withManifest((xml) => {
    const mainApplication = getApplication(xml, applicationName);

    if (!mainApplication) return;

    elements.activity?.forEach((it) =>
      mainApplication.activity
        ? mainApplication.activity.push(it)
        : (mainApplication.activity = [it])
    );

    elements["meta-data"]?.forEach((it) =>
      mainApplication["meta-data"]
        ? mainApplication["meta-data"].push(it)
        : (mainApplication["meta-data"] = [it])
    );

    elements.receiver?.forEach((it) =>
      mainApplication.receiver
        ? mainApplication.receiver.push(it)
        : (mainApplication.receiver = [it])
    );

    elements.service?.forEach((it) =>
      mainApplication.service
        ? mainApplication.service.push(it)
        : (mainApplication.service = [it])
    );

    elements["uses-library"]?.forEach((it) =>
      mainApplication["uses-library"]
        ? mainApplication["uses-library"].push(it)
        : (mainApplication["uses-library"] = [it])
    );

    elements.provider?.forEach((it) =>
      mainApplication.provider
        ? mainApplication.provider.push(it)
        : (mainApplication.provider = [it])
    );
  });

export const addActivityElements = (
  elements: AndroidManifestType.ManifestActivityElements,
  applicationName = ".MainApplication",
  activityName = ".MainActivity"
) =>
  withManifest((xml) => {
    const mainActivity = getActivity(xml, applicationName, activityName);

    if (!mainActivity) return;

    elements["intent-filter"]?.forEach((it) =>
      mainActivity["intent-filter"]
        ? mainActivity["intent-filter"].push(it)
        : (mainActivity["intent-filter"] = [it])
    );
  });

export const addManifestElements = (
  elements: AndroidManifestType.AndroidManifestElements
) =>
  withManifest((xml) => {
    elements.application?.forEach((it) =>
      xml.manifest.application
        ? xml.manifest.application.push(it)
        : (xml.manifest.application = [it])
    );

    elements.permission?.forEach((it) =>
      xml.manifest.permission
        ? xml.manifest.permission.push(it)
        : (xml.manifest.permission = [it])
    );

    elements["uses-feature"]?.forEach((it) =>
      xml.manifest["uses-feature"]
        ? xml.manifest["uses-feature"].push(it)
        : (xml.manifest["uses-feature"] = [it])
    );

    elements["uses-permission-sdk-23"]?.forEach((it) =>
      xml.manifest["uses-permission-sdk-23"]
        ? xml.manifest["uses-permission-sdk-23"].push(it)
        : (xml.manifest["uses-permission-sdk-23"] = [it])
    );

    elements["uses-permission"]?.forEach((it) =>
      xml.manifest["uses-permission"]
        ? xml.manifest["uses-permission"].push(it)
        : (xml.manifest["uses-permission"] = [it])
    );
  });
