import { Navigation } from 'react-native-navigation';

export const goToNavPush = (
  scope: string,
  componentId: string,
  screen: string,
  title: string,
  backButtonTitle: string
): void => {
  Navigation.push(componentId, {
    component: {
      name: `${scope}.${screen}`,
      options: {
        topBar: {
          title: {
            text: title
          },
          backButton: {
            title: backButtonTitle
          }
        }
      }
    }
  }).catch(err => console.warn(`${scope}.${screen} PUSH error: `, err));
};

export const showDataNavPush = (componentId: string, data: any): void => {
  Navigation.push(componentId, {
    component: {
      name: 'fscommerce.DataView',
      passProps: {
        json: JSON.stringify(data, null, '  ')
      }
    }
  }).catch(err => console.warn('fscommerce.DataView PUSH error: ', err));
};
