import {Navigation} from 'react-native-navigation';
import App from './App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ProvidedApp = (props) => {
  return (
    <SafeAreaProvider>
      <App {...props} />
    </SafeAreaProvider>
  )
}
Navigation.registerComponent('App', () => ProvidedApp);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'App',
            },
          },
        ],
      },
    },
  });
});
