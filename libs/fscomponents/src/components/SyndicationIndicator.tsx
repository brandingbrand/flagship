import type { FunctionComponent } from 'react';
import React, { memo, useState } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { ReviewTypes } from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const componentTranslationKeys = translationKeys.flagship.reviews;

const S = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  syndicatedLabel: {
    color: '#767676',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 13,
    justifyContent: 'center',
  },
});

export interface SyndicationIndicatorProps {
  syndicationSource: ReviewTypes.SyndicationSource;
  rowStyle?: StyleProp<ViewStyle>;
}

export const SyndicationIndicator: FunctionComponent<SyndicationIndicatorProps> = memo(
  (props): JSX.Element => {
    const [syndicatedImageHeight, setSyndicatedImageHeight] = useState<number>();
    const [syndicatedImageWidth, setSyndicatedImageWidth] = useState<number>();

    const getImageSizeSuccess = (w: number, h: number) => {
      if (!syndicatedImageHeight || !syndicatedImageWidth) {
        setSyndicatedImageHeight(h);
        setSyndicatedImageWidth(w);
      }
    };

    Image.getSize(props.syndicationSource.LogoImageUrl || '', getImageSizeSuccess, () => null);

    return (
      <View
        style={[
          S.row,
          { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20 },
          props.rowStyle,
        ]}
      >
        <Image
          accessibilityLabel={`${props.syndicationSource.Name} logo`}
          source={{ uri: props.syndicationSource.LogoImageUrl }}
          style={{
            height: syndicatedImageHeight,
            width: syndicatedImageWidth,
            marginRight: 6,
          }}
        />
        <Text style={S.syndicatedLabel}>
          {FSI18n.string(componentTranslationKeys.syndicatedLabel, {
            site: props.syndicationSource.Name,
          })}
        </Text>
      </View>
    );
  }
);
