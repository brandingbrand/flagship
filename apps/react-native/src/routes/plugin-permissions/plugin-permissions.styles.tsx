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
    alignItems: 'center',
    backgroundColor: '#1e2126',
    justifyContent: 'space-around',
  },
  app$content$title: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: 'Roboto-Regular',
  },
  app$content$header: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto-Thin',
  },
  app$content$header$$italic: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto-ThinItalic',
  },
  app$content$permission: {
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  app$content$permission$button: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#4F9CF0',
  },
  app$content$permission$button$$yellow: {
    borderColor: '#FFCC00',
  },
  app$content$permission$button$text: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
  },
  app$content$close: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#FF655C',
    justifyContent: 'center',
  },
  app$content$close$text: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '900',
    fontFamily: 'Roboto-Bold',
  },
});
