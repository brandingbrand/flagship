import { StyleSheet } from 'react-native';

export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#B721FF',
  background2: '#21D4FD'
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black
  },
  container: {
    flex: 1,
    backgroundColor: colors.background1
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
  scrollview: {
    flex: 1
  },
  exampleContainer: {
    paddingVertical: 30
  },
  exampleContainerDark: {
    backgroundColor: colors.black
  },
  exampleContainerLight: {
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  titleDark: {
    color: colors.black
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  slider: {
    overflow: 'visible'
  },
  loadingInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderContentContainer: {},
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },
  pageCounter: {

  },
  pageNum: {
    color: '#000',
    fontWeight: '500',
    fontFamily: 'Arial',
    fontSize: 17,
    letterSpacing: 1
  }
});
