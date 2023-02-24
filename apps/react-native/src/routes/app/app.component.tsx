// @ts-ignore
import {HermesBadge} from 'react-native/Libraries/NewAppScreen';

import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import styles from './app.styles';
import {plugins} from '../../lib';
import {images} from '../../assets';
import Controller from './app.controller';

export default () => {
  return (
    <Controller>
      {({onPressDocs, onPressLink}) => (
        <SafeAreaView style={styles.app}>
          <View>
            <HermesBadge />
          </View>
          <View style={styles.app$content}>
            <Image source={images.logo} style={styles.app$content$logo} />
            <View>
              <Text style={styles.app$content$title}>
                Welcome <Text style={styles.app$content$title$$yellow}>to</Text>{' '}
                <Text style={styles.app$content$title$$red}>Flagship™</Text>{' '}
                <Text style={styles.app$content$title$$blue}>Code!</Text>
              </Text>
              <Text style={styles.app$content$header}>
                Typesafe Configuration as Code toolkit for React Native
              </Text>
            </View>
            <View style={styles.app$content$link}>
              <TouchableOpacity
                style={styles.app$content$link$button}
                onPress={onPressDocs}>
                <Text style={styles.app$content$link$button$text}>
                  See the docs
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.app$content$link}>
              <Text style={styles.app$content$plugins}>
                {plugins.map(it => (
                  <React.Fragment key={it}>
                    <Text
                      onPress={onPressLink(it)}
                      style={styles.app$content$plugins$$underline}>
                      {it}
                    </Text>
                    <Text>{'   '}</Text>
                  </React.Fragment>
                ))}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      )}
    </Controller>
  );
};
