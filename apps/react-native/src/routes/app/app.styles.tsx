import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#1e2126',
  },
  app$content: {
    flex: 1,
    marginVertical: 100,
    marginHorizontal: 20,
    alignItems: 'flex-start',
    backgroundColor: '#1e2126',
    justifyContent: 'space-around',
  },
  app$content$logo: {
    resizeMode: 'contain',
  },
  app$content$title: {
    fontSize: 50,
    color: '#ffffff',
    fontWeight: '900',
    fontFamily: 'Roboto-Regular',
  },
  app$content$title$$yellow: {
    color: '#FFCC00',
  },
  app$content$title$$blue: {
    color: '#4F9CF0',
  },
  app$content$title$$red: {
    color: '#FF655C',
  },
  app$content$header: {
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'Roboto-Thin',
  },
  app$content$link: {
    width: '100%',
    alignItems: 'center',
  },
  app$content$link$button: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#4F9CF0',
  },
  app$content$link$button$text: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
  },
  app$content$plugins: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Roboto-Light',
  },
  app$content$plugins$$underline: {
    textDecorationLine: 'underline',
  },
});
