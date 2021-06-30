import React, { FunctionComponent, memo, useState } from 'react';

import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { ReviewTypes } from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.reviews;

const S = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20
  },
  syndicatedLabel: {
    color: '#767676',
    fontSize: 13,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

export interface SyndicationIndicatorProps {
  syndicationSource: ReviewTypes.SyndicationSource;
  rowStyle?: StyleProp<ViewStyle>;
}

export const SyndicationIndicator: FunctionComponent<SyndicationIndicatorProps> =
  memo((props): JSX.Element => {
    const [syndicatedImageHeight, setSyndicatedImageHeight] = useState<number>();
    const [syndicatedImageWidth, setSyndicatedImageWidth] = useState<number>();

    const getImageSizeSuccess = (w: number, h: number) => {
      if (!syndicatedImageHeight || !syndicatedImageWidth) {
        setSyndicatedImageHeight(h);
        setSyndicatedImageWidth(w);
      }
    };

    Image.getSize(
      props.syndicationSource.LogoImageUrl || '',
      getImageSizeSuccess,
      () => null
    );

    return (
      <View
        style={[
          S.row, { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20 },
          props.rowStyle
        ]}
      >
        <Image
          style={{
            height: syndicatedImageHeight,
            width: syndicatedImageWidth,
            marginRight: 6
          }}
          source={{ uri: props.syndicationSource.LogoImageUrl }}
          accessibilityLabel={`${props.syndicationSource.Name} logo`}
        />
        <Text style={[S.syndicatedLabel]}>
          {FSI18n.string(componentTranslationKeys.syndicatedLabel, {
            site: props.syndicationSource.Name
          })}
        </Text>
      </View>
    );
  });
