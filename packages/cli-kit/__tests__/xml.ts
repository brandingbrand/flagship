import fs from "fs/promises";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

import {
  BUILD_OPTS,
  OPTS,
  withColors,
  withManifest,
  withNetworkSecurityConfig,
  withStrings,
  withStyles,
  withXml,
} from "../src/parsers/xml";
import path from "../src/lib/path";

jest.mock("fs/promises");
jest.mock("fast-xml-parser");

describe("xml", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("withXml should parse, modify, and write XML file", async () => {
    const path = "/path/to/xml";
    const originalXml = { root: { element: "value" } };
    const modifiedXml = { root: { element: "modifiedValue" } };

    jest.spyOn(fs, "readFile").mockResolvedValue(JSON.stringify(originalXml));
    jest.spyOn(XMLParser.prototype, "parse").mockReturnValue(originalXml);

    await withXml(path, {}, (xml: any) => {
      expect(xml).toEqual(originalXml);

      xml.root.element = "modifiedValue";
    });

    expect(fs.readFile).toHaveBeenCalledWith(path);
    expect(XMLParser).toHaveBeenCalledWith({
      ...OPTS,
    });
    expect(fs.writeFile).toHaveBeenCalledWith(
      path,
      new XMLBuilder({ ...BUILD_OPTS, format: true }).build(modifiedXml)
    );
  });

  it("withStyles should parse, modify, and write styles XML file", async () => {
    const xmlContent = `<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <!-- Customize your theme here. -->
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
</style>`;
    const xmlObject = {
      style: {
        item: [
          "@color/colorPrimary",
          "@color/colorPrimaryDark",
          "@color/colorAccent",
        ],
      },
    };

    const callback = jest.fn();
    jest.spyOn(XMLParser.prototype, "parse").mockReturnValue(xmlObject);
    jest.spyOn(XMLBuilder.prototype, "build").mockReturnValue(xmlContent);

    await withStyles(callback);

    expect(fs.readFile).toHaveBeenCalledWith(path.android.styles);
    expect(callback).toHaveBeenCalledWith(xmlObject);
    expect(fs.writeFile).toHaveBeenCalledWith(path.android.styles, xmlContent);
  });

  it("withStrings should parse, modify, and write strings XML file", async () => {
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
    <resources>
        <string-array name="planets_array">
            <item>Mercury</item>
            <item>Venus</item>
            <item>Earth</item>
            <item>Mars</item>
        </string-array>
    </resources>`;
    const xmlObject = {
      resources: {
        "string-array": {
          item: ["Mercury", "Venus", "Earth", "Mars"],
        },
      },
    };

    const callback = jest.fn();
    jest.spyOn(XMLParser.prototype, "parse").mockReturnValue(xmlObject);
    jest.spyOn(XMLBuilder.prototype, "build").mockReturnValue(xmlContent);

    await withStrings(callback);

    expect(fs.readFile).toHaveBeenCalledWith(path.android.strings);
    expect(callback).toHaveBeenCalledWith(xmlObject);
    expect(fs.writeFile).toHaveBeenCalledWith(path.android.strings, xmlContent);
  });

  it("withColors should parse, modify, and write colors XML file", async () => {
    const xmlContent =
      "<resources><color name='opaque_white'>#00000000</color></resources>";
    const xmlObject = {
      resources: {
        color: "#00000000",
      },
    };

    const callback = jest.fn();
    jest.spyOn(XMLParser.prototype, "parse").mockReturnValue(xmlObject);
    jest.spyOn(XMLBuilder.prototype, "build").mockReturnValue(xmlContent);

    await withColors(callback);

    expect(fs.readFile).toHaveBeenCalledWith(path.android.colors);
    expect(callback).toHaveBeenCalledWith(xmlObject);
    expect(fs.writeFile).toHaveBeenCalledWith(path.android.colors, xmlContent);
  });

  it("withNetworkSecurityConfig should parse, modify, and write network security config XML file", async () => {
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
    <network-security-config>
        <domain-config>
            <domain includeSubdomains="true">example.com</domain>
            <trust-anchors>
                <certificates src="@raw/my_ca"/>
            </trust-anchors>
        </domain-config>
    </network-security-config>`;
    const xmlObject = {
      "network-security-config": {
        "domain-config": {
          domain: "example.com",
          "trust-anchors": {
            certificates: "",
          },
        },
      },
    };

    const callback = jest.fn();
    jest.spyOn(XMLParser.prototype, "parse").mockReturnValue(xmlObject);
    jest.spyOn(XMLBuilder.prototype, "build").mockReturnValue(xmlContent);

    await withNetworkSecurityConfig(callback);

    expect(fs.readFile).toHaveBeenCalledWith(
      path.android.networkSecurityConfig
    );
    expect(callback).toHaveBeenCalledWith(xmlObject);
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.android.networkSecurityConfig,
      xmlContent
    );
  });

  it("withManifest should parse, modify, and write android manifest XML file", async () => {
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
    <manifest
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:versionCode="1"
        android:versionName="1.0">
    
        <!-- Beware that these values are overridden by the build.gradle file -->
        <uses-sdk android:minSdkVersion="15" android:targetSdkVersion="26" />
    
        <application
            android:allowBackup="true"
            android:icon="@mipmap/ic_launcher"
            android:roundIcon="@mipmap/ic_launcher_round"
            android:label="@string/app_name"
            android:supportsRtl="true"
            android:theme="@style/AppTheme">
    
            <!-- This name is resolved to com.example.myapp.MainActivity
                 based on the namespace property in the build.gradle file -->
            <activity android:name=".MainActivity">
                <intent-filter>
                    <action android:name="android.intent.action.MAIN" />
                    <category android:name="android.intent.category.LAUNCHER" />
                </intent-filter>
            </activity>
    
            <activity
                android:name=".DisplayMessageActivity"
                android:parentActivityName=".MainActivity" />
        </application>
    </manifest>`;
    const xmlObject = {
      manifest: {
        "uses-sdk": {
          "@_minSdkVersion": "15",
          "@_targetSdkVersion": "26",
        },
        application: {
          activity: [
            {
              "intent-filter": {
                action: {
                  "@_name": "android.intent.action.MAIN",
                },
                category: {
                  "@_name": "android.intent.category.LAUNCHER",
                },
              },
              "@_name": ".MainActivity",
            },
            {
              "@_name": ".DisplayMessageActivity",
              "@_parentActivityName": ".MainActivity",
            },
          ],
          "@_allowBackup": "true",
          "@_icon": "@mipmap/ic_launcher",
          "@_roundIcon": "@mipmap/ic_launcher_round",
          "@_label": "@string/app_name",
          "@_supportsRtl": "true",
          "@_theme": "@style/AppTheme",
        },
        "@_versionCode": "1",
        "@_versionName": "1.0",
      },
    };

    const callback = jest.fn();
    jest.spyOn(XMLParser.prototype, "parse").mockReturnValue(xmlObject);
    jest.spyOn(XMLBuilder.prototype, "build").mockReturnValue(xmlContent);

    await withManifest(callback);

    expect(fs.readFile).toHaveBeenCalledWith(path.android.androidManifest);
    expect(callback).toHaveBeenCalledWith(xmlObject);
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.android.androidManifest,
      xmlContent
    );
  });
});
