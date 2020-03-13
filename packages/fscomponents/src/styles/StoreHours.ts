import {
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headerText: {
    fontSize: 15,
    color: '#000000',
    marginRight: 10
  },
  contentContainer: {
    paddingTop: 2
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 1
  },
  currentDay: {
    fontWeight: '700'
  },
  textDay: {
    fontSize: 12,
    color: '#000000',
    width: 95
  },
  textHours: {
    fontSize: 12,
    color: '#000000'
  }
});
