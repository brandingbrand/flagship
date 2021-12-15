import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    padding: 15,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    width: 100,
    alignItems: 'flex-end',
    marginRight: 15,
  },
  twoIconsContainer: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 15,
  },
  twoIconsContainerVertical: {
    height: 75,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  twoIconsContainerVerticalTall: {
    height: 90,
  },
  link: {
    color: 'blue',
  },
  bottomSection: {
    marginTop: 15,
  },
  icon: {
    width: 30,
    height: 30,
  },
  navIconContainer: {
    alignItems: 'center',
  },
  phoneIconContainer: {
    alignItems: 'center',
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  distance: {
    marginTop: 5,
  },
  storeDetailContainer: {},
  linkButton: {
    width: 130,
    alignItems: 'flex-start',
    paddingLeft: 0,
    paddingRight: 0,
    height: 25,
  },
  linkButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  storeImage: {
    marginRight: 10,
    width: 80,
    height: 80,
  },
});
