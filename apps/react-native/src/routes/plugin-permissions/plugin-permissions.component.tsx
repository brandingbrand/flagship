import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import styles from './plugin-permissions.styles';
import Controller from './plugin-permissions.controller';

export default () => {
  return (
    <Controller>
      {({onPressDocs, onPressClose, onPressCamera, onPressLocation}) => (
        <SafeAreaView style={styles.app}>
          <View style={styles.app$content}>
            <View>
              <Text style={styles.app$content$title}>Plugin Permissions</Text>
              <Text style={styles.app$content$header}>
                <Text style={styles.app$content$header$$italic}>
                  @brandingbrand/code-plugin-permissions
                </Text>{' '}
                is a package that configures all the necessary native code for
                the{' '}
                <Text style={styles.app$content$header$$italic}>
                  react-native-permissions
                </Text>{' '}
                library.
              </Text>
            </View>
            <View style={styles.app$content$permission}>
              <TouchableOpacity
                style={[
                  styles.app$content$permission$button,
                  styles.app$content$permission$button$$yellow,
                ]}
                onPress={onPressLocation}>
                <Text style={styles.app$content$permission$button$text}>
                  Location
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.app$content$permission$button,
                  styles.app$content$permission$button$$yellow,
                ]}
                onPress={onPressCamera}>
                <Text style={styles.app$content$permission$button$text}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.app$content$permission$button}
              onPress={onPressDocs}>
              <Text style={styles.app$content$permission$button$text}>
                See the docs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressClose}
              style={styles.app$content$close}>
              <Text style={styles.app$content$close$text}>X</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </Controller>
  );
};
