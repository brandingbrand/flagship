import fsn from 'fs';

import {
  definePlugin,
  fs,
  path,
  logger,
  withStyles,
  type BuildConfig,
} from '@brandingbrand/code-cli-kit';
import sharp from 'sharp';

import {CodePluginSplashScreen} from './types';

async function generateAndroidSplash(
  sourceImage: string,
  androidPath: string,
): Promise<void> {
  // Create drawable folder if it doesn't exist
  const drawablePath = path.join(androidPath, 'app/src/main/res/drawable');
  await fs.mkdir(drawablePath, {recursive: true});

  // Copy image to drawable
  await sharp(sourceImage)
    .png()
    .toFile(path.join(drawablePath, 'bootsplash_logo.png'));

  // Create splash.xml
  const splashXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:drawable="@drawable/bootsplash_logo"
        android:gravity="fill" />
</layer-list>`;

  await fs.writeFile(path.join(drawablePath, 'splash.xml'), splashXml);

  await withStyles(xml => {
    // Find the AppTheme style
    const appTheme = xml.resources.style.find(
      style => style.$.name === 'AppTheme',
    );

    if (appTheme) {
      // Replace all items with the new windowBackground item
      appTheme.item = [
        {
          _: '@drawable/splash',
          $: {
            name: 'android:windowBackground',
          },
        },
      ];
    }
  });

  logger.info('Generated Android splash screen');
}

async function generateIOSSplash(
  sourceImage: string,
  iosPath: string,
): Promise<void> {
  // Create LaunchImage.imageset folder
  const launchImagePath = path.join(
    iosPath,
    'Images.xcassets/LaunchImage.imageset',
  );
  await fs.mkdir(launchImagePath, {recursive: true});

  // Generate 1x, 2x, and 3x images
  const sizes = [
    {suffix: '', scale: 1, width: 414, height: 736},
    {suffix: '@2x', scale: 2, width: 828, height: 1472},
    {suffix: '@3x', scale: 3, width: 1242, height: 2208},
  ];

  for (const size of sizes) {
    await sharp(sourceImage)
      .resize(size.width, size.height)
      .png()
      .toFile(path.join(launchImagePath, `LaunchImage${size.suffix}.png`));
  }

  // Create Contents.json
  const contents = {
    images: sizes.map(size => ({
      filename: `LaunchImage${size.suffix}.png`,
      idiom: 'universal',
      scale: `${size.scale}x`,
    })),
    info: {
      author: 'xcode',
      version: 1,
    },
  };

  await fs.writeFile(
    path.join(launchImagePath, 'Contents.json'),
    JSON.stringify(contents, null, 2),
  );

  // Create LaunchScreen.storyboard
  const storyboard = `<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="21507" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="01J-lp-oVM">
    <device id="retina6_12" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="21505"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <scene sceneID="EHf-IW-A2E">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <view key="view" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <rect key="frame" x="0.0" y="0.0" width="393" height="852"/>
                        <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <imageView clipsSubviews="YES" userInteractionEnabled="NO" contentMode="scaleAspectFill" horizontalHuggingPriority="251" verticalHuggingPriority="251" image="LaunchImage" translatesAutoresizingMaskIntoConstraints="NO" id="hqe-7Y-Nyl">
                                <rect key="frame" x="0.0" y="0.0" width="393" height="852"/>
                            </imageView>
                        </subviews>
                        <viewLayoutGuide key="safeArea" id="Bcu-3y-fUS"/>
                        <constraints>
                            <constraint firstItem="hqe-7Y-Nyl" firstAttribute="leading" secondItem="Ze5-6b-2t3" secondAttribute="leading" id="KU3-OF-UYc"/>
                            <constraint firstAttribute="trailing" secondItem="hqe-7Y-Nyl" secondAttribute="trailing" id="Kw9-8E-DYx"/>
                            <constraint firstItem="hqe-7Y-Nyl" firstAttribute="top" secondItem="Ze5-6b-2t3" secondAttribute="top" id="U5O-AN-4KJ"/>
                            <constraint firstAttribute="bottom" secondItem="hqe-7Y-Nyl" secondAttribute="bottom" id="eLz-cx-mBd"/>
                        </constraints>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="53" y="375"/>
        </scene>
    </scenes>
    <resources>
        <image name="LaunchImage" width="414" height="736"/>
    </resources>
</document>`;

  await fs.writeFile(path.join(iosPath, 'LaunchScreen.storyboard'), storyboard);

  logger.info('Generated iOS splash screen');
}

export default definePlugin({
  async ios(build: BuildConfig & CodePluginSplashScreen): Promise<void> {
    const {splashImage} = build.codePluginSplashScreen.plugin;

    if (!splashImage) {
      throw new Error('splashImage must be provided');
    }

    const iosPath = path.project.resolve('ios', 'app');

    if (!fsn.existsSync(splashImage)) {
      throw new Error(`Source image not found: ${splashImage}`);
    }

    // Verify image dimensions
    const metadata = await sharp(splashImage).metadata();
    if (metadata.width !== 1242 || metadata.height !== 2208) {
      logger.warn('Image should be 1242x2208px for optimal results');
    }

    await generateIOSSplash(splashImage, iosPath);
  },

  async android(build: BuildConfig & CodePluginSplashScreen): Promise<void> {
    const {splashImage} = build.codePluginSplashScreen.plugin;

    if (!splashImage) {
      throw new Error('splashImage must be provided');
    }

    const androidPath = path.project.resolve('android');

    if (!fsn.existsSync(splashImage)) {
      throw new Error(`Source image not found: ${splashImage}`);
    }

    await generateAndroidSplash(splashImage, androidPath);
  },
});

export * from './types';
