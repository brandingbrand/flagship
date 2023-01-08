import fetch from './fetch.polyfill';
import localStorage from './local-storage.polyfill';
import location from './location.polyfill';
import navigator from './navigator.polyfill';
import requestAnimationFrame from './request-animation-frame.polyfill';

export = {
  location,
  fetch,
  navigator,
  requestAnimationFrame,
  localStorage,
  screen: {
    width: 1024,
    height: 1024,
  },
  RegExp: () => {},
  /**
   * Used to flag `canUseDOM` as false.
   *
   * @see https://github.com/facebook/fbjs/blob/d8f0f430a689ee1e5bb070d501155fa29e329019/packages/fbjs/src/core/ExecutionEnvironment.js#L12-L16
   */
  document: undefined,
  CSS: {
    supports: () => true,
  },
};
