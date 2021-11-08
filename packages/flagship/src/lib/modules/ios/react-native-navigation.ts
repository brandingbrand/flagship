// tslint:disable: ter-max-len max-line-length

import * as path from '../../path';
import * as fs from '../../fs';
import { Config } from '../../../types';
import {
  logInfo
} from '../../../helpers';

/**
 * This script patches react-native-navigation to fix tab bar styling breakages introduced when
 * compiling apps against iOS 15+.
 *
 * This issue is fixed in version 7 of React Native Navigation; this script is intended to fix the
 * current supported version (6) in this version of Flagship. This script can be removed when
 * support for v7 is introduced into Flagship, but is coded such that it will not run if the changes
 * have already been applied to the dependency and thus should be safe for future Flagship versions.
 *
 * The changes are based on a patch suggested by a user in the RNN issue tracker.
 * @see https://github.com/wix/react-native-navigation/issues/7266#issuecomment-925706532
 *
 * @param {object} configuration The project configuration.
 */
export function preLink(configuration: Config): void {
  logInfo('Patching iOS for react-native-navigation');

  // Patch BottomTabsAppearancePresenter.m

  const bottomTabsAppearancePresenterPath = path.project.resolve(
    'node_modules',
    'react-native-navigation',
    'lib',
    'ios',
    'BottomTabsAppearancePresenter.m'
  );

  if (fs.doesKeywordExist(bottomTabsAppearancePresenterPath, 'iOS 15.0')) {
    logInfo('react-native-navigation appears to have already been patched for ios 15 tab bars');
    return;
  }

  fs.update(
    bottomTabsAppearancePresenterPath,
    /for \(UIViewController\* childViewController in self\.tabBarController\.childViewControllers\)/g,
    'for (UIViewController* childViewController in self.tabBarController.childViewControllers) {'
  );

  fs.update(
    bottomTabsAppearancePresenterPath,
    'childViewController.tabBarItem.standardAppearance.backgroundColor = backgroundColor;',
    `childViewController.tabBarItem.standardAppearance.backgroundColor = backgroundColor;
        if (@available(iOS 15.0, *)) {
            childViewController.tabBarItem.scrollEdgeAppearance.backgroundColor = backgroundColor;
        }
    }`
  );

  fs.update(
    bottomTabsAppearancePresenterPath,
    '[childViewController.tabBarItem.standardAppearance configureWithDefaultBackground];',
    `[childViewController.tabBarItem.standardAppearance configureWithDefaultBackground];
        if (@available(iOS 15.0, *)) {
            [childViewController.tabBarItem.scrollEdgeAppearance configureWithDefaultBackground];
        }
    }`
  );

  fs.update(
    bottomTabsAppearancePresenterPath,
    '[childViewController.tabBarItem.standardAppearance configureWithTransparentBackground];',
    `[childViewController.tabBarItem.standardAppearance configureWithTransparentBackground];
        if (@available(iOS 15.0, *)) {
            [childViewController.tabBarItem.scrollEdgeAppearance configureWithTransparentBackground];
        }
    }`
  );

  fs.update(
    bottomTabsAppearancePresenterPath,
    '[childViewController.tabBarItem.standardAppearance configureWithOpaqueBackground];',
    `[childViewController.tabBarItem.standardAppearance configureWithOpaqueBackground];
        if (@available(iOS 15.0, *)) {
            [childViewController.tabBarItem.scrollEdgeAppearance configureWithOpaqueBackground];
        }
    }`
  );

  // Patch RNNBottomTabController.m

  const rnnBottomTabsControllerPath = path.project.resolve(
    'node_modules',
    'react-native-navigation',
    'lib',
    'ios',
    'RNNBottomTabsController.m'
  );

  fs.update(
    rnnBottomTabsControllerPath,
    'self.longPressRecognizer =',
    `if (@available(iOS 15.0, *)) {
        self.tabBar.scrollEdgeAppearance = [UITabBarAppearance new];
    }

    self.longPressRecognizer =`
  );

  // Patch TabBarItemApperanceCreator.m

  const tabBarItemApperanceCreatorPath = path.project.resolve(
    'node_modules',
    'react-native-navigation',
    'lib',
    'ios',
    'TabBarItemAppearanceCreator.m'
  );

  fs.update(
    tabBarItemApperanceCreatorPath,
    'tabBarItem.standardAppearance =',
    `if (@available(iOS 15.0, *)) {
        tabBarItem.scrollEdgeAppearance =
            mergeItem.scrollEdgeAppearance ?: [[UITabBarAppearance alloc] init];
    }

    tabBarItem.standardAppearance =`
  );

  fs.update(
    tabBarItemApperanceCreatorPath,
    'tabItem.standardAppearance.inlineLayoutAppearance.normal.titleTextAttributes = titleAttributes;',
    `tabItem.standardAppearance.inlineLayoutAppearance.normal.titleTextAttributes = titleAttributes;

    if (@available(iOS 15.0, *)) {
        tabItem.scrollEdgeAppearance.stackedLayoutAppearance.normal.titleTextAttributes = titleAttributes;
        tabItem.scrollEdgeAppearance.compactInlineLayoutAppearance.normal.titleTextAttributes =
            titleAttributes;
        tabItem.scrollEdgeAppearance.inlineLayoutAppearance.normal.titleTextAttributes = titleAttributes;
    }`
  );

  fs.update(
    tabBarItemApperanceCreatorPath,
    'tabItem.standardAppearance.inlineLayoutAppearance.selected.titleTextAttributes = selectedTitleAttributes;',
    `tabItem.standardAppearance.inlineLayoutAppearance.selected.titleTextAttributes = selectedTitleAttributes;

    if (@available(iOS 15.0, *)) {
      tabItem.scrollEdgeAppearance.stackedLayoutAppearance.selected.titleTextAttributes =
          selectedTitleAttributes;
      tabItem.scrollEdgeAppearance.compactInlineLayoutAppearance.selected.titleTextAttributes =
          selectedTitleAttributes;
      tabItem.scrollEdgeAppearance.inlineLayoutAppearance.selected.titleTextAttributes =
          selectedTitleAttributes;
    }`
  );

  // Patch UIViewController+RNNOptions.m

  const uiViewControllerRNNOptionsPath = path.project.resolve(
    'node_modules',
    'react-native-navigation',
    'lib',
    'ios',
    'UIViewController+RNNOptions.m'
  );

  fs.update(
    uiViewControllerRNNOptionsPath,
    'self.tabBarItem.standardAppearance.stackedLayoutAppearance.normal.badgeBackgroundColor = badgeColor;',
    `self.tabBarItem.standardAppearance.stackedLayoutAppearance.normal.badgeBackgroundColor = badgeColor;

        if (@available(iOS 15.0, *)) {
            self.tabBarItem.scrollEdgeAppearance.stackedLayoutAppearance.normal.badgeBackgroundColor =
                badgeColor;
        }`
  );

  logInfo('Successfully patched iOS for react-native-navigation');
}
