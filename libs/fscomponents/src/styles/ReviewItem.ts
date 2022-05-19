import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  button: {
    marginRight: 10,
    marginTop: 8,
    width: 120,
  },
  container: {
    flexDirection: 'column',
    padding: 10,
  },
  helpful: {
    color: '#555',
    fontSize: 14,
  },
  indicator: {
    marginBottom: 2,
    marginLeft: -3,
  },
  recommended: {
    color: '#000',
    fontSize: 15,
  },
  row: {
    paddingBottom: 8,
  },
  syndicatedLabel: {
    color: '#767676',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 13,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  user: {
    color: '#555',
  },
  verified: {
    color: '#c45500',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
