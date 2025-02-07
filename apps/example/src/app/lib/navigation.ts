import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigationService = {
  navigate: (name: keyof RootStackParamList, params?: any) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
  },
  // Add other navigation methods as needed
};
