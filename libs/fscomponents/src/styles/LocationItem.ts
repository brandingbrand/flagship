import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  bottomSection: {
    marginTop: 15,
  },
  container: {
    padding: 15,
  },
  distance: {
    marginTop: 5,
  },
  icon: {
    height: 30,
    width: 30,
  },
  leftSection: {
    flex: 1,
  },
  link: {
    color: 'blue',
  },
  linkButton: {
    alignItems: 'flex-start',
    height: 25,
    paddingLeft: 0,
    paddingRight: 0,
    width: 130,
  },
  linkButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  navIconContainer: {
    alignItems: 'center',
  },
  phoneIconContainer: {
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
    marginRight: 15,
    width: 100,
  },
  storeDetailContainer: {},
  storeImage: {
    height: 80,
    marginRight: 10,
    width: 80,
  },
  topSection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  twoIconsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
    width: 80,
  },
  twoIconsContainerVertical: {
    height: 75,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  twoIconsContainerVerticalTall: {
    height: 90,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
