import { Dimensions, Platform, StyleSheet } from 'react-native';
import { colors } from './index.style';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth } = Dimensions.get('window');

export function wp(percentage: any): any {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const entryBorderRadius = 0;

export default StyleSheet.create({
  imageContainerNoCard: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white'
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  imageContainerEven: {
    backgroundColor: colors.black
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover'
  },
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white'
  },
  radiusMaskEven: {
    backgroundColor: colors.black
  },
  textContainer: {
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 16,
    height: 65
  },
  productContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 10
  },
  price: {
    marginTop: 2,
    color: '#000',
    fontSize: 15,
    fontFamily: 'Arial-BoldMT'
  },
  stars: {
    width: 100,
    height: 22
  },
  textContainerEven: {
    backgroundColor: colors.black
  },
  prodTitle: {
    color: colors.black,
    fontSize: 15,
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontWeight: '400'
  },
  title: {
    color: colors.black,
    fontSize: 12,
    fontWeight: 'normal',
    letterSpacing: 0.5
  },
  titleEven: {
    color: 'white'
  },
  subtitle: {
    marginTop: 6,
    color: colors.black,
    fontSize: 12,
    fontFamily: 'Arial-BoldMT'
  }
});
