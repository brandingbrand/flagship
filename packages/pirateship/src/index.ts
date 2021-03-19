import { FSApp } from '@brandingbrand/fsapp';
import ScreenVisibilityListener from './lib/ScreenVisibilityListener';
import { appConfig } from './appConfig';

const app: FSApp = new FSApp(appConfig);

export default app;

const screenVisibilityListener = new ScreenVisibilityListener();
screenVisibilityListener.register();
